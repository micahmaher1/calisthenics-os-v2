import Link from "next/link";

interface EmptyStateProps {
  icon:        string;
  title:       string;
  description: string;
  action?:     { label: string; href: string };
  className?:  string;
}

export default function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-2xl p-8 ${className}`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-display text-lg tracking-widest text-white mb-2">{title}</h3>
      <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest max-w-xs">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 px-4 py-2 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 font-mono text-[10px] uppercase tracking-widest hover:bg-green-500/20 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
