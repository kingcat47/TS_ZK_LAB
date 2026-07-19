import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";

import type { CardNewsProps } from "@/components/ui/card-news";
import { useBookmarks } from "@/contexts/BookmarksContext";

import s from "./styles.module.scss";

const TYPE_CLASS: Record<string, string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

interface PaperCollectionCardProps {
  cardNews: CardNewsProps;
  papers: { id?: string | number; type: string }[];
}

export default function PaperCollectionCard({ cardNews, papers }: PaperCollectionCardProps) {
  const navigate = useNavigate();
  const { isPaperBookmarked, togglePaper } = useBookmarks();
  const bookmarked = isPaperBookmarked(Number(cardNews.id));

  return (
    <article className={s.card} onClick={() => navigate(`/card-news/${cardNews.id}/papers`)}>
      <div className={s.thumbnail}>
        <img src={cardNews.thumbnail} alt={cardNews.title} />
        <button
          className={[s.bookmarkBtn, bookmarked ? s.bookmarked : ""].join(" ")}
          onClick={(e) => { e.stopPropagation(); togglePaper(Number(cardNews.id)); }}
          title={bookmarked ? "찜 해제" : "찜하기"}
        >
          <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className={s.content}>
        <div className={s.typeBadges}>
          {papers.map((paper, i) => (
            <span key={paper.id ?? i} className={[s.badge, TYPE_CLASS[paper.type] ?? ""].join(" ")}>
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
