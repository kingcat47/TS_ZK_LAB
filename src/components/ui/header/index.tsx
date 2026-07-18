import { Newspaper, BookOpen, Bookmark } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import HeaderItem from "@/components/ui/header/header-item";

import s from "./styles.module.scss";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <header className={s.header}>
      <div className={s.header_content}>
        <div className={s.right}>
          <Link to="/" className={s.logoLink}>
            <img
              className={s.logo}
              src="/logo.svg"
              alt="logo"
              width="77"
              height="22"
            />
          </Link>
          <nav className={s.items} aria-label="주요 메뉴">
            <HeaderItem
              text="카드뉴스"
              icon={Newspaper}
              href="/"
              isActive={pathname === "/"}
            />
            <HeaderItem
              text="논문"
              icon={BookOpen}
              href="/papers"
              isActive={pathname.startsWith("/papers")}
            />
            <HeaderItem
              text="찜한 목록"
              icon={Bookmark}
              href="/bookmarks"
              isActive={pathname.startsWith("/bookmarks")}
            />
          </nav>
        </div>
        <Button size="medium" variant="primary" onClick={() => navigate("/auth/login")}>
          로그인
        </Button>
      </div>
    </header>
  );
}
