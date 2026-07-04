import { NextRequest } from "next/server";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import { BrandVoiceProfile } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const encoder = new TextEncoder();

function sse(data: object): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

// ── Tool 1: fetch_page ──────────────────────────────────────────

async function fetchPage(
  url: string
): Promise<{ text: string; title: string; meta: string; html: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BrandVoice/1.0; +https://brandvoice.app)",
        Accept: "text/html",
      },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);

    // Strip noise
    $("script, style, noscript, nav, footer, header, [class*='cookie'], [id*='cookie'], [class*='banner'], [class*='popup']").remove();

    const title = $("title").first().text().trim();
    const meta = $('meta[name="description"]').attr("content") ?? "";
    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 6000);

    return { text, title, meta, html };
  } catch {
    return null;
  }
}

// ── Tool 2: extract_and_score_links ────────────────────────────

async function extractAndScoreLinks(
  html: string,
  baseUrl: string,
  send: (d: object) => void
): Promise<Array<{ url: string; priority: string; page_type: string }>> {
  const $ = cheerio.load(html);
  const base = new URL(baseUrl);

  const seen = new Set<string>();
  const links: string[] = [];

  $("a[href]").each((_, el) => {
    try {
      const href = $(el).attr("href")!;
      const abs = new URL(href, base).toString();
      // Same origin, not anchor/mailto/social
      if (
        new URL(abs).hostname === base.hostname &&
        !abs.includes("#") &&
        !abs.startsWith("mailto:") &&
        !seen.has(abs)
      ) {
        seen.add(abs);
        links.push(abs);
      }
    } catch { /* skip malformed */ }
  });

  if (links.length === 0) return [];

  send({ type: "log", message: `Found ${links.length} internal links. Identifying the most relevant pages...` });

  const prompt = `Given this list of internal URLs from a company website, classify each one.

URLs:
${links.slice(0, 60).join("\n")}

Classify each as:
- HIGH: About, Team, Mission, Blog, News, Press, Product, Platform, How it works, Case Studies, Customers
- MEDIUM: Careers, Investors, Partners, Resources, Docs
- LOW: Login, Pricing, Contact, Privacy, Terms, Cookie, FAQ
- SKIP: External links, anchors, mailto, social media, pagination

Return a JSON array: [{"url": "...", "priority": "HIGH|MEDIUM|LOW|SKIP", "page_type": "..."}]
Return ONLY the JSON array, no other text.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: 'You classify URLs. Return {"links": [...]} with the classified array.',
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  return (parsed.links ?? parsed) as Array<{ url: string; priority: string; page_type: string }>;
}

// ── Tool 3: synthesize_brand_voice ─────────────────────────────

async function synthesizeBrandVoice(
  pagesContent: Array<{ url: string; title: string; text: string }>
): Promise<BrandVoiceProfile> {
  const corpus = pagesContent
    .map(p => `## ${p.title} (${p.url})\n${p.text}`)
    .join("\n\n---\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a senior brand strategist. Analyze the following company content and extract a structured brand voice profile. Be specific — avoid generic descriptors like "professional" or "innovative." Look for actual patterns in word choice, sentence structure, what they emphasize, and what they conspicuously avoid.

Return JSON with exactly these fields:
{
  "tone_descriptors": ["4-6 specific adjectives with brief evidence in format 'Adjective — explanation'"],
  "signature_phrases": ["5-8 phrases or constructions the brand actually uses, quoted directly or closely paraphrased"],
  "avoid_list": ["4-6 things this brand never says or does in content, phrased as rules like 'Never uses...'"],
  "content_style": "1-2 sentences describing sentence length, structure, rhythm",
  "values_emphasis": ["3-4 themes the brand consistently foregrounds"],
  "raw_chunks": ["8-10 verbatim sentences from the content best representing the voice"]
}`,
      },
      {
        role: "user",
        content: `Analyze this company content and extract the brand voice profile:\n\n${corpus}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as BrandVoiceProfile;
}

// ── Main route ──────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "OPENAI_API_KEY is not configured." })}\n\n`,
      { headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const { url } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => controller.enqueue(sse(data));
      const log = (message: string) => send({ type: "log", message });

      try {
        // Step 1: Fetch homepage
        log(`Fetching homepage...`);
        const homepage = await fetchPage(url);

        if (!homepage) {
          send({
            type: "error",
            message: `We couldn't reach that URL. Try the homepage directly, or paste your content manually below.`,
          });
          controller.close();
          return;
        }

        // Step 2: Score links
        let scored: Array<{ url: string; priority: string; page_type: string }> = [];
        try {
          scored = await extractAndScoreLinks(homepage.html, url, send);
        } catch {
          log("Couldn't score links — proceeding with homepage content only.");
        }

        const high = scored.filter(l => l.priority === "HIGH").slice(0, 6);
        const medium = scored.filter(l => l.priority === "MEDIUM").slice(0, Math.max(0, 4 - high.length));
        const toFetch = [...high, ...medium].slice(0, 8);

        const pageTypes = [...new Set(toFetch.map(l => l.page_type).filter(Boolean))];
        if (pageTypes.length > 0) {
          log(`Prioritizing: ${pageTypes.join(", ")}`);
        }

        // Step 3: Fetch top pages in parallel
        const fetchedPages: Array<{ url: string; title: string; text: string }> = [
          { url, title: homepage.title || "Homepage", text: homepage.text },
        ];

        const pageResults = await Promise.allSettled(
          toFetch.map(async (link) => {
            log(`Reading ${link.page_type || new URL(link.url).pathname} page...`);
            const page = await fetchPage(link.url);
            if (page) fetchedPages.push({ url: link.url, title: page.title || link.url, text: page.text });
          })
        );

        const successCount = pageResults.filter(r => r.status === "fulfilled").length + 1; // +1 for homepage

        if (fetchedPages.length < 2) {
          send({
            type: "partial",
            message: `We could only access ${fetchedPages.length} page — the brand profile may be limited. You can add more content manually below before continuing.`,
            partialContent: fetchedPages[0]?.text ?? "",
          });
          controller.close();
          return;
        }

        // Step 4: Synthesize brand voice
        log("Extracting brand voice signals...");
        let profile: BrandVoiceProfile;

        try {
          profile = await synthesizeBrandVoice(fetchedPages);
        } catch {
          // Retry once
          try {
            profile = await synthesizeBrandVoice(fetchedPages);
          } catch {
            // Fallback: just use raw text chunks
            const allText = fetchedPages.map(p => p.text).join("\n\n");
            const sentences = allText.match(/[^.!?]+[.!?]+/g) ?? [];
            profile = {
              tone_descriptors: [],
              signature_phrases: [],
              avoid_list: [],
              content_style: "",
              values_emphasis: [],
              raw_chunks: sentences.filter(s => s.trim().length > 40).slice(0, 10),
            };
            send({ type: "notice", message: "We extracted content but couldn't build a full voice profile. Generation will still use your brand's language." });
          }
        }

        log(`Done. Analyzed ${successCount} pages.`);

        const pagesAnalyzed = fetchedPages.map(p => p.title || p.url);

        send({ type: "profile", brandProfile: profile, pagesAnalyzed });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
