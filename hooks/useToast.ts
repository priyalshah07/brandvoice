"use client";

import { useState, useCallback, useRef } from "react";

export interface ToastData {
  id: number;
  message: string;
  icon?: "linkedin" | "email" | "x";
}

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const showToast = useCallback((message: string, icon?: ToastData["icon"]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ id: ++idRef.current, message, icon });
    timerRef.current = setTimeout(() => setToast(null), 5000);
  }, []);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  return { toast, showToast, dismissToast };
}
