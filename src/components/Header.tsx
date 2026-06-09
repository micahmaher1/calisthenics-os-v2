"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadAvatar } from "@/lib/profile-storage";
import { loadProfile } from "@/lib/profile-storage";
import { getInitials } from "@/lib/profile-utils";

interface HeaderProps {
  rank:  string;
  level: number;
}

export default function Header({ rank, level }: HeaderProps) {
  const [avatarUrl,  setAvatarUrl]  = useState<string | null>(null);
  const [initials,   setInitials]   = useState("?");

  useEffect(() => {
    setAvatarUrl(loadAvatar());
    const p = loadProfile();
    setInitials(getInitials(p.name, p.displayName));
  }, []);

  return (
    <header className="flex items-center justify-between py-5 border-b border-white/5">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg glow-green">
          ⚡
        </div>
        <div>
          <div className="font-display text-xl tracking-widest text-white leading-none">
            CALISTHENICS OS
          </div>
          <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mt-0.5">
            v1.0 · Personal Training System
          </div>
        </div>
      </Link>

      {/* Nav */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
        <NavLink href="/quests"       color="orange" icon="⚔️"  label="Quests"       />
        <NavLink href="/records"      color="green"  icon="🏅"  label="Records"      />
        <NavLink href="/shop"         color="amber"  icon="🛒"  label="Shop"         />
        <NavLink href="/achievements" color="yellow" icon="🏆"  label="Achievements" />
        <NavLink href="/progress"     color="sky"    icon="📈"  label="Progress"     />
        <NavLink href="/tree"         color="purple" icon="🌳"  label="Skill Tree"   />

        {/* Profile avatar link */}
        <Link
          href="/profile"
          className="flex items-center gap-2 pl-2 ml-1 border-l border-white/8 hover:opacity-80 transition-opacity flex-shrink-0"
        >
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
              {rank}
            </span>
            <span className="font-mono text-[9px] text-white/20">Lv. {level}</span>
          </div>
          <div className="w-9 h-9 rounded-full ring-2 ring-green-500/30 overflow-hidden bg-surface-700 border border-white/10 flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-sm text-white/60">{initials}</span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}

function NavLink({ href, color, icon, label }: {
  href: string; color: string; icon: string; label: string;
}) {
  const colorMap: Record<string, string> = {
    orange: "text-orange-400 border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/20",
    yellow: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10 hover:bg-yellow-500/20",
    amber:  "text-amber-400  border-amber-500/20  bg-amber-500/10  hover:bg-amber-500/20",
    sky:    "text-sky-400    border-sky-500/20    bg-sky-500/10    hover:bg-sky-500/20",
    purple: "text-purple-400 border-purple-500/20 bg-purple-500/10 hover:bg-purple-500/20",
    green:  "text-green-400  border-green-500/20  bg-green-500/10  hover:bg-green-500/20",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-xl font-mono text-[9px] uppercase tracking-widest transition-all ${colorMap[color] ?? colorMap.green}`}
    >
      <span>{icon}</span>
      <span className="hidden lg:inline">{label}</span>
    </Link>
  );
}
