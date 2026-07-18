import type { ReactNode } from "react";

import s from "./styles.module.scss";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className={s.wrapper}>
      {children}
      <span className={s.tooltip}>{content}</span>
    </span>
  );
}
