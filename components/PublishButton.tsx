"use client";

import { useState } from "react";
import { Share2, Mail, ExternalLink, Info } from "lucide-react";
import { AudienceId } from "@/types";

interface PublishButtonProps {
  audienceId: AudienceId;
  content: string;
  milestone: string;
  onToast: (message: string, icon?: "linkedin" | "email" | "x") => void;
}

function getEmailSubject(milestone: string): string {
  const cleaned = milestone.replace(/[#*_`[\]()>]/g, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean).slice(0, 7).join(" ");
  if (!words) return "Thought this might be relevant";
  return "Following up — " + words.charAt(0).toUpperCase() + words.slice(1);
}

function parseFirstTweet(content: string): string {
  const lines = content.split("\n");
  const startIdx = lines.findIndex(l => /^1\//.test(l.trim()));
  if (startIdx === -1) return content.slice(0, 280);
  const tweetLines: string[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    if (i > startIdx && /^\d+\//.test(lines[i].trim())) break;
    tweetLines.push(lines[i]);
  }
  return tweetLines.join("\n").slice(0, 280);
}

const BASE_CLS =
  "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 transition-all";

export default function PublishButton({ audienceId, content, milestone, onToast }: PublishButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // LinkedIn audiences
  if (audienceId === "investor" || audienceId === "talent") {
    return (
      <button
        className={BASE_CLS}
        onClick={async () => {
          await navigator.clipboard.writeText(content);
          window.open("https://www.linkedin.com/feed/", "_blank", "noopener");
          onToast("Copied to clipboard — paste it into your LinkedIn post", "linkedin");
        }}
      >
        <Share2 className="w-3 h-3" />
        Copy & Open LinkedIn
      </button>
    );
  }

  // Email audiences
  if (audienceId === "partner" || audienceId === "press") {
    const subject = getEmailSubject(milestone);
    return (
      <a
        href={`mailto:?subject=${encodeURIComponent(subject)}`}
        className={BASE_CLS}
        onClick={async () => {
          await navigator.clipboard.writeText(content);
          onToast("Copied to clipboard — paste into your email", "email");
        }}
      >
        <Mail className="w-3 h-3" />
        Open in Email
      </a>
    );
  }

  // X / Twitter thread
  if (audienceId === "technical") {
    const firstTweet = parseFirstTweet(content);
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <button
            className={BASE_CLS}
            onClick={() => {
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(firstTweet)}`;
              window.open(url, "_blank", "noopener");
            }}
          >
            <ExternalLink className="w-3 h-3" />
            Post Thread to X
          </button>
          <div className="relative">
            <button
              className="text-zinc-300 hover:text-zinc-500 transition-colors"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              aria-label="Thread posting info"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 px-3 py-2 bg-zinc-900 text-white text-xs rounded-lg shadow-lg z-20 leading-relaxed pointer-events-none">
                Opens tweet 1 in X — post the remaining tweets as replies to complete the thread
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-zinc-400">Posts tweet 1. Reply with tweets 2–5 to complete the thread.</p>
      </div>
    );
  }

  return null;
}
