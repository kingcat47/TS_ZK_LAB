import { useNavigate } from "react-router-dom";

import type { UnifiedPaper } from "@/types/paper";

import s from "./styles.module.scss";

const TYPE_CLASS: Record<UnifiedPaper["type"], string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

interface PaperTimelineItemProps {
  paper: UnifiedPaper;
  cardNewsId: string | number;
}

export default function PaperTimelineItem({ paper, cardNewsId }: PaperTimelineItemProps) {
  const navigate = useNavigate();

  return (
    <li className={s.item}>
      <div className={s.orderCol}>
        <span className={s.orderCircle}>{paper.order}</span>
        <div className={s.line} />
      </div>
      <div className={s.content}>
        <span className={[s.badge, TYPE_CLASS[paper.type]].join(" ")}>{paper.type} 논문</span>
        <h3 className={s.title}>{paper.title}</h3>
        <p className={s.meta}>{paper.authors} · {paper.journal} · {paper.year}</p>
        <button className={s.readBtn} onClick={() => navigate(`/card-news/${cardNewsId}/papers/${paper.id}`)}>
          읽기 →
        </button>
      </div>
    </li>
  );
}
