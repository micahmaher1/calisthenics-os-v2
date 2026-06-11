"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { loadAvatar, loadProfile } from "@/lib/profile-storage";
import { getInitials } from "@/lib/profile-utils";

interface HeaderProps {
  rank:  string;
  level: number;
}

const NAV_ITEMS = [
  { href: "/",                 label: "Hub",       icon: "⚡", color: "green"   },
  { href: "/coach",            label: "Coach",     icon: "🤖", color: "purple"  },
  { href: "/quests",           label: "Quests",    icon: "⚔️",  color: "orange"  },
  { href: "/records",          label: "Records",   icon: "📊", color: "green"   },
  { href: "/workouts",         label: "Workouts",  icon: "💪", color: "green"   },
  { href: "/journeys",         label: "Journeys",  icon: "🗺️",  color: "cyan"    },
  { href: "/tree",             label: "Tree",      icon: "🌳", color: "emerald" },
  { href: "/mastery",          label: "Mastery",   icon: "⚡", color: "indigo"  },
  { href: "/standards",        label: "Standards", icon: "🏅", color: "amber"   },
  { href: "/skills",           label: "Skills",    icon: "🎯", color: "teal"    },
  { href: "/legendary-skills", label: "Legendary", icon: "👑", color: "yellow"  },
  { href: "/library",          label: "Library",   icon: "📚", color: "slate"   },
  { href: "/titles",           label: "Titles",    icon: "🎖️",  color: "yellow"  },
  { href: "/achievements",     label: "Achieve",   icon: "🏆", color: "yellow"  },
  { href: "/streaks",          label: "Streaks",   icon: "🔥", color: "red"     },
  { href: "/progress",         label: "Progress",  icon: "📈", color: "sky"     },
  { href: "/shop",             label: "Shop",      icon: "🛒", color: "amber"   },
];

// Pre-built active/hover classes — no dynamic interpolation
const colorMap: Record<string, { dot: string; activePill: string; activeText: string }> = {
  green:   { dot: "bg-green-400",   activePill: "bg-green-500/10 border-green-500/30",   activeText: "text-green-400"   },
  purple:  { dot: "bg-purple-400",  activePill: "bg-purple-500/10 border-purple-500/30", activeText: "text-purple-400"  },
  orange:  { dot: "bg-orange-400",  activePill: "bg-orange-500/10 border-orange-500/30", activeText: "text-orange-400"  },
  amber:   { dot: "bg-amber-400",   activePill: "bg-amber-500/10 border-amber-500/30",   activeText: "text-amber-400"   },
  yellow:  { dot: "bg-yellow-400",  activePill: "bg-yellow-500/10 border-yellow-500/30", activeText: "text-yellow-400"  },
  sky:     { dot: "bg-sky-400",     activePill: "bg-sky-500/10 border-sky-500/30",       activeText: "text-sky-400"     },
  emerald: { dot: "bg-emerald-400", activePill: "bg-emerald-500/10 border-emerald-500/30", activeText: "text-emerald-400" },
  cyan:    { dot: "bg-cyan-400",    activePill: "bg-cyan-500/10 border-cyan-500/30",     activeText: "text-cyan-400"    },
  indigo:  { dot: "bg-indigo-400",  activePill: "bg-indigo-500/10 border-indigo-500/30", activeText: "text-indigo-400"  },
  slate:   { dot: "bg-slate-400",   activePill: "bg-slate-500/10 border-slate-500/30",   activeText: "text-slate-300"   },
  red:     { dot: "bg-red-400",     activePill: "bg-red-500/10 border-red-500/30",       activeText: "text-red-400"     },
  teal:    { dot: "bg-teal-400",    activePill: "bg-teal-500/10 border-teal-500/30",     activeText: "text-teal-400"    },
};

export default function Header({ rank, level }: HeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials,  setInitials]  = useState("?");
  const pathname = usePathname();

  useEffect(() => {
    setAvatarUrl(loadAvatar());
    const p = loadProfile();
    setInitials(getInitials(p.name, p.displayName));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Single unified bar */}
      <div className="flex items-center gap-2 px-3 h-11">

        {/* Logo — minimal */}
        <Link
          href="/"
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <div className="w-6 h-6 rounded-md bg-green-500/10 border border-green-500/25 flex items-center justify-center text-[11px] transition-colors group-hover:border-green-500/50">
            ⚡
          </div>
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-white/70 group-hover:text-white/90 transition-colors hidden md:block">
            CALISTHENICS<span className="text-green-400/70">.OS</span>
          </span>
        </Link>

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 flex-shrink-0 hidden md:block" />

        {/* Nav — scrollable, takes remaining space */}
        <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto scrollbar-hide min-w-0">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const c = colorMap[item.color] ?? colorMap.green;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium
                  whitespace-nowrap border transition-all duration-150 flex-shrink-0
                  ${isActive
                    ? `${c.activePill} ${c.activeText}`
                    : "border-transparent text-white/35 hover:text-white/65 hover:bg-white/[0.04]"
                  }
                `}
              >
                {/* Active dot indicator */}
                {isActive && (
                  <span className={`absolute -bottom-px left-1/2 -translate-x-1/2 w-1 h-px rounded-full ${c.dot} opacity-80`} />
                )}
                <span className="text-[12px] leading-none">{item.icon}</span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: level + avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Level chip */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07]">
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{rank}</span>
            <span className="w-px h-2.5 bg-white/10" />
            <span className="font-mono text-[9px] text-green-400/70 font-bold">Lv{level}</span>
          </div>

          {/* Avatar */}
          <Link
            href="/profile"
            className="w-7 h-7 rounded-full ring-1 ring-white/10 overflow-hidden bg-slate-800 border border-white/[0.08] flex items-center justify-center hover:ring-green-500/30 transition-all flex-shrink-0"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono text-[10px] text-white/50">{initials}</span>
            )}
          </Link>
        </div>

      </div>
    </header>
  );
}
