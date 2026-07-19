import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import { MOCK_CARD_NEWS } from "@/mocks/cardNews";
import { MOCK_PAPERS } from "@/mocks/papers";
import { getPublishedCardNews, getPublishedPapersForSearch } from "@/api/firestore";
import type { CardNewsProps } from "@/components/ui/card-news";
import type { Paper } from "@/mocks/papers";
import type { PaperSearchItem } from "@/api/firestore";

import s from "./styles.module.scss";

const TYPE_CLASS: Record<Paper["type"], string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [firestoreCardNews, setFirestoreCardNews] = useState<CardNewsProps[]>([]);
  const [firestorePapers, setFirestorePapers] = useState<PaperSearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    getPublishedPapersForSearch().then(setFirestorePapers);
    getPublishedCardNews().then((items) =>
      setFirestoreCardNews(
        items.map((r) => ({
          id: r.id,
          thumbnail: r.thumbnail,
          title: r.title,
          category: r.category,
        }))
      )
    );
  }, []);

  const allCardNews = [...firestoreCardNews, ...MOCK_CARD_NEWS];
  const q = query.trim().toLowerCase();

  const cardNewsResults = q
    ? allCardNews.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q)
      )
    : [];

  const allPapers: (Paper | PaperSearchItem)[] = [...firestorePapers, ...MOCK_PAPERS];

  const paperResults = q
    ? allPapers.filter(
        (paper) =>
          paper.title.toLowerCase().includes(q) ||
          paper.authors.toLowerCase().includes(q) ||
          paper.journal.toLowerCase().includes(q)
      )
    : [];

  const hasResults = cardNewsResults.length > 0 || paperResults.length > 0;

  function goTo(path: string) {
    navigate(path);
    onClose();
  }

  function getPaperPath(paper: Paper | PaperSearchItem) {
    if (typeof paper.cardNewsId === "string") {
      return `/card-news/${paper.cardNewsId}/papers/${(paper as PaperSearchItem).order}`;
    }
    return `/card-news/${paper.cardNewsId}/papers/${paper.id}`;
  }

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={(e) => e.stopPropagation()}>
        <div className={s.inputRow}>
          <Search size={18} className={s.searchIcon} />
          <input
            ref={inputRef}
            className={s.input}
            placeholder="검색어를 입력하세요..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={s.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {q && (
          <div className={s.results}>
            {!hasResults && (
              <p className={s.empty}>'{query}'에 대한 검색 결과가 없습니다.</p>
            )}

            {cardNewsResults.length > 0 && (
              <div className={s.section}>
                <p className={s.sectionLabel}>카드뉴스</p>
                {cardNewsResults.map((item) => (
                  <button
                    key={item.id}
                    className={s.resultItem}
                    onClick={() => goTo(`/card-news/${item.id}`)}
                  >
                    <img src={item.thumbnail} alt={item.title} className={s.resultThumb} />
                    <div className={s.resultInfo}>
                      <span className={s.resultTitle}>{item.title}</span>
                      <span className={s.resultSub}>{item.category}{item.date ? ` · ${item.date}` : ""}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {paperResults.length > 0 && (
              <div className={s.section}>
                <p className={s.sectionLabel}>논문</p>
                {paperResults.map((paper) => (
                  <button
                    key={`${paper.cardNewsId}-${paper.id}`}
                    className={s.resultItem}
                    onClick={() => goTo(getPaperPath(paper))}
                  >
                    <span className={[s.typeBadge, TYPE_CLASS[paper.type]].join(" ")}>
                      {paper.type}
                    </span>
                    <div className={s.resultInfo}>
                      <span className={s.resultTitle}>{paper.title}</span>
                      <span className={s.resultSub}>{paper.authors} · {paper.journal}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
