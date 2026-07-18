import { useNavigate } from "react-router-dom";

import type { CardNewsProps } from "@/components/ui/card-news";
import type { Paper } from "@/mocks/papers";

import s from "./styles.module.scss";

const TYPE_CLASS: Record<Paper["type"], string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

interface PaperCollectionCardProps {
  cardNews: CardNewsProps;
  papers: Paper[];
}

export default function PaperCollectionCard({ cardNews, papers }: PaperCollectionCardProps) {
  const navigate = useNavigate();

  return (
    <article className={s.card} onClick={() => navigate(`/card-news/${cardNews.id}/papers`)}>
      <div className={s.thumbnail}>
        <img src={cardNews.thumbnail} alt={cardNews.title} />
      </div>
      <div className={s.content}>
        <div className={s.typeBadges}>
          {papers.map((paper) => (
            <span key={paper.id} className={[s.badge, TYPE_CLASS[paper.type]].join(" ")}>
              {paper.type}
            </span>
          ))}
        </div>
        {cardNews.category && <span className={s.category}>{cardNews.category}</span>}
        <h3 className={s.title}>{cardNews.title}</h3>
        <p className={s.count}>논문 {papers.length}편</p>
      </div>
    </article>
  );
}
