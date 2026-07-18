import { CATEGORIES } from "@/types/admin";
import type { Category } from "@/types/admin";

import s from "./styles.module.scss";

interface BasicInfoFormProps {
  title: string;
  category: Category | "";
  tags: string[];
  published: boolean;
  onTitleChange: (v: string) => void;
  onCategoryChange: (v: Category) => void;
  onTagsChange: (v: string[]) => void;
  onPublishedChange: (v: boolean) => void;
}

export default function BasicInfoForm({
  title, category, tags, published,
  onTitleChange, onCategoryChange, onTagsChange, onPublishedChange,
}: BasicInfoFormProps) {
  function handleTagInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = (e.target as HTMLInputElement).value.trim();
      if (value && !tags.includes(value)) {
        onTagsChange([...tags, value]);
        (e.target as HTMLInputElement).value = "";
      }
    }
  }

  function removeTag(tag: string) {
    onTagsChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>기본 정보</h2>

      <div className={s.field}>
        <label className={s.label}>제목 *</label>
        <input
          className={s.input}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="카드뉴스 제목을 입력하세요"
        />
      </div>

      <div className={s.field}>
        <label className={s.label}>카테고리 *</label>
        <div className={s.categoryGroup}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={[s.categoryBtn, category === cat ? s.selected : ""].join(" ")}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>태그</label>
        <div className={s.tagWrapper}>
          {tags.map((tag) => (
            <span key={tag} className={s.tag}>
              #{tag}
              <button type="button" className={s.tagRemove} onClick={() => removeTag(tag)}>×</button>
            </span>
          ))}
          <input
            className={s.tagInput}
            placeholder="태그 입력 후 Enter"
            onKeyDown={handleTagInput}
          />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.toggleLabel}>
          <span className={s.label}>공개 여부</span>
          <div
            className={[s.toggle, published ? s.on : ""].join(" ")}
            onClick={() => onPublishedChange(!published)}
          >
            <div className={s.toggleThumb} />
          </div>
          <span className={s.toggleText}>{published ? "공개" : "비공개"}</span>
        </label>
      </div>
    </div>
  );
}
