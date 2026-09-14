import { t } from "@/lib/i18n";

interface ProgressBarProps {
  /** Выполнено. */
  value: number;
  /** Всего. */
  max: number;
  /** Цвет дорожки: на листе — светло-серый, на акцентной подложке — цвет листа. */
  track?: "faint" | "paper";
}

/** Тонкая линейка прогресса в стиле «Журнал». */
export default function ProgressBar({ value, max, track = "faint" }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={t.progress.barLabel}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`h-1 w-full ${track === "paper" ? "bg-paper" : "bg-faint"}`}
    >
      <div className="h-full bg-accent transition-[width] duration-700 ease-out" style={{ width: `${percent}%` }} />
    </div>
  );
}
