import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import PaperTimelineItem from "@/components/only-page/paper-list/paper-timeline-item";
import { getCardNewsDetail } from "@/api/firestore";
import type { UnifiedPaper } from "@/types/paper";

import s from "./styles/paperList.module.scss";

export default function PaperList() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [papers, setPapers] = useState<UnifiedPaper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getCardNewsDetail(id).then((data) => {
      if (!data) return;
      setTitle(data.title);
      setPapers(
        data.papers
          .map((p) => ({
            id: p.order,
            order: p.order,
            type: p.type as UnifiedPaper["type"],
            difficulty: (p as { difficulty?: UnifiedPaper["difficulty"] }).difficulty,
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
  if (!title) return <MainLayout><p>카드뉴스를 찾을 수 없습니다.</p></MainLayout>;

  return (
    <MainLayout gap={40}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <h1 className={s.pageTitle}>{title}</h1>
        <p className={s.subtitle}>관련 논문 읽기 순서 가이드</p>
      </div>
      <ul className={s.timeline}>
        {papers.map((paper) => (
          <PaperTimelineItem key={paper.id} paper={paper} cardNewsId={id!} />
        ))}
      </ul>
    </MainLayout>
  );
}
