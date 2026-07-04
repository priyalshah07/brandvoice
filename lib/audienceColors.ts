import { AudienceId } from "@/types";

export interface AudienceColor {
  topBorder: string;       // border-t-4 color class
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  selectedBorder: string;
  selectedBg: string;
  selectedLabelText: string;
  selectedDescText: string;
  selectedFormatText: string;
  dot: string;             // loading card bounce dot
  gradient: string;        // for homepage preview card header
  checkBg: string;
  checkBorder: string;
}

export const AUDIENCE_COLORS: Record<AudienceId, AudienceColor> = {
  investor: {
    topBorder: "border-t-violet-500",
    badgeBg: "bg-violet-50",
    badgeText: "text-violet-700",
    badgeBorder: "border-violet-200",
    selectedBorder: "border-violet-500",
    selectedBg: "bg-violet-50/60",
    selectedLabelText: "text-violet-900",
    selectedDescText: "text-violet-700",
    selectedFormatText: "text-violet-500",
    dot: "bg-violet-500",
    gradient: "from-violet-500 to-purple-600",
    checkBg: "bg-violet-500",
    checkBorder: "border-violet-500",
  },
  partner: {
    topBorder: "border-t-sky-500",
    badgeBg: "bg-sky-50",
    badgeText: "text-sky-700",
    badgeBorder: "border-sky-200",
    selectedBorder: "border-sky-500",
    selectedBg: "bg-sky-50/60",
    selectedLabelText: "text-sky-900",
    selectedDescText: "text-sky-700",
    selectedFormatText: "text-sky-500",
    dot: "bg-sky-500",
    gradient: "from-sky-500 to-blue-600",
    checkBg: "bg-sky-500",
    checkBorder: "border-sky-500",
  },
  technical: {
    topBorder: "border-t-emerald-500",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200",
    selectedBorder: "border-emerald-500",
    selectedBg: "bg-emerald-50/60",
    selectedLabelText: "text-emerald-900",
    selectedDescText: "text-emerald-700",
    selectedFormatText: "text-emerald-500",
    dot: "bg-emerald-500",
    gradient: "from-emerald-500 to-teal-600",
    checkBg: "bg-emerald-500",
    checkBorder: "border-emerald-500",
  },
  talent: {
    topBorder: "border-t-amber-500",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200",
    selectedBorder: "border-amber-500",
    selectedBg: "bg-amber-50/60",
    selectedLabelText: "text-amber-900",
    selectedDescText: "text-amber-700",
    selectedFormatText: "text-amber-500",
    dot: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
    checkBg: "bg-amber-500",
    checkBorder: "border-amber-500",
  },
  press: {
    topBorder: "border-t-rose-500",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200",
    selectedBorder: "border-rose-500",
    selectedBg: "bg-rose-50/60",
    selectedLabelText: "text-rose-900",
    selectedDescText: "text-rose-700",
    selectedFormatText: "text-rose-500",
    dot: "bg-rose-500",
    gradient: "from-rose-500 to-pink-600",
    checkBg: "bg-rose-500",
    checkBorder: "border-rose-500",
  },
};
