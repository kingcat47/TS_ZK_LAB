import { useState } from "react";
import type { ReactNode } from "react";
import { BookmarksContext } from "./BookmarksContext";
import type { BookmarksState } from "./BookmarksContext";

const STORAGE_KEY = "ts_zk_lab_bookmarks";

function loadFromStorage(): BookmarksState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { cardNews: [], papers: [] };
  } catch {
    return { cardNews: [], papers: [] };
  }
}

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarksState>(loadFromStorage);

  function save(next: BookmarksState) {
    setBookmarks(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
