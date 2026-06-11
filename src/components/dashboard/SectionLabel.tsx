interface SectionLabelProps {
  children: React.ReactNode;
  description?: string;
  action?: React.ReactNode;
}

export function SectionLabel({ children, description, action }: SectionLabelProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.04]" />
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-white/20">
          {children}
        </span>
        <div className="h-px flex-1 bg-white/[0.04]" />
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {description && (
        <p className="font-mono text-[9px] text-white/20 text-center mt-0.5 tracking-wide">
          {description}
        </p>
      )}
    </div>
  );
}
