export interface NavItem {
  href:        string;
  label:       string;
  icon:        string;
  color:       string;
  section:     "main" | "progression" | "social" | "system";
  shortLabel?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/",             label: "Training Hub", icon: "⚡", color: "green",  section: "main",        shortLabel: "Home"    },
  { href: "/workouts",     label: "Workouts",     icon: "🏋️", color: "green",  section: "main",        shortLabel: "Train"   },
  { href: "/journeys",     label: "Journeys",     icon: "🗺️", color: "cyan",   section: "progression", shortLabel: "Journey" },
  { href: "/tree",         label: "Skill Tree",   icon: "🌳", color: "purple", section: "progression", shortLabel: "Skills"  },
  { href: "/skills",       label: "Skills",       icon: "🎯", color: "teal",   section: "progression", shortLabel: "Skills"  },
  { href: "/mastery",      label: "Mastery",      icon: "⭐", color: "indigo", section: "progression", shortLabel: "Mastery" },
  { href: "/quests",       label: "Quests",       icon: "⚔️", color: "orange", section: "main",        shortLabel: "Quests"  },
  { href: "/streaks",      label: "Streaks",      icon: "🔥", color: "red",    section: "main",        shortLabel: "Streaks" },
  { href: "/records",      label: "Records",      icon: "🏅", color: "green",  section: "main"         },
  { href: "/achievements", label: "Achievements", icon: "🏆", color: "yellow", section: "progression", shortLabel: "Achieve" },
  { href: "/titles",       label: "Titles",       icon: "🏷️", color: "yellow", section: "progression" },
  { href: "/coach",        label: "Coach",        icon: "🧠", color: "purple", section: "system"       },
  { href: "/shop",         label: "Shop",         icon: "🛒", color: "amber",  section: "system"       },
  { href: "/progress",     label: "Progress",     icon: "📈", color: "sky",    section: "progression"  },
  { href: "/profile",          label: "Profile",          icon: "👤", color: "green",  section: "system"       },
  { href: "/legendary-skills", label: "Legendary Skills", icon: "🌟", color: "yellow", section: "progression", shortLabel: "Legend" },
  { href: "/library",          label: "Library",          icon: "📚", color: "slate",  section: "progression", shortLabel: "Library"    },
  { href: "/standards",        label: "Standards",        icon: "🏅", color: "amber",  section: "main",        shortLabel: "Ranks"      },
];

// Bottom nav items (mobile) — max 5
export const BOTTOM_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter((n) =>
  ["/", "/workouts", "/journeys", "/quests", "/profile"].includes(n.href)
);
