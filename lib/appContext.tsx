"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AudienceId, GeneratedOutput, OnboardingState, BrandVoiceProfile } from "@/types";

interface AppContextValue {
  onboarding: OnboardingState;
  setOnboarding: (s: OnboardingState) => void;
  outputs: GeneratedOutput[];
  setOutputs: (o: GeneratedOutput[]) => void;
  brandVoiceSource: "url" | "manual" | null;
  setBrandVoiceSource: (s: "url" | "manual" | null) => void;
  brandVoiceProfile: BrandVoiceProfile | null;
  setBrandVoiceProfile: (p: BrandVoiceProfile | null) => void;
  agentLog: string[];
  setAgentLog: (l: string[]) => void;
  pagesAnalyzed: string[];
  setPagesAnalyzed: (p: string[]) => void;
}

const defaultOnboarding: OnboardingState = {
  brandContent: "",
  selectedAudiences: ["investor", "partner", "technical", "talent", "press"],
  milestone: "",
};

const AppContext = createContext<AppContextValue>({
  onboarding: defaultOnboarding,
  setOnboarding: () => {},
  outputs: [],
  setOutputs: () => {},
  brandVoiceSource: null,
  setBrandVoiceSource: () => {},
  brandVoiceProfile: null,
  setBrandVoiceProfile: () => {},
  agentLog: [],
  setAgentLog: () => {},
  pagesAnalyzed: [],
  setPagesAnalyzed: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [onboarding, setOnboarding] = useState<OnboardingState>(defaultOnboarding);
  const [outputs, setOutputs] = useState<GeneratedOutput[]>([]);
  const [brandVoiceSource, setBrandVoiceSource] = useState<"url" | "manual" | null>(null);
  const [brandVoiceProfile, setBrandVoiceProfile] = useState<BrandVoiceProfile | null>(null);
  const [agentLog, setAgentLog] = useState<string[]>([]);
  const [pagesAnalyzed, setPagesAnalyzed] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        onboarding, setOnboarding,
        outputs, setOutputs,
        brandVoiceSource, setBrandVoiceSource,
        brandVoiceProfile, setBrandVoiceProfile,
        agentLog, setAgentLog,
        pagesAnalyzed, setPagesAnalyzed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
