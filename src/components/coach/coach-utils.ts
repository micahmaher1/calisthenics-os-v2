import { RecommendationPriority } from "@/lib/coach-types";

export const PRIORITY_STYLES: Record<RecommendationPriority, {
  bg: string; border: string; text: string; label: string; dot: string;
}> = {
  critical: { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-300",    label: "Critical", dot: "bg-red-400"    },
  high:     { bg: "bg-orange-500/8",  border: "border-orange-500/25", text: "text-orange-300", label: "High",     dot: "bg-orange-400" },
  medium:   { bg: "bg-sky-500/8",     border: "border-sky-500/20",    text: "text-sky-300",    label: "Medium",   dot: "bg-sky-400"    },
  low:      { bg: "bg-surface-700/50",border: "border-white/8",       text: "text-white/60",   label: "Low",      dot: "bg-white/30"   },
};
