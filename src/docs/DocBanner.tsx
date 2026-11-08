/* Page header for the MDX docs pages: the page title set over decorative art. Not part of the public API. */

interface DocBannerProps {
  /** The page title. Rendered as the page's only `<h1>`, so don't add a Markdown `#` heading too. */
  title: string;
  /** The section the page belongs to, shown above the title. */
  eyebrow?: string;
  /** Decorative art; its left side should be dark and empty, since the title sits there. */
  src: string;
}

export function DocBanner({ title, eyebrow, src }: DocBannerProps) {
  return (
    <header
      className="sb-unstyled"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'clamp(140px, 18vw, 200px)',
        padding: 'var(--ds-space-6) var(--ds-space-8)',
        marginBlockEnd: 'var(--ds-space-8)',
        borderRadius: 'var(--ds-radius-lg)',
        overflow: 'hidden',
        background: '#0b0d14',
        color: '#f7f7f8',
        fontFamily: 'var(--ds-font-sans)',
      }}
    >
      <img
        src={src}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% 50%' }}
      />
      {/* Keeps the title readable wherever the art gets bright. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgb(11 13 20 / 0.92) 0%, rgb(11 13 20 / 0.6) 40%, rgb(11 13 20 / 0) 70%)',
        }}
      />
      <div style={{ position: 'relative' }}>
        {eyebrow && (
          <p
            style={{
              margin: 0,
              marginBlockEnd: 'var(--ds-space-2)',
              fontSize: 'var(--ds-font-size-xs)',
              fontWeight: 'var(--ds-font-weight-semibold)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#fdba74',
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            margin: 0,
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 'var(--ds-font-weight-bold)',
            lineHeight: 'var(--ds-line-height-tight)',
            letterSpacing: '-0.02em',
            color: 'inherit',
          }}
        >
          {title}
        </h1>
      </div>
    </header>
  );
}
