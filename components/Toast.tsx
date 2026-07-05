"use client";

import { X, Mail } from "lucide-react";
import type { ToastData } from "@/hooks/useToast";

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#0a66c2" }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4 text-zinc-300 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.737-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50" style={{ animation: "toastSlideIn 0.2s ease-out" }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white rounded-2xl shadow-xl max-w-xs">
        {toast.icon === "linkedin" && <LinkedInIcon />}
        {toast.icon === "email" && <Mail className="w-4 h-4 text-violet-400 shrink-0" />}
        {toast.icon === "x" && <XIcon />}
        <p className="text-sm flex-1 leading-snug">{toast.message}</p>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-white transition-colors shrink-0 ml-1"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
