"use client";

interface HeaderProps {
  rank: string;
  level: number;
}

export default function Header({ rank, level }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-6 border-b border-white/5 animate-fade-in">
      {/* Logo */}
      <div className="flex items-center gap-3">
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
      </div>

      {/* Rank badge */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
            Current Rank
          </span>
          <span className="font-display text-base tracking-wider text-green-400">
            {rank}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center font-mono text-xs text-green-400 glow-green">
          {level}
        </div>
      </div>
    </header>
  );
}
