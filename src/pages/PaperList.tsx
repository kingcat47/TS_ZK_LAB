import { useParams, useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import PaperTimelineItem from "@/components/only-page/paper-list/paper-timeline-item";
import { MOCK_PAPERS } from "@/mocks/papers";
import { MOCK_CARD_NEWS_DETAIL } from "@/mocks/cardNewsDetail";

import s from "./styles/paperList.module.scss";

export default function PaperList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cardNewsId = Number(id);

  const cardNews = MOCK_CARD_NEWS_DETAIL.find((item) => item.id === cardNewsId);
  const papers = MOCK_PAPERS.filter((p) => p.cardNewsId === cardNewsId).sort((a, b) => a.order - b.order);

  if (!cardNews) return <MainLayout><p>카드뉴스를 찾을 수 없습니다.</p></MainLayout>;

  return (
    <MainLayout gap={40}>
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <h1 className={s.pageTitle}>{cardNews.title}</h1>
        <p className={s.subtitle}>관련 논문 읽기 순서 가이드</p>
      </div>
      <ul className={s.timeline}>
        {papers.map((paper) => (
          <PaperTimelineItem key={paper.id} paper={paper} cardNewsId={cardNewsId} />
        ))}
      </ul>
    </MainLayout>
  );
}
