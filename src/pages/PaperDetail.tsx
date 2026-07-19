import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import PaperSummary from "@/components/only-page/paper-detail/paper-summary";
import { MOCK_PAPERS } from "@/mocks/papers";
import { getCardNewsDetail } from "@/api/firestore";
import type { UnifiedPaper } from "@/types/paper";

import s from "./styles/paperDetail.module.scss";

const TYPE_CLASS: Record<UnifiedPaper["type"], string> = {
  근본: s.typeRoot,
  발전: s.typeAdvanced,
  트렌드: s.typeTrend,
  한계: s.typeLimit,
};

export default function PaperDetail() {
  const { id, paperId } = useParams<{ id: string; paperId: string }>();
  const navigate = useNavigate();

  const isMock = MOCK_PAPERS.some((p) => p.cardNewsId === Number(id));

  const [papers, setPapers] = useState<UnifiedPaper[]>(() =>
    isMock
      ? MOCK_PAPERS.filter((p) => p.cardNewsId === Number(id)).sort((a, b) => a.order - b.order)
      : []
  );
  const [loading, setLoading] = useState(!isMock);

  useEffect(() => {
    if (isMock || !id) return;
    getCardNewsDetail(id).then((data) => {
      if (!data) return;
      setPapers(
        data.papers
          .map((p) => ({
            id: p.order,
            order: p.order,
            type: p.type as UnifiedPaper["type"],
            title: p.title,
            authors: p.authors,
            journal: p.journal,
            year: p.year,
            url: p.url,
            summary: p.summary,
          }))
          .sort((a, b) => a.order - b.order)
      );
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><p>불러오는 중...</p></MainLayout>;

  const currentIndex = papers.findIndex((p) => String(p.id) === paperId || p.order === Number(paperId));
  const paper = papers[currentIndex];
  const prevPaper = papers[currentIndex - 1] ?? null;
  const nextPaper = papers[currentIndex + 1] ?? null;

  if (!paper) return <MainLayout><p>논문을 찾을 수 없습니다.</p></MainLayout>;

  return (
    <MainLayout gap={40}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>
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
          <button className={s.navBtn} onClick={() => navigate(`/card-news/${id}/papers/${prevPaper.id}`)}>
            <span className={s.navLabel}>이전</span>
            <span className={s.navTitle}>← {prevPaper.title}</span>
          </button>
        ) : <div />}
        {nextPaper ? (
          <button className={s.navBtn} onClick={() => navigate(`/card-news/${id}/papers/${nextPaper.id}`)}>
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
        {paper.url && (
          <a href={paper.url} target="_blank" rel="noopener noreferrer" className={s.sourceLink}>
            원문 보기 →
          </a>
        )}
      </div>
    </MainLayout>
  );
}
