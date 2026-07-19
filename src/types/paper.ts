export interface PaperSummarySection {
  heading: string;
  content: string;
}

export interface UnifiedPaper {
  id: string | number;
  order: number;
  type: "근본" | "발전" | "트렌드" | "한계";
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  summary: { heading: string; content: string }[];
}
