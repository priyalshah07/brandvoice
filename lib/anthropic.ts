import OpenAI from "openai";
import { AudienceId, GeneratedOutput } from "@/types";
import { AUDIENCE_PROMPTS } from "./prompts";
import { chunkText, EmbeddedChunk, retrieveTopK } from "./vectorStore";
import { embedTexts, embedQuery } from "./embeddings";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function buildVectorStore(brandContent: string): Promise<EmbeddedChunk[]> {
  const chunks = chunkText(brandContent);
  const embeddings = await embedTexts(chunks);
  return chunks.map((text, i) => ({ text, embedding: embeddings[i] }));
}

async function generateForAudience(
  audienceId: AudienceId,
  milestone: string,
  store: EmbeddedChunk[]
): Promise<GeneratedOutput> {
  // Retrieve brand context relevant to this audience
  const queryEmbedding = await embedQuery(`${audienceId} ${milestone}`);
  const brandChunks = retrieveTopK(queryEmbedding, store, 3);
  const brandContext = brandChunks.join("\n\n---\n\n");

  const { system, user } = AUDIENCE_PROMPTS[audienceId](brandContext, milestone);

  const message = await client.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 400,
    temperature: 0.7,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = message.choices[0]?.message?.content ?? "";
  const wordCount = content.trim().split(/\s+/).length;

  return { audienceId, content, wordCount };
}

export async function generateAllOutputs(
  brandContent: string,
  selectedAudiences: AudienceId[],
  milestone: string
): Promise<GeneratedOutput[]> {
  const store = await buildVectorStore(brandContent);

  // Run all generations in parallel
  const results = await Promise.allSettled(
    selectedAudiences.map(id => generateForAudience(id, milestone, store))
  );

  return results.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    return {
      audienceId: selectedAudiences[i],
      content: "",
      wordCount: 0,
      error: result.reason?.message || "Generation failed",
    };
  });
}

export async function generateSingleOutput(
  audienceId: AudienceId,
  brandContent: string,
  milestone: string
): Promise<GeneratedOutput> {
  const store = await buildVectorStore(brandContent);
  return generateForAudience(audienceId, milestone, store);
}
