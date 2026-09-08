/**
 * Маскот курса: мягкая капля акцентного цвета с окошком терминала вместо лица.
 * Глаза — два блока на «экране», под ними мигает курсор.
 * Собственный персонаж, не фирменный маскот Anthropic.
 */
interface MascotProps {
  className?: string;
}

export default function Mascot({ className }: MascotProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      {/* тело — капля */}
      <path
        d="M16.5 2.5c7.6 0 12.8 4.9 13 12.2.2 7.4-4.4 14.8-13.2 14.8C8.1 29.5 2.5 24.3 2.5 16.4 2.5 8.6 8.6 2.5 16.5 2.5z"
        fill="var(--accent)"
      />
      {/* экран терминала */}
      <rect x="8" y="10" width="16" height="12" rx="2.5" fill="var(--code-bg)" />
      {/* глаза */}
      <rect x="11" y="13" width="3" height="4" rx="0.8" fill="var(--code-fg)" />
      <rect x="18" y="13" width="3" height="4" rx="0.8" fill="var(--code-fg)" />
      {/* курсор — мигает */}
      <rect x="11" y="18.5" width="5" height="1.6" rx="0.6" fill="var(--code-fg)" className="mascot-cursor" />
    </svg>
  );
}
