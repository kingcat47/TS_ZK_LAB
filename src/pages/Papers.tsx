import { useEffect, useState } from "react";

import { MainLayout } from "@/components/layout";
import PaperCollectionCard from "@/components/only-page/papers/paper-collection-card";
import { MOCK_CARD_NEWS } from "@/mocks/cardNews";
import { MOCK_PAPERS } from "@/mocks/papers";
import { getPublishedCardNewsWithPapers } from "@/api/firestore";
import type { CardNewsProps } from "@/components/ui/card-news";

import s from "./styles/papers.module.scss";

interface Collection {
  cardNews: CardNewsProps;
  papers: { id?: string | number; type: string }[];
}

const MOCK_COLLECTIONS: Collection[] = MOCK_CARD_NEWS.map((cardNews) => ({
  cardNews,
  papers: MOCK_PAPERS.filter((p) => p.cardNewsId === cardNews.id).sort((a, b) => a.order - b.order),
})).filter(({ papers }) => papers.length > 0);

export default function Papers() {
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);

  useEffect(() => {
    getPublishedCardNewsWithPapers().then((real) => {
      const realCollections: Collection[] = real.map((r) => ({
        cardNews: {
          id: r.id,
          thumbnail: r.thumbnail,
          title: r.title,
          category: r.category,
        },
        papers: r.papers,
      }));
      setCollections([...realCollections, ...MOCK_COLLECTIONS]);
    });
  }, []);

  return (
    <MainLayout>
      <section className={s.section}>
        <div className={s.header}>
          <h1 className={s.pageTitle}>논문</h1>
          <p className={s.subtitle}>카드뉴스 주제별 관련 논문을 읽기 순서대로 제공합니다.</p>
        </div>
        <div className={s.grid}>
          {collections.map(({ cardNews, papers }) => (
            <PaperCollectionCard key={cardNews.id} cardNews={cardNews} papers={papers} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
