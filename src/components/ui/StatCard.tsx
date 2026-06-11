import Link from "next/link";

interface StatCardProps {
  label:      string;
  value:      string | number;
  icon?:      string;
  sub?:       string;
  color?:     string;
  trend?:     "up" | "down" | "neutral";
  href?:      string;
  className?: string;
}

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  green:  { bg: "bg-green-500/10",  border: "border-green-500/20",  text: "text-green-400"  },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400" },
  yellow: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400" },
  red:    { bg: "bg-red-500/10",    border: "border-red-500/20",    text: "text-red-400"    },
  cyan:   { bg: "bg-cyan-500/10",   border: "border-cyan-500/20",   text: "text-cyan-400"   },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/20", text: "text-indigo-400" },
  sky:    { bg: "bg-sky-500/10",    border: "border-sky-500/20",    text: "text-sky-400"    },
  amber:  { bg: "bg-amber-500/10",  border: "border-amber-500/20",  text: "text-amber-400"  },
};

export default function StatCard({ label, value, icon, sub, color = "green", trend, href, className = "" }: StatCardProps) {
  const c = colorMap[color] ?? colorMap.green;
  const trendIcon = trend === "up" ? "↑" : trend === "down" ? "↓" : "";
  const trendColor = trend === "up" ? "text-green-400" : trend === "down" ? "text-red-400" : "";

  const inner = (
    <div className={`bg-surface-800 border border-white/8 rounded-2xl p-4 card-hover ${href ? "cursor-pointer" : ""} ${className}`}>
      {icon && (
        <div className={`w-8 h-8 rounded-lg ${c.bg} ${c.border} border flex items-center justify-center text-base mb-3`}>
          {icon}
        </div>
      )}
      <div className={`font-display text-2xl tracking-widest ${c.text} leading-none`}>
        {value}
        {trendIcon && <span className={`text-sm ml-1 ${trendColor}`}>{trendIcon}</span>}
      </div>
      <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest mt-1">{label}</div>
      {sub && <div className="font-mono text-[9px] text-white/25 mt-0.5">{sub}</div>}
    </div>
  );

  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
