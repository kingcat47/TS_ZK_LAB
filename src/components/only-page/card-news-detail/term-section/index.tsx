import s from "./styles.module.scss";

export interface Term {
  word: string;
  description: string;
}

interface TermSectionProps {
  terms: Term[];
}

export default function TermSection({ terms }: TermSectionProps) {
  return (
    <section className={s.section}>
      <h2 className={s.title}>전문 용어 설명</h2>
      <div className={s.grid}>
        {terms.map((term) => (
          <div key={term.word} className={s.card}>
            <span className={s.word}>{term.word}</span>
            <p className={s.description}>{term.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
