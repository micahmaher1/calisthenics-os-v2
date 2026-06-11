"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BOTTOM_NAV_ITEMS } from "@/lib/navigation-config";

const colorMap: Record<string, string> = {
  green:  "text-green-400",
  cyan:   "text-cyan-400",
  orange: "text-orange-400",
  purple: "text-purple-400",
  red:    "text-red-400",
  yellow: "text-yellow-400",
  indigo: "text-indigo-400",
  amber:  "text-amber-400",
  sky:    "text-sky-400",
};

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface-900/95 backdrop-blur-xl border-t border-white/8 pb-4">
      <div className="flex items-stretch justify-around px-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const textColor = isActive ? (colorMap[item.color] ?? "text-green-400") : "text-white/30";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 py-3 flex-1 min-h-[56px] transition-all ${
                isActive ? "opacity-100" : "hover:opacity-70"
              }`}
            >
              <span
                className={`text-xl leading-none transition-all ${textColor} ${
                  isActive ? "drop-shadow-[0_0_6px_currentColor]" : ""
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-widest transition-colors hidden xs:block ${textColor}`}
              >
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
