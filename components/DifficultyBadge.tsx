import type { Difficulty } from "@/lib/content";
import { t } from "@/lib/i18n";

const STYLES: Record<Difficulty, string> = {
  easy: "text-muted",
  medium: "text-amber-700",
  hard: "text-rose-700",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/** Метка сложности: моноширинная капитель, цвет по уровню. */
export default function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`font-mono text-xs uppercase tracking-wider ${STYLES[difficulty]}`}>
      {t.difficulty[difficulty]}
    </span>
  );
}
