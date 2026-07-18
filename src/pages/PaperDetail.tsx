import { useParams, useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import PaperSummary from "@/components/only-page/paper-detail/paper-summary";
import { MOCK_PAPERS } from "@/mocks/papers";
import type { Paper } from "@/mocks/papers";

import s from "./styles/paperDetail.module.scss";

const TYPE_CLASS: Record<Paper["type"], string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

export default function PaperDetail() {
  const { id, paperId } = useParams();
  const navigate = useNavigate();
  const cardNewsId = Number(id);

  const papers = MOCK_PAPERS.filter((p) => p.cardNewsId === cardNewsId).sort((a, b) => a.order - b.order);
  const currentIndex = papers.findIndex((p) => p.id === Number(paperId));
  const paper = papers[currentIndex];

  const prevPaper = papers[currentIndex - 1] ?? null;
  const nextPaper = papers[currentIndex + 1] ?? null;

  if (!paper) return <MainLayout><p>논문을 찾을 수 없습니다.</p></MainLayout>;

  return (
    <MainLayout gap={40}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(`/card-news/${cardNewsId}/papers`)}>
          ← 목록으로
        </button>
        <span className={[s.badge, TYPE_CLASS[paper.type]].join(" ")}>{paper.type} 논문</span>
        <h1 className={s.title}>{paper.title}</h1>
        <p className={s.meta}>{paper.authors} · {paper.journal} · {paper.year}</p>
      </div>

      <div className={s.divider} />

      <PaperSummary sections={paper.summary} />

      <div className={s.divider} />

      <div className={s.nav}>
        {prevPaper ? (
          <button className={s.navBtn} onClick={() => navigate(`/card-news/${cardNewsId}/papers/${prevPaper.id}`)}>
            <span className={s.navLabel}>이전</span>
            <span className={s.navTitle}>← {prevPaper.title}</span>
          </button>
        ) : <div />}
        {nextPaper ? (
          <button className={s.navBtn} onClick={() => navigate(`/card-news/${cardNewsId}/papers/${nextPaper.id}`)}>
            <span className={s.navLabel}>다음</span>
            <span className={s.navTitle}>{nextPaper.title} →</span>
          </button>
        ) : <div />}
      </div>

      <div className={s.divider} />

      <div className={s.source}>
        <h2 className={s.sourceTitle}>원문 출처</h2>
        <p className={s.sourceJournal}>{paper.journal} · {paper.year}</p>
        <p className={s.sourceAuthors}>{paper.authors}</p>
        <a href={paper.url} target="_blank" rel="noopener noreferrer" className={s.sourceLink}>
          원문 보기 →
        </a>
      </div>
    </MainLayout>
  );
}
