import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import { useAuth } from "./AuthContext";
import { getBookmarks, saveBookmarks } from "@/api/firestore";
import { BookmarksContext } from "./BookmarksContext";
import type { BookmarksState } from "./BookmarksContext";

const EMPTY: BookmarksState = { cardNews: [], papers: [] };

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarksState>(EMPTY);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setBookmarks(EMPTY);
      return;
    }
    getBookmarks(user.uid).then((data) =>
      setBookmarks({
        cardNews: data.cardNews.map(Number),
        papers: data.papers.map(Number),
      })
    );
  }, [user, loading]);

  function save(next: BookmarksState) {
    setBookmarks(next);
    if (user) saveBookmarks(user.uid, next);
  }

  function toggleCardNews(id: number) {
    save({
      ...bookmarks,
      cardNews: bookmarks.cardNews.includes(id)
        ? bookmarks.cardNews.filter((i) => i !== id)
        : [...bookmarks.cardNews, id],
    });
  }

  function togglePaper(cardNewsId: number) {
    save({
      ...bookmarks,
      papers: bookmarks.papers.includes(cardNewsId)
        ? bookmarks.papers.filter((i) => i !== cardNewsId)
        : [...bookmarks.papers, cardNewsId],
    });
  }

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        toggleCardNews,
        togglePaper,
        isCardNewsBookmarked: (id) => bookmarks.cardNews.includes(id),
        isPaperBookmarked: (cardNewsId) => bookmarks.papers.includes(cardNewsId),
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
