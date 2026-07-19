import { useState, useRef, useEffect } from "react";
import { Newspaper, BookOpen, Bookmark, LogOut, Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import HeaderItem from "@/components/ui/header/header-item";
import SearchOverlay from "@/components/ui/search-overlay";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/api/auth";

import s from "./styles.module.scss";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className={s.header}>
        <div className={s.header_content}>
          <div className={s.right}>
            <Link to="/" className={s.logoLink}>
              <img src="/logo.svg" alt="logo" width="105" height="30" />
            </Link>
            <nav className={s.items} aria-label="주요 메뉴">
              <HeaderItem text="카드뉴스" icon={Newspaper} href="/" isActive={pathname === "/"} />
              <HeaderItem text="논문" icon={BookOpen} href="/papers" isActive={pathname.startsWith("/papers")} />
              <HeaderItem text="찜한 목록" icon={Bookmark} href="/bookmarks" isActive={pathname.startsWith("/bookmarks")} />
            </nav>
          </div>

          <div className={s.actions}>
            <button className={s.searchBtn} onClick={() => setIsSearchOpen(true)} title="검색">
              <Search size={20} />
            </button>

            {user ? (
              <div className={s.profileWrapper} ref={dropdownRef}>
                <button className={s.profileBtn} onClick={() => setIsDropdownOpen((v) => !v)}>
                  {user.photoURL && (
                    <img src={user.photoURL} alt={user.displayName ?? "유저"} className={s.avatar} />
                  )}
                  <span className={s.userName}>{user.displayName}</span>
                </button>

                {isDropdownOpen && (
                  <div className={s.dropdown}>
                    <button
                      className={s.dropdownItem}
                      onClick={() => { signOut(); setIsDropdownOpen(false); }}
                    >
                      <LogOut size={15} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button size="medium" variant="primary" onClick={() => navigate("/auth/login")}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
    </>
  );
}
