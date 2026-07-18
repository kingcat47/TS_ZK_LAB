import { Tooltip } from "@/components/ui";

import s from "./styles.module.scss";

type TextSegment = { type: "text"; content: string };
type TermSegment = { type: "term"; word: string; description: string };
export type Segment = TextSegment | TermSegment;

interface ExplainSectionProps {
  paragraphs: Segment[][];
}

export default function ExplainSection({ paragraphs }: ExplainSectionProps) {
  return (
    <section className={s.section}>
      <h2 className={s.title}>내용 설명</h2>
      <div className={s.body}>
        {paragraphs.map((segments, i) => (
          <p key={i} className={s.paragraph}>
            {segments.map((seg, j) =>
              seg.type === "term" ? (
                <Tooltip key={j} content={seg.description}>
                  <mark className={s.highlight}>{seg.word}</mark>
                </Tooltip>
              ) : (
                <span key={j}>{seg.content}</span>
              )
            )}
          </p>
        ))}
      </div>
    </section>
  );
}
