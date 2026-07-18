export interface PaperSummarySection {
  heading: string;
  content: string;
}

export interface Paper {
  id: number;
  cardNewsId: number;
  order: number;
  type: "근본" | "발전" | "트렌드" | "한계";
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  summary: PaperSummarySection[];
}

export const MOCK_PAPERS: Paper[] = [
  {
    id: 1,
    cardNewsId: 1,
    order: 1,
    type: "근본",
    title: "The General Theory of Employment, Interest and Money",
    authors: "John Maynard Keynes",
    journal: "Macmillan",
    year: 1936,
    url: "https://www.worldbank.org",
    summary: [
      {
        heading: "연구 배경",
        content: "대공황 이후 고전 경제학이 설명하지 못한 대량 실업 문제를 해결하기 위해 쓰여진 논문입니다. 케인스는 시장이 자율적으로 완전고용 상태를 달성한다는 고전파의 전제에 의문을 제기했습니다.",
      },
      {
        heading: "핵심 내용",
        content: "총수요가 경제의 산출량과 고용을 결정한다는 '유효수요 이론'을 제시합니다. 정부가 재정 지출을 통해 총수요를 조절함으로써 경기 침체를 극복할 수 있다고 주장했습니다.",
      },
      {
        heading: "의의 및 결론",
        content: "현대 거시경제학의 출발점이 된 연구로, GDP 개념의 정립과 국가의 경제 개입 정당성을 이론적으로 뒷받침했습니다. 이후 수십 년간 각국 경제 정책의 근간이 되었습니다.",
      },
    ],
  },
  {
    id: 2,
    cardNewsId: 1,
    order: 2,
    type: "발전",
    title: "A Monetary History of the United States, 1867–1960",
    authors: "Milton Friedman, Anna J. Schwartz",
    journal: "Princeton University Press",
    year: 1963,
    url: "https://www.imf.org",
    summary: [
      {
        heading: "연구 배경",
        content: "케인스 경제학이 주류를 이루던 시기, 화폐량 변화가 경제에 미치는 영향을 역사적 데이터로 검증하려는 시도에서 출발했습니다.",
      },
      {
        heading: "핵심 내용",
        content: "대공황은 연방준비제도의 통화 긴축 정책 실패가 주요 원인임을 실증했습니다. 통화량(M2)과 명목 GDP 사이의 강한 상관관계를 입증하며 인플레이션은 '언제 어디서나 화폐적 현상'이라는 명제를 제시합니다.",
      },
      {
        heading: "의의 및 결론",
        content: "통화주의 경제학의 토대를 마련하였으며, 이후 중앙은행 독립성과 기준금리 정책의 중요성이 강조되는 계기가 되었습니다.",
      },
    ],
  },
  {
    id: 3,
    cardNewsId: 1,
    order: 3,
    type: "트렌드",
    title: "Global Economic Prospects 2024",
    authors: "World Bank Group",
    journal: "World Bank Publications",
    year: 2024,
    url: "https://www.worldbank.org",
    summary: [
      {
        heading: "연구 배경",
        content: "코로나19 이후 글로벌 공급망 충격, 러시아-우크라이나 전쟁, 주요국 긴축 통화 정책이 맞물리며 세계 경제 성장 전망이 불투명해진 시기에 발간된 보고서입니다.",
      },
      {
        heading: "핵심 내용",
        content: "2024년 세계 경제 성장률을 2.4%로 전망하며, 이는 지난 10년 평균인 3.1%를 크게 밑도는 수치입니다. 고금리 장기화와 지정학적 불확실성이 주요 하방 리스크로 꼽혔습니다.",
      },
      {
        heading: "의의 및 결론",
        content: "선진국과 신흥국 간 성장 격차가 커지는 '글로벌 디버전스' 현상이 심화되고 있으며, 각국이 재정 건전성을 유지하면서도 성장 동력을 확보해야 한다는 과제를 제시합니다.",
      },
    ],
  },
  {
    id: 4,
    cardNewsId: 1,
    order: 4,
    type: "한계",
    title: "The Limits of Monetary Policy in the Current Environment",
    authors: "Lawrence H. Summers",
    journal: "Brookings Institution",
    year: 2023,
    url: "https://www.brookings.edu",
    summary: [
      {
        heading: "연구 배경",
        content: "2022~2023년 급격한 기준금리 인상에도 불구하고 노동 시장이 견조하게 유지되고 인플레이션 하락이 더딘 현상에 주목하며 작성되었습니다.",
      },
      {
        heading: "핵심 내용",
        content: "전통적인 통화 정책 경로(금리→대출→소비 위축)가 팬데믹 이후 변화된 경제 구조에서는 예상보다 효과가 제한적임을 지적합니다. 특히 고정금리 모기지 비중 확대, 기업의 장기 채권 조달 증가 등이 금리 전달 메커니즘을 약화시켰다고 분석합니다.",
      },
      {
        heading: "의의 및 결론",
        content: "통화 정책만으로는 현재 경제 불균형을 해소하기 어려우며, 재정 정책과의 정책 조합(Policy Mix) 및 구조적 개혁이 병행되어야 함을 강조합니다.",
      },
    ],
  },
];
