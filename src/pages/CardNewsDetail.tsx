import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import CardNewsViewer from "@/components/only-page/card-news-detail/card-news-viewer";
import TermSection from "@/components/only-page/card-news-detail/term-section";
import TiptapViewer from "@/components/only-page/card-news-detail/tiptap-viewer";
import ReferenceSection from "@/components/only-page/card-news-detail/reference-section";
import { getCardNewsDetail } from "@/api/firestore";
import type { CardNewsDetail as FirestoreDetail } from "@/api/firestore";
import type { Reference } from "@/components/only-page/card-news-detail/reference-section";

import s from "./styles/cardNewsDetail.module.scss";

export default function CardNewsDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<FirestoreDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getCardNewsDetail(id)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><p>불러오는 중...</p></MainLayout>;

  if (data) {
    const references: Reference[] = data.papers.map((p, i) => ({
      paperId: i + 1,
      title: p.title,
      authors: p.authors,
      source: p.journal,
      year: p.year,
    }));

    return (
      <MainLayout gap={48}>
        <h1 className={s.pageTitle}>{data.title}</h1>
        <CardNewsViewer slides={data.slides} title={data.title} />
        {data.terms.length > 0 && <TermSection terms={data.terms} />}
        <TiptapViewer content={data.content} />
        {references.length > 0 && (
          <ReferenceSection cardNewsId={String(id)} references={references} />
        )}
      </MainLayout>
    );
  }

  return <MainLayout><p>카드뉴스를 찾을 수 없습니다.</p></MainLayout>;
}
