import { useEffect, useState } from "react";

import { CardNews } from "@/components/ui";
import { MainLayout } from "@/components/layout";
import { MOCK_CARD_NEWS } from "@/mocks/cardNews";
import { getPublishedCardNews } from "@/api/firestore";
import type { CardNewsProps } from "@/components/ui/card-news";

import s from "./styles/home.module.scss";

export default function Home() {
  const [items, setItems] = useState<CardNewsProps[]>([...MOCK_CARD_NEWS]);

  useEffect(() => {
    getPublishedCardNews().then((real) => {
      const realItems: CardNewsProps[] = real.map((r) => ({
        id: r.id,
        thumbnail: r.thumbnail,
        title: r.title,
        category: r.category,
        date: new Date(r.createdAt).toLocaleDateString("ko-KR", {
          year: "numeric", month: "2-digit", day: "2-digit",
        }).replace(/\. /g, ".").replace(/\.$/, ""),
      }));
      setItems([...realItems, ...MOCK_CARD_NEWS]);
    });
  }, []);

  return (
    <MainLayout>
      <section className={s.section}>
        <h2 className={s.sectionTitle}>최신 카드뉴스</h2>
        <div className={s.grid}>
          {items.map((item) => (
            <CardNews key={item.id} {...item} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
