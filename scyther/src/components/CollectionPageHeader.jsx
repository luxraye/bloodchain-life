/**
 * Shared page header — matches Transfuse / Chronicle eyebrow + title pattern.
 */
export default function CollectionPageHeader({ eyebrow, title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6 animate-fade-in">
      {eyebrow && (
        <p
          className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
          style={{ color: 'var(--bc-burg-500)' }}
        >
          {eyebrow}
        </p>
      )}
      <h1 className="bc-page-title">
        {Icon && <Icon className="w-6 h-6 shrink-0" style={{ color: 'var(--bc-burg-300)' }} />}
        {title}
      </h1>
      {subtitle && <p className="bc-page-sub">{subtitle}</p>}
    </div>
  )
}
