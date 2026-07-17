import { t } from "@/lib/i18n";

interface ProgressBarProps {
  /** Выполнено. */
  value: number;
  /** Всего. */
  max: number;
}

/** Горизонтальный индикатор прогресса. */
export default function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div
      role="progressbar"
      aria-label={t.progress.barLabel}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
    >
      <div
        className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
