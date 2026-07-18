import { CardNews } from "@/components/ui";
import { MainLayout } from "@/components/layout";
import { MOCK_CARD_NEWS } from "@/mocks/cardNews";

import s from "./styles/home.module.scss";

export default function Home() {
  return (
    <MainLayout>
      <section className={s.section}>
        <h2 className={s.sectionTitle}>최신 카드뉴스</h2>
        <div className={s.grid}>
          {MOCK_CARD_NEWS.map((item) => (
            <CardNews key={item.id} {...item} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
