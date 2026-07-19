import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";

import { useBookmarks } from "@/contexts/BookmarksContext";
import { useAuth } from "@/contexts/AuthContext";

import s from "./styles.module.scss";

export interface CardNewsProps {
  id: string | number;
  thumbnail: string;
  title: string;
  description?: string;
  category?: string;
  date?: string;
}

export default function CardNews({ id, thumbnail, title, description, category, date }: CardNewsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isCardNewsBookmarked, toggleCardNews } = useBookmarks();
  const bookmarked = isCardNewsBookmarked(String(id));

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { navigate("/auth/login"); return; }
    toggleCardNews(String(id));
  };

  return (
    <article className={s.card} onClick={() => navigate(`/card-news/${id}`)}>
      <div className={s.thumbnail}>
        <img src={thumbnail} alt={title} />
        <button
          className={[s.bookmarkBtn, bookmarked ? s.bookmarked : ""].join(" ")}
          onClick={handleBookmark}
          title={bookmarked ? "찜 해제" : "찜하기"}
        >
          <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <div className={s.content}>
        {category && <span className={s.category}>{category}</span>}
        <h3 className={s.title}>{title}</h3>
        {description && <p className={s.description}>{description}</p>}
        {date && <time className={s.date}>{date}</time>}
      </div>
    </article>
  );
}
