import { useNavigate } from "react-router-dom";

import { MainLayout } from "@/components/layout";
import { Button } from "@/components/ui";

import s from "./styles/bookmarks.module.scss";

export default function Bookmarks() {
  const navigate = useNavigate();

  // TODO: 로그인 상태 연동 후 실제 찜 목록으로 교체
  const isLoggedIn = false;

  return (
    <MainLayout>
      <div className={s.container}>
        {isLoggedIn ? (
          <p>찜한 목록이 없습니다.</p>
        ) : (
          <div className={s.empty}>
            <p className={s.emptyTitle}>로그인이 필요한 서비스입니다.</p>
            <p className={s.emptyDesc}>로그인하고 관심있는 카드뉴스와 논문을 저장해보세요.</p>
            <Button onClick={() => navigate("/auth/login")}>로그인하기</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
