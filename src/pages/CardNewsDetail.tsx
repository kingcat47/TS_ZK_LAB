import { useParams } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import CardNewsViewer from "@/components/only-page/card-news-detail/card-news-viewer";
import TermSection from "@/components/only-page/card-news-detail/term-section";
import ExplainSection from "@/components/only-page/card-news-detail/explain-section";
import ReferenceSection from "@/components/only-page/card-news-detail/reference-section";
import { MOCK_CARD_NEWS_DETAIL } from "@/mocks/cardNewsDetail";

import s from "./styles/cardNewsDetail.module.scss";

export default function CardNewsDetail() {
  const { id } = useParams();
  const data = MOCK_CARD_NEWS_DETAIL.find((item) => item.id === Number(id));

  if (!data) return <MainLayout><p>카드뉴스를 찾을 수 없습니다.</p></MainLayout>;

  return (
    <MainLayout gap={48}>
      <h1 className={s.pageTitle}>{data.title}</h1>
      <CardNewsViewer slides={data.slides} title={data.title} />
      <TermSection terms={data.terms} />
      <ExplainSection paragraphs={data.paragraphs} />
      <ReferenceSection references={data.references} />
    </MainLayout>
  );
}
