import { useParams } from "react-router-dom";

import { MainLayout } from "@/components/layout";

export default function CardNewsDetail() {
  const { id } = useParams();

  return (
    <MainLayout>
      <div>카드뉴스 {id} 상세 페이지</div>
    </MainLayout>
  );
}
