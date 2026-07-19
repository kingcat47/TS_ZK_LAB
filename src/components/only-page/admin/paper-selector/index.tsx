import { useState, useEffect } from "react";
import { getPapersList } from "@/api/firestore";
import type { PaperDocItem } from "@/api/firestore";
import type { PaperInput } from "@/types/admin";
import { PAPER_TYPES } from "@/types/admin";

import s from "./styles.module.scss";

interface PaperSelectorProps {
  papers: PaperInput[];
  onChange: (papers: PaperInput[]) => void;
}

export default function PaperSelector({ papers, onChange }: PaperSelectorProps) {
  const [allPapers, setAllPapers] = useState<PaperDocItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPapersList().then((list) => {
      setAllPapers(list);
      setLoading(false);
    });
  }, []);

  function isSelected(docId: string) {
    return papers.some((p) => p.docId === docId);
  }

  function getSelected(docId: string) {
    return papers.find((p) => p.docId === docId);
  }

  function toggle(paper: PaperDocItem) {
    if (isSelected(paper.id)) {
      onChange(
        papers
          .filter((p) => p.docId !== paper.id)
          .map((p, i) => ({ ...p, order: i + 1 }))
      );
    } else {
      const newPaper: PaperInput = {
        docId: paper.id,
        order: papers.length + 1,
        type: paper.type as PaperInput["type"],
        title: paper.title,
        authors: paper.authors,
        journal: paper.journal,
        year: paper.year,
        url: paper.url,
        summary: paper.summary,
      };
      onChange([...papers, newPaper]);
    }
  }

  function updateSelected(docId: string, updates: Partial<Pick<PaperInput, "order" | "type">>) {
    onChange(papers.map((p) => p.docId === docId ? { ...p, ...updates } : p));
  }

  if (loading) {
    return (
      <div className={s.section}>
        <h2 className={s.sectionTitle}>논문 연결</h2>
        <p className={s.loading}>논문 목록 불러오는 중...</p>
      </div>
    );
  }

  if (allPapers.length === 0) {
    return (
      <div className={s.section}>
        <h2 className={s.sectionTitle}>논문 연결</h2>
        <p className={s.empty}>등록된 논문이 없습니다. 먼저 <strong>논문 관리</strong> 탭에서 논문을 등록해주세요.</p>
      </div>
    );
  }

  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>논문 연결</h2>
        <span className={s.selectedCount}>{papers.length}개 선택됨</span>
      </div>

      <div className={s.paperList}>
        {allPapers.map((paper) => {
          const selected = isSelected(paper.id);
          const linked = getSelected(paper.id);
          return (
            <div key={paper.id} className={[s.paperRow, selected ? s.selectedRow : ""].join(" ")}>
              <label className={s.checkLabel}>
                <input
                  type="checkbox"
                  className={s.checkbox}
                  checked={selected}
                  onChange={() => toggle(paper)}
                />
                <div className={s.paperInfo}>
                  <span className={s.typeBadge}>{paper.type}</span>
                  <span className={s.paperTitle}>{paper.title}</span>
                  <span className={s.paperMeta}>
                    {paper.authors && `${paper.authors} · `}{paper.year}
                    {paper.journal && ` · ${paper.journal}`}
                  </span>
                </div>
              </label>

              {selected && linked && (
                <div className={s.overrideRow}>
                  <label className={s.overrideField}>
                    <span className={s.overrideLabel}>순서</span>
                    <input
                      type="number"
                      className={s.orderInput}
                      min={1}
                      value={linked.order}
                      onChange={(e) => updateSelected(paper.id, { order: Number(e.target.value) })}
                    />
                  </label>
                  <label className={s.overrideField}>
                    <span className={s.overrideLabel}>유형</span>
                    <select
                      className={s.typeSelect}
                      value={linked.type}
                      onChange={(e) => updateSelected(paper.id, { type: e.target.value as PaperInput["type"] })}
                    >
                      {PAPER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
