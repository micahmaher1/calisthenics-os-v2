"use client";
import Link from "next/link";

interface PageHeaderProps {
  icon:        string;
  title:       string;
  subtitle?:   string;
  breadcrumb?: Array<{ label: string; href?: string }>;
  actions?:    React.ReactNode;
  backHref?:   string;
  backLabel?:  string;
}

export default function PageHeader({
  icon,
  title,
  subtitle,
  breadcrumb,
  actions,
  backHref = "/",
  backLabel = "Dashboard",
}: PageHeaderProps) {
  return (
    <div className="mt-6 mb-6">
      {/* Back button + breadcrumb row */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Link
          href={backHref}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors font-mono text-[10px] uppercase tracking-widest"
        >
          <span>←</span>
          <span>{backLabel}</span>
        </Link>
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest">
            <span className="text-white/20">/</span>
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {crumb.href ? (
                  <Link href={crumb.href} className="text-white/40 hover:text-white/70 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-white/20">/</span>}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Title row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl flex-shrink-0">{icon}</div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl tracking-widest uppercase text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>
        )}
      </div>

      {/* Separator */}
      <div className="mt-4 border-b border-white/5" />
    </div>
  );
}
