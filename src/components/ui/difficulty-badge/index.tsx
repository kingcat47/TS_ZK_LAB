import React from "react";

import Tooltip from "@/components/ui/tooltip";

export type DifficultyLevel = "초급" | "중급" | "고급";

const STYLE: Record<DifficultyLevel, React.CSSProperties> = {
  초급: { backgroundColor: "#F0FDF4", color: "#15803D" },
  중급: { backgroundColor: "#FFFBEB", color: "#B45309" },
  고급: { backgroundColor: "#F5F3FF", color: "#6D28D9" },
};

const TOOLTIP: Record<DifficultyLevel, string> = {
  초급: "누구나",
  중급: "배경개념을 좀 아는 사람",
  고급: "해당 분야 배경지식이 필요해요",
};

interface DifficultyBadgeProps {
  level: DifficultyLevel;
  className?: string;
}

export default function DifficultyBadge({ level, className }: DifficultyBadgeProps) {
  return (
    <Tooltip content={TOOLTIP[level]}>
      <span
        style={{
          ...STYLE[level],
          fontSize: "12px",
          fontWeight: 600,
          borderRadius: "9999px",
          padding: "2px 10px",
          width: "fit-content",
          letterSpacing: "0.02em",
          display: "inline-flex",
          alignItems: "center",
        }}
        className={className}
      >
        {level}
      </span>
    </Tooltip>
  );
}
