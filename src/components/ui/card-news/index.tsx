import { useNavigate } from "react-router-dom";

import s from "./styles.module.scss";

export interface CardNewsProps {
  id: string | number;
  thumbnail: string;
  title: string;
  description?: string;
  category?: string;
  date?: string;
}

export default function CardNews({
  id,
  thumbnail,
  title,
  description,
  category,
  date,
}: CardNewsProps) {
  const navigate = useNavigate();

  return (
    <article className={s.card} onClick={() => navigate(`/card-news/${id}`)}>
      <div className={s.thumbnail}>
        <img src={thumbnail} alt={title} />
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
