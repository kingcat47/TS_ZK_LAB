import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import { useAuth } from "../auth/AuthContext";
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
    getBookmarks(user.uid).then((data) => {
      const cleaned = {
        cardNews: data.cardNews.map(String).filter((id) => id !== "NaN" && id !== "null" && id !== "undefined"),
        papers: data.papers.map(String).filter((id) => id !== "NaN" && id !== "null" && id !== "undefined"),
      };
      setBookmarks(cleaned);
      if (user) saveBookmarks(user.uid, cleaned);
    });
  }, [user, loading]);

  function save(next: BookmarksState) {
    setBookmarks(next);
    if (user) saveBookmarks(user.uid, next);
  }

  function toggleCardNews(id: string) {
    save({
      ...bookmarks,
      cardNews: bookmarks.cardNews.includes(id)
        ? bookmarks.cardNews.filter((i) => i !== id)
        : [...bookmarks.cardNews, id],
    });
  }

  function togglePaper(cardNewsId: string) {
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
        isCardNewsBookmarked: (id) => bookmarks.cardNews.includes(String(id)),
        isPaperBookmarked: (cardNewsId) => bookmarks.papers.includes(String(cardNewsId)),
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}
