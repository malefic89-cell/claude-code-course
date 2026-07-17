import type { Difficulty } from "@/lib/content";
import { t } from "@/lib/i18n";

const STYLES: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/** Бейдж сложности задачи. */
export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[difficulty]}`}
    >
      {t.difficulty[difficulty]}
    </span>
  );
}
