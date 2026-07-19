import { useRef } from "react";
import { ImageIcon, X, GripVertical } from "lucide-react";

import s from "./styles.module.scss";

interface SlideUploaderProps {
  thumbnail: File | null;
  thumbnailPreview: string;
  slides: { file?: File; preview: string; existingUrl?: string }[];
  onThumbnailChange: (file: File, preview: string) => void;
  onSlidesChange: (slides: { file?: File; preview: string; existingUrl?: string }[]) => void;
}

export default function SlideUploader({
  thumbnailPreview, slides,
  onThumbnailChange, onSlidesChange,
}: SlideUploaderProps) {
  const thumbRef = useRef<HTMLInputElement>(null);
  const slidesRef = useRef<HTMLInputElement>(null);

  function handleThumbnail(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onThumbnailChange(file, URL.createObjectURL(file));
  }

  function handleSlides(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newSlides = files.map((file) => ({ file, preview: URL.createObjectURL(file), existingUrl: undefined }));
    onSlidesChange([...slides, ...newSlides]);
    e.target.value = "";
  }

  function removeSlide(index: number) {
    onSlidesChange(slides.filter((_, i) => i !== index));
  }

  function moveSlide(from: number, to: number) {
    const next = [...slides];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onSlidesChange(next);
  }

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>이미지</h2>

      <div className={s.field}>
        <label className={s.label}>썸네일 (홈 카드에 표시)</label>
        <div className={s.thumbArea} onClick={() => thumbRef.current?.click()}>
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="썸네일" className={s.thumbPreview} />
          ) : (
            <div className={s.uploadPlaceholder}>
              <ImageIcon size={24} className={s.uploadIcon} />
              <span>클릭하여 썸네일 업로드</span>
            </div>
          )}
        </div>
        <input ref={thumbRef} type="file" accept="image/*" className={s.hidden} onChange={handleThumbnail} />
      </div>

      <div className={s.field}>
        <div className={s.labelRow}>
          <label className={s.label}>카드뉴스 슬라이드 ({slides.length}장)</label>
          <button type="button" className={s.addBtn} onClick={() => slidesRef.current?.click()}>
            + 이미지 추가
          </button>
        </div>
        <input ref={slidesRef} type="file" accept="image/*" multiple className={s.hidden} onChange={handleSlides} />

        {slides.length > 0 && (
          <div className={s.slideList}>
            {slides.map((slide, i) => (
              <div key={i} className={s.slideItem}>
                <GripVertical size={16} className={s.grip} />
                <span className={s.slideNum}>{i + 1}</span>
                <img src={slide.preview} alt={`슬라이드 ${i + 1}`} className={s.slideThumb} />
                <div className={s.slideActions}>
                  <button type="button" className={s.moveBtn} onClick={() => moveSlide(i, i - 1)} disabled={i === 0}>↑</button>
                  <button type="button" className={s.moveBtn} onClick={() => moveSlide(i, i + 1)} disabled={i === slides.length - 1}>↓</button>
                  <button type="button" className={s.removeBtn} onClick={() => removeSlide(i)}><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
