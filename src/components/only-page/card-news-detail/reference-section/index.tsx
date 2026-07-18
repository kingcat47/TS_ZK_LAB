import s from "./styles.module.scss";

export interface Reference {
  title: string;
  authors: string;
  source: string;
  year: number;
  url?: string;
}

interface ReferenceSectionProps {
  references: Reference[];
}

export default function ReferenceSection({ references }: ReferenceSectionProps) {
  return (
    <section className={s.section}>
      <h2 className={s.title}>관련 자료</h2>
      <ul className={s.list}>
        {references.map((ref, i) => (
          <li key={i} className={s.card}>
            <div className={s.meta}>
              <span className={s.source}>{ref.source}</span>
              <span className={s.year}>{ref.year}</span>
            </div>
            <p className={s.refTitle}>{ref.title}</p>
            <p className={s.authors}>{ref.authors}</p>
            {ref.url && (
              <a href={ref.url} target="_blank" rel="noopener noreferrer" className={s.link}>
                논문 보기 →
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
