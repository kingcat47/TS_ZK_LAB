import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

import { PAPER_TYPES, EMPTY_PAPER } from "@/types/admin";
import type { PaperInput } from "@/types/admin";

import s from "./styles.module.scss";

interface PaperManagerProps {
  papers: PaperInput[];
  onChange: (papers: PaperInput[]) => void;
}

export default function PaperManager({ papers, onChange }: PaperManagerProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function addPaper() {
    const newPaper = { ...EMPTY_PAPER, order: papers.length + 1 };
    onChange([...papers, newPaper]);
    setOpenIndex(papers.length);
  }

  function removePaper(index: number) {
    onChange(papers.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  function updatePaper(index: number, updates: Partial<PaperInput>) {
    onChange(papers.map((p, i) => (i === index ? { ...p, ...updates } : p)));
  }

  function addSummary(paperIndex: number) {
    const paper = papers[paperIndex];
    updatePaper(paperIndex, { summary: [...paper.summary, { heading: "", content: "" }] });
  }

  function updateSummary(paperIndex: number, summaryIndex: number, key: "heading" | "content", value: string) {
    const paper = papers[paperIndex];
    const newSummary = paper.summary.map((s, i) => (i === summaryIndex ? { ...s, [key]: value } : s));
    updatePaper(paperIndex, { summary: newSummary });
  }

  function removeSummary(paperIndex: number, summaryIndex: number) {
    const paper = papers[paperIndex];
    updatePaper(paperIndex, { summary: paper.summary.filter((_, i) => i !== summaryIndex) });
  }

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>논문</h2>

      <div className={s.paperList}>
        {papers.map((paper, pi) => (
          <div key={pi} className={s.paperCard}>
            <div className={s.paperHeader} onClick={() => setOpenIndex(openIndex === pi ? null : pi)}>
              <div className={s.paperHeaderLeft}>
                <span className={s.orderBadge}>{pi + 1}</span>
                <span className={s.paperTitle}>{paper.title || "제목 없음"}</span>
                <span className={s.typeBadge}>{paper.type}</span>
              </div>
              <div className={s.paperHeaderRight}>
                <button type="button" className={s.removeBtn} onClick={(e) => { e.stopPropagation(); removePaper(pi); }}>
                  <X size={14} />
                </button>
                {openIndex === pi ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {openIndex === pi && (
              <div className={s.paperBody}>
                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>논문 제목 *</label>
                    <input className={s.input} value={paper.title} onChange={(e) => updatePaper(pi, { title: e.target.value })} placeholder="논문 제목" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>저자</label>
                    <input className={s.input} value={paper.authors} onChange={(e) => updatePaper(pi, { authors: e.target.value })} placeholder="저자명" />
                  </div>
                </div>

                <div className={s.row}>
                  <div className={s.field}>
                    <label className={s.label}>저널/출처</label>
                    <input className={s.input} value={paper.journal} onChange={(e) => updatePaper(pi, { journal: e.target.value })} placeholder="저널명" />
                  </div>
                  <div className={s.field}>
                    <label className={s.label}>연도</label>
                    <input className={s.input} type="number" value={paper.year} onChange={(e) => updatePaper(pi, { year: Number(e.target.value) })} />
                  </div>
                </div>

                <div className={s.field}>
                  <label className={s.label}>원문 링크</label>
                  <input className={s.input} value={paper.url} onChange={(e) => updatePaper(pi, { url: e.target.value })} placeholder="https://..." />
                </div>

                <div className={s.field}>
                  <label className={s.label}>논문 유형</label>
                  <div className={s.typeGroup}>
                    {PAPER_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={[s.typeBtn, paper.type === type ? s.selected : ""].join(" ")}
                        onClick={() => updatePaper(pi, { type })}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={s.field}>
                  <div className={s.labelRow}>
                    <label className={s.label}>요약 섹션</label>
                    <button type="button" className={s.addSmallBtn} onClick={() => addSummary(pi)}>+ 섹션 추가</button>
                  </div>
                  {paper.summary.map((sum, si) => (
                    <div key={si} className={s.summaryItem}>
                      <div className={s.summaryHeader}>
                        <span className={s.summaryNum}>{si + 1}</span>
                        <button type="button" className={s.removeSmallBtn} onClick={() => removeSummary(pi, si)}><X size={12} /></button>
                      </div>
                      <input className={s.input} value={sum.heading} onChange={(e) => updateSummary(pi, si, "heading", e.target.value)} placeholder="소제목 (예: 연구 배경)" />
                      <textarea className={s.textarea} value={sum.content} onChange={(e) => updateSummary(pi, si, "content", e.target.value)} placeholder="내용" rows={4} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" className={s.addPaperBtn} onClick={addPaper}>
        <Plus size={16} /> 논문 추가
      </button>
    </div>
  );
}
