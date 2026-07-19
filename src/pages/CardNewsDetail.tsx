import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import CardNewsViewer from "@/components/only-page/card-news-detail/card-news-viewer";
import TermSection from "@/components/only-page/card-news-detail/term-section";
import ExplainSection from "@/components/only-page/card-news-detail/explain-section";
import TiptapViewer from "@/components/only-page/card-news-detail/tiptap-viewer";
import ReferenceSection from "@/components/only-page/card-news-detail/reference-section";
import { MOCK_CARD_NEWS_DETAIL } from "@/mocks/cardNewsDetail";
import { getCardNewsDetail } from "@/api/firestore";
import type { CardNewsDetail as FirestoreDetail } from "@/api/firestore";
import type { Reference } from "@/components/only-page/card-news-detail/reference-section";

import s from "./styles/cardNewsDetail.module.scss";

export default function CardNewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [firestoreData, setFirestoreData] = useState<FirestoreDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const mockData = MOCK_CARD_NEWS_DETAIL.find((item) => item.id === Number(id));

  useEffect(() => {
    if (mockData) return;
    if (!id) return;
    setLoading(true);
    getCardNewsDetail(id)
      .then(setFirestoreData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><p>불러오는 중...</p></MainLayout>;

  // 목데이터 기반 렌더링
  if (mockData) {
    return (
      <MainLayout gap={48}>
        <h1 className={s.pageTitle}>{mockData.title}</h1>
        <CardNewsViewer slides={mockData.slides} title={mockData.title} />
        <TermSection terms={mockData.terms} />
        <ExplainSection paragraphs={mockData.paragraphs} />
        <ReferenceSection cardNewsId={String(id)} references={mockData.references} />
      </MainLayout>
    );
  }

  // Firestore 기반 렌더링
  if (firestoreData) {
    const references: Reference[] = firestoreData.papers.map((p, i) => ({
      paperId: i + 1,
      title: p.title,
      authors: p.authors,
      source: p.journal,
      year: p.year,
    }));

    return (
      <MainLayout gap={48}>
        <h1 className={s.pageTitle}>{firestoreData.title}</h1>
        <CardNewsViewer slides={firestoreData.slides} title={firestoreData.title} />
        {firestoreData.terms.length > 0 && <TermSection terms={firestoreData.terms} />}
        <TiptapViewer content={firestoreData.content} />
        {references.length > 0 && (
          <ReferenceSection cardNewsId={String(id)} references={references} />
        )}
      </MainLayout>
    );
  }

  return <MainLayout><p>카드뉴스를 찾을 수 없습니다.</p></MainLayout>;
}
