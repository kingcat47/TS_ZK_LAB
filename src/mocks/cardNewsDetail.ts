import type { Term } from "@/components/only-page/card-news-detail/term-section";
import type { Segment } from "@/components/only-page/card-news-detail/explain-section";
import type { Reference } from "@/components/only-page/card-news-detail/reference-section";

export interface CardNewsDetailData {
  id: number;
  title: string;
  slides: string[];
  terms: Term[];
  paragraphs: Segment[][];
  references: Reference[];
}

export const MOCK_CARD_NEWS_DETAIL: CardNewsDetailData[] = [
  {
    id: 1,
    title: "2024년 글로벌 경제 전망, 어디로 향하나",
    slides: [
      "https://picsum.photos/seed/detail1a/680/480",
      "https://picsum.photos/seed/detail1b/680/480",
      "https://picsum.photos/seed/detail1c/680/480",
    ],
    terms: [
      { word: "GDP", description: "국내총생산. 일정 기간 동안 한 나라에서 생산된 모든 재화와 서비스의 시장 가치 합계" },
      { word: "인플레이션", description: "물가가 지속적으로 상승하는 현상. 화폐 가치가 하락하고 구매력이 줄어든다." },
      { word: "기준금리", description: "중앙은행이 시중 은행에 돈을 빌려줄 때 적용하는 금리. 시장 전체 금리에 영향을 준다." },
      { word: "경상수지", description: "국가 간 상품·서비스·소득 거래의 수입과 지출 차이를 나타내는 지표" },
    ],
    paragraphs: [
      [
        { type: "text", content: "2024년 세계 경제는 " },
        { type: "term", word: "인플레이션", description: "물가가 지속적으로 상승하는 현상.\n화폐 가치가 하락하고 구매력이 줄어든다." },
        { type: "text", content: " 완화와 함께 완만한 회복세를 보일 것으로 전망됩니다." },
      ],
      [
        { type: "text", content: "각국 중앙은행의 " },
        { type: "term", word: "기준금리", description: "중앙은행이 시중 은행에 돈을 빌려줄 때\n적용하는 금리. 시장 전체 금리에 영향을 준다." },
        { type: "text", content: " 인하 여부가 핵심 변수로, 이는 소비·투자 심리에 직접적인 영향을 미칩니다." },
      ],
      [
        { type: "text", content: "한편 주요국의 " },
        { type: "term", word: "GDP", description: "국내총생산. 일정 기간 동안 한 나라에서\n생산된 모든 재화와 서비스의 시장 가치 합계" },
        { type: "text", content: " 성장률 격차가 커지면서 " },
        { type: "term", word: "경상수지", description: "국가 간 상품·서비스·소득 거래의\n수입과 지출 차이를 나타내는 지표" },
        { type: "text", content: " 불균형도 심화될 전망입니다." },
      ],
    ],
    references: [
      {
        title: "Global Economic Prospects 2024",
        authors: "World Bank Group",
        source: "World Bank",
        year: 2024,
        url: "https://www.worldbank.org",
      },
      {
        title: "World Economic Outlook: Navigating Global Divergences",
        authors: "IMF Research Department",
        source: "IMF",
        year: 2024,
        url: "https://www.imf.org",
      },
    ],
  },
];
