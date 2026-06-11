"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// All secondary routes (horizontally scrollable strip)
const ALL_ROUTES = [
  { href: "/coach",            icon: "🤖", label: "Coach"     },
  { href: "/records",          icon: "📊", label: "Records"   },
  { href: "/shop",             icon: "🛒", label: "Shop"      },
  { href: "/achievements",     icon: "🏆", label: "Achieve"   },
  { href: "/progress",         icon: "📈", label: "Progress"  },
  { href: "/journeys",         icon: "🗺️",  label: "Journeys"  },
  { href: "/mastery",          icon: "⚡", label: "Mastery"   },
  { href: "/standards",        icon: "🏅", label: "Standards" },
  { href: "/library",          icon: "📚", label: "Library"   },
  { href: "/legendary-skills", icon: "👑", label: "Legendary" },
  { href: "/titles",           icon: "🎖️",  label: "Titles"    },
  { href: "/streaks",          icon: "🔥", label: "Streaks"   },
  { href: "/skills",           icon: "🎯", label: "Skills"    },
  { href: "/workouts",         icon: "💪", label: "Workouts"  },
];

// 5-item primary dock
const PRIMARY_NAV = [
  { href: "/",         icon: "⚡", label: "Hub"     },
  { href: "/quests",   icon: "⚔️",  label: "Quests"  },
  { href: "/workouts", icon: "💪", label: "Train"   },
  { href: "/tree",     icon: "🌳", label: "Tree"    },
  { href: "/profile",  icon: "👤", label: "Profile" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-white/[0.07] pb-safe">

      {/* Secondary scroll strip — icon + tiny label */}
      <div className="flex gap-0.5 px-2 pt-1.5 pb-1 overflow-x-auto scrollbar-hide border-b border-white/[0.04]">
        {ALL_ROUTES.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center min-w-[46px] px-1 py-1 rounded-lg transition-all duration-150
                ${isActive
                  ? "bg-white/[0.07] text-white/80"
                  : "text-white/25 active:text-white/60 active:bg-white/[0.05]"
                }
              `}
            >
              <span className="text-[13px] leading-none">{item.icon}</span>
              <span className={`text-[8.5px] mt-0.5 leading-none tracking-wide font-medium ${isActive ? "text-white/60" : "text-white/20"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Primary dock */}
      <div className="flex items-stretch h-12">
        {PRIMARY_NAV.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-0.5
                transition-all duration-150 relative
                ${isActive ? "text-green-400" : "text-white/30 active:text-white/60"}
              `}
            >
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-px bg-green-400/60 rounded-full" />
              )}
              <span className={`text-[17px] leading-none transition-all ${isActive ? "drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]" : ""}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-mono font-medium tracking-wide ${isActive ? "text-green-400/80" : "text-white/20"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
