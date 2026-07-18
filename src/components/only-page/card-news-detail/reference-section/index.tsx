import { Link } from "react-router-dom";

import s from "./styles.module.scss";

export interface Reference {
  paperId: number;
  title: string;
  authors: string;
  source: string;
  year: number;
}

interface ReferenceSectionProps {
  cardNewsId: number;
  references: Reference[];
}

export default function ReferenceSection({ cardNewsId, references }: ReferenceSectionProps) {
  return (
    <section className={s.section}>
      <h2 className={s.title}>관련 자료</h2>
      <ul className={s.list}>
        {references.map((ref) => (
          <li key={ref.paperId} className={s.card}>
            <div className={s.meta}>
              <span className={s.source}>{ref.source}</span>
              <span className={s.year}>{ref.year}</span>
            </div>
            <p className={s.refTitle}>{ref.title}</p>
            <p className={s.authors}>{ref.authors}</p>
            <Link to={`/card-news/${cardNewsId}/papers/${ref.paperId}`} className={s.link}>
              논문 보기 →
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/card-news/${cardNewsId}/papers`} className={s.allLink}>
        논문 목록 전체보기 →
      </Link>
    </section>
  );
}
