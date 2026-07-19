import { createContext, useContext } from "react";

export interface BookmarksState {
  cardNews: string[];
  papers: string[];
}

export interface BookmarksContextType {
  bookmarks: BookmarksState;
  toggleCardNews: (id: string) => void;
  togglePaper: (cardNewsId: string) => void;
  isCardNewsBookmarked: (id: string) => boolean;
  isPaperBookmarked: (cardNewsId: string) => boolean;
}

export const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: { cardNews: [], papers: [] },
  toggleCardNews: () => {},
  togglePaper: () => {},
  isCardNewsBookmarked: () => false,
  isPaperBookmarked: () => false,
});

export function useBookmarks() {
  return useContext(BookmarksContext);
}
