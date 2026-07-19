import { useState } from "react";

import s from "./styles.module.scss";

interface CardNewsViewerProps {
  slides: string[];
  title: string;
}

export default function CardNewsViewer({ slides, title }: CardNewsViewerProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => Math.max(i - 1, 0));
  const next = () => setCurrent((i) => Math.min(i + 1, slides.length - 1));

  return (
    <div className={s.viewer}>
      <div className={s.track}>
        <div
          className={s.strip}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((src, i) => (
            <img key={i} src={src} alt={`${title} ${i + 1}번째 카드`} className={s.slide} />
          ))}
        </div>
        {slides.length > 1 && (
          <>
            <button className={s.arrowLeft} onClick={prev} disabled={current === 0}>&#8592;</button>
            <button className={s.arrowRight} onClick={next} disabled={current === slides.length - 1}>&#8594;</button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className={s.indicators}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={[s.dot, i === current ? s.active : ""].join(" ")}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
      <p className={s.counter}>{current + 1} / {slides.length}</p>
    </div>
  );
}
