interface SectionHeaderProps {
  title:      string;
  subtitle?:  string;
  icon?:      string;
  action?:    React.ReactNode;
  className?: string;
}

export default function SectionHeader({ title, subtitle, icon, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <div className="flex items-start gap-2 border-l-2 border-green-500/40 pl-3">
        {icon && <span className="text-base leading-none mt-0.5">{icon}</span>}
        <div>
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/40 leading-none mb-0.5">
            {subtitle}
          </p>
          <p className="font-display text-base tracking-widest text-white leading-tight">{title}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
