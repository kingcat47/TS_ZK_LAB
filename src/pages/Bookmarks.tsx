import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { CardNews, Button } from "@/components/ui";
import PaperCollectionCard from "@/components/only-page/papers/paper-collection-card";
import { useAuth } from "@/contexts/AuthContext";
import { useBookmarks } from "@/contexts/BookmarksContext";
import { MOCK_CARD_NEWS } from "@/mocks/cardNews";
import { MOCK_PAPERS } from "@/mocks/papers";
import { getPublishedCardNews, getPublishedCardNewsWithPapers } from "@/api/firestore";
import type { CardNewsProps } from "@/components/ui/card-news";
import type { CardNewsWithPapers } from "@/api/firestore";

import s from "./styles/bookmarks.module.scss";

type FilterType = "전체" | "카드뉴스" | "논문";
const FILTERS: FilterType[] = ["전체", "카드뉴스", "논문"];

export default function Bookmarks() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookmarks } = useBookmarks();
  const [filter, setFilter] = useState<FilterType>("전체");
  const [firestoreCardNews, setFirestoreCardNews] = useState<CardNewsProps[]>([]);
  const [firestorePaperCards, setFirestorePaperCards] = useState<CardNewsWithPapers[]>([]);

  useEffect(() => {
    if (!user) return;
    getPublishedCardNews().then((items) =>
      setFirestoreCardNews(
        items.map((r) => ({
          id: r.id,
          thumbnail: r.thumbnail,
          title: r.title,
          category: r.category,
        }))
      )
    );
    getPublishedCardNewsWithPapers().then(setFirestorePaperCards);
  }, [user]);

  if (!user) {
    return (
      <MainLayout>
        <div className={s.emptyState}>
          <p className={s.emptyTitle}>로그인이 필요한 서비스입니다.</p>
          <p className={s.emptyDesc}>로그인하고 관심있는 카드뉴스와 논문을 저장해보세요.</p>
          <Button onClick={() => navigate("/auth/login")}>로그인하기</Button>
        </div>
      </MainLayout>
    );
  }

  const allCardNews: CardNewsProps[] = [...firestoreCardNews, ...MOCK_CARD_NEWS];

  const bookmarkedCardNews = allCardNews.filter((item) =>
    bookmarks.cardNews.includes(String(item.id))
  );

  const firestoreBookmarkedPapers = firestorePaperCards
    .filter((item) => bookmarks.papers.includes(item.id))
    .map((item) => ({
      cardNews: { id: item.id, thumbnail: item.thumbnail, title: item.title, category: item.category },
      papers: item.papers,
    }));

  const mockBookmarkedPapers = MOCK_CARD_NEWS.filter((item) =>
    bookmarks.papers.includes(String(item.id))
  ).map((cardNews) => ({
    cardNews,
    papers: MOCK_PAPERS.filter((p) => p.cardNewsId === Number(cardNews.id)).sort((a, b) => a.order - b.order),
  })).filter(({ papers }) => papers.length > 0);

  const bookmarkedPapers = [...firestoreBookmarkedPapers, ...mockBookmarkedPapers];

  const showCardNews = filter === "전체" || filter === "카드뉴스";
  const showPapers = filter === "전체" || filter === "논문";
  const isEmpty = bookmarkedCardNews.length === 0 && bookmarkedPapers.length === 0;

  return (
    <MainLayout gap={40}>
      <div className={s.header}>
        <h1 className={s.pageTitle}>찜한 목록</h1>
        <div className={s.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={[s.filterBtn, filter === f ? s.active : ""].join(" ")}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className={s.emptyState}>
          <p className={s.emptyTitle}>아직 찜한 항목이 없습니다.</p>
          <p className={s.emptyDesc}>카드뉴스나 논문의 북마크 버튼을 눌러 저장해보세요.</p>
        </div>
      ) : (
        <>
          {showCardNews && bookmarkedCardNews.length > 0 && (
            <section className={s.section}>
              <h2 className={s.sectionTitle}>카드뉴스</h2>
              <div className={s.grid}>
                {bookmarkedCardNews.map((item) => (
                  <CardNews key={item.id} {...item} />
                ))}
              </div>
            </section>
          )}

          {showPapers && bookmarkedPapers.length > 0 && (
            <section className={s.section}>
              <h2 className={s.sectionTitle}>논문</h2>
              <div className={s.grid}>
                {bookmarkedPapers.map(({ cardNews, papers }) => (
                  <PaperCollectionCard key={cardNews.id} cardNews={cardNews} papers={papers} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </MainLayout>
  );
}
