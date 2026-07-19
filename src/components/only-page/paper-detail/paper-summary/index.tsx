import type { PaperSummarySection } from "@/types/paper";

import s from "./styles.module.scss";

interface PaperSummaryProps {
  sections: PaperSummarySection[];
}

export default function PaperSummary({ sections }: PaperSummaryProps) {
  return (
    <div className={s.wrapper}>
      {sections.map((section, i) => (
        <div key={i} className={s.section}>
          <h3 className={s.heading}>{section.heading}</h3>
          <p className={s.content}>{section.content}</p>
        </div>
      ))}
    </div>
  );
}
