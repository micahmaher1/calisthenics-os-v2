interface LoadingCardProps {
  rows?:      number;
  className?: string;
}

export default function LoadingCard({ rows = 3, className = "" }: LoadingCardProps) {
  return (
    <div className={`bg-surface-800 border border-white/8 rounded-2xl p-4 animate-pulse ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-white/5" />
        <div className="flex-1">
          <div className="h-3 bg-white/5 rounded w-1/3 mb-1.5" />
          <div className="h-2 bg-white/5 rounded w-1/4" />
        </div>
      </div>
      {/* Body skeleton rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-2.5 bg-white/5 rounded mb-2"
          style={{ width: `${[85, 65, 75, 55, 80][i % 5]}%` }}
        />
      ))}
    </div>
  );
}

export function PageLoadingState({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <span className="text-4xl">{icon}</span>
        <span className="font-display text-xl tracking-widest text-white/40">{label}</span>
      </div>
    </div>
  );
}
