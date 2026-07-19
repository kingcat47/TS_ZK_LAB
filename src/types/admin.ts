export const CATEGORIES = [
  "암호학",
  "네트워크 보안",
  "웹 보안",
  "블록체인/분산보안",
  "최신 트렌드",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PAPER_TYPES = ["근본", "발전", "트렌드", "한계"] as const;
export type PaperType = (typeof PAPER_TYPES)[number];

export interface TermInput {
  word: string;
  description: string;
}

export interface SummaryInput {
  heading: string;
  content: string;
}

export interface PaperInput {
  docId?: string; // papers 컬렉션 ID (PaperSelector로 연결 시)
  order: number;
  type: PaperType;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  summary: SummaryInput[];
}

export interface CardNewsFormData {
  title: string;
  category: Category | "";
  tags: string[];
  published: boolean;
  thumbnail: File | null;
  thumbnailPreview: string;
  slides: { file?: File; preview: string; existingUrl?: string }[];
  existingThumbnailUrl: string;
  terms: TermInput[];
  content: object | null; // Tiptap JSON
  papers: PaperInput[];
}

export const EMPTY_PAPER: PaperInput = {
  order: 1,
  type: "근본",
  title: "",
  authors: "",
  journal: "",
  year: new Date().getFullYear(),
  url: "",
  summary: [
    { heading: "서론", content: "" },
    { heading: "본론", content: "" },
    { heading: "결론", content: "" },
  ],
};
