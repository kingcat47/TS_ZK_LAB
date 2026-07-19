import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { getPapersList, savePaperDoc, updatePaperDoc, deletePaperDoc } from "@/api/firestore";
import type { PaperDocItem, PaperDocData } from "@/api/firestore";
import { PAPER_TYPES } from "@/types/admin";

import s from "./styles.module.scss";

const EMPTY_FORM: PaperDocData = {
  title: "",
  authors: "",
  journal: "",
  year: new Date().getFullYear(),
  url: "",
  type: "근본",
  summary: [
    { heading: "서론", content: "" },
    { heading: "본론", content: "" },
    { heading: "결론", content: "" },
  ],
};

export default function PaperDbManager() {
  const [papers, setPapers] = useState<PaperDocItem[]>([]);
  const [form, setForm] = useState<PaperDocData>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPapers(await getPapersList());
  }, []);

  useEffect(() => { load(); }, [load]);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(paper: PaperDocItem) {
    setForm({
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      year: paper.year,
      url: paper.url,
      type: paper.type,
      summary: paper.summary,
    });
    setEditingId(paper.id);
    setShowForm(true);
    setExpandedId(null);
  }

  async function handleDelete(id: string) {
    if (!confirm("이 논문을 삭제할까요?")) return;
    await deletePaperDoc(id);
    load();
  }

  async function handleSave() {
    if (!form.title.trim()) { alert("제목은 필수입니다."); return; }
    setSaving(true);
    try {
      if (editingId) await updatePaperDoc(editingId, form);
      else await savePaperDoc(form);
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof PaperDocData>(key: K, value: PaperDocData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSummary() {
    updateField("summary", [...form.summary, { heading: "", content: "" }]);
  }

  function updateSummary(i: number, key: "heading" | "content", value: string) {
    updateField("summary", form.summary.map((item, idx) => idx === i ? { ...item, [key]: value } : item));
  }

  function removeSummary(i: number) {
    updateField("summary", form.summary.filter((_, idx) => idx !== i));
  }

  return (
    <div className={s.section}>
      <div className={s.sectionHeader}>
        <h2 className={s.sectionTitle}>논문 관리</h2>
        {!showForm && (
          <button type="button" className={s.addBtn} onClick={startCreate}>
            <Plus size={14} /> 논문 등록
          </button>
        )}
      </div>

      {showForm && (
        <div className={s.formCard}>
          <div className={s.formHeader}>
            <h3 className={s.formTitle}>{editingId ? "논문 수정" : "논문 등록"}</h3>
            <button type="button" className={s.iconBtn} onClick={() => setShowForm(false)}>
              <X size={16} />
            </button>
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>논문 제목 *</label>
              <input className={s.input} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="논문 제목" />
            </div>
            <div className={s.field}>
              <label className={s.label}>저자</label>
              <input className={s.input} value={form.authors} onChange={(e) => updateField("authors", e.target.value)} placeholder="저자명" />
            </div>
          </div>

          <div className={s.row}>
            <div className={s.field}>
              <label className={s.label}>저널/출처</label>
              <input className={s.input} value={form.journal} onChange={(e) => updateField("journal", e.target.value)} placeholder="저널명" />
            </div>
            <div className={s.field}>
              <label className={s.label}>연도</label>
              <input className={s.input} type="number" value={form.year} onChange={(e) => updateField("year", Number(e.target.value))} />
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>원문 링크</label>
            <input className={s.input} value={form.url} onChange={(e) => updateField("url", e.target.value)} placeholder="https://..." />
          </div>

          <div className={s.field}>
            <label className={s.label}>논문 유형</label>
            <div className={s.typeGroup}>
              {PAPER_TYPES.map((type) => (
                <button key={type} type="button"
                  className={[s.typeBtn, form.type === type ? s.selected : ""].join(" ")}
                  onClick={() => updateField("type", type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className={s.field}>
            <div className={s.labelRow}>
              <label className={s.label}>요약 섹션</label>
              <button type="button" className={s.addSmallBtn} onClick={addSummary}>+ 섹션 추가</button>
            </div>
            {form.summary.map((item, i) => (
              <div key={i} className={s.summaryItem}>
                <div className={s.summaryHeader}>
                  <span className={s.summaryNum}>{i + 1}</span>
                  <button type="button" className={s.removeSmallBtn} onClick={() => removeSummary(i)}><X size={12} /></button>
                </div>
                <input className={s.input} value={item.heading} onChange={(e) => updateSummary(i, "heading", e.target.value)} placeholder="소제목" />
                <textarea className={s.textarea} value={item.content} onChange={(e) => updateSummary(i, "content", e.target.value)} placeholder="내용" rows={4} />
              </div>
            ))}
          </div>

          <div className={s.formActions}>
            <button type="button" className={s.cancelBtn} onClick={() => setShowForm(false)}>취소</button>
            <button type="button" className={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? "저장 중..." : editingId ? "수정 완료" : "등록"}
            </button>
          </div>
        </div>
      )}

      {papers.length === 0 && !showForm && (
        <p className={s.empty}>등록된 논문이 없습니다. 논문을 등록해보세요.</p>
      )}

      <div className={s.paperList}>
        {papers.map((paper) => (
          <div key={paper.id} className={s.paperCard}>
            <div className={s.paperHeader} onClick={() => setExpandedId(expandedId === paper.id ? null : paper.id)}>
              <div className={s.paperHeaderLeft}>
                <span className={s.typeBadge}>{paper.type}</span>
                <span className={s.paperTitle}>{paper.title || "제목 없음"}</span>
                <span className={s.meta}>{paper.authors && `${paper.authors} · `}{paper.year}</span>
              </div>
              <div className={s.paperHeaderRight}>
                <button type="button" className={s.editBtn} onClick={(e) => { e.stopPropagation(); startEdit(paper); }}>
                  <Edit2 size={13} />
                </button>
                <button type="button" className={s.removeBtn} onClick={(e) => { e.stopPropagation(); handleDelete(paper.id); }}>
                  <Trash2 size={13} />
                </button>
                {expandedId === paper.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </div>
            </div>

            {expandedId === paper.id && (
              <div className={s.paperDetail}>
                {paper.journal && <p className={s.detailRow}><span>저널</span>{paper.journal}</p>}
                {paper.url && <p className={s.detailRow}><span>링크</span><a href={paper.url} target="_blank" rel="noopener noreferrer">{paper.url}</a></p>}
                {paper.summary.length > 0 && (
                  <div className={s.summaryPreview}>
                    {paper.summary.map((item, i) => (
                      <div key={i} className={s.summaryPreviewItem}>
                        <strong>{item.heading}</strong>
                        <p>{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
