import { createContext, useContext } from "react";

export interface BookmarksState {
  cardNews: number[];
  papers: number[];
}

export interface BookmarksContextType {
  bookmarks: BookmarksState;
  toggleCardNews: (id: number) => void;
  togglePaper: (cardNewsId: number) => void;
  isCardNewsBookmarked: (id: number) => boolean;
  isPaperBookmarked: (cardNewsId: number) => boolean;
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
