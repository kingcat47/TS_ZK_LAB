import { useState, useEffect } from "react";
import { ArrowLeft, Check, Edit2, Trash2, Plus, X } from "lucide-react";
import {
  getCardNewsList,
  getPapersForCardNews,
  addPaperToCardNews,
  updatePaperInCardNews,
  deletePaperFromCardNews,
} from "@/api/firestore";
import type { CardNewsSummary, StoredPaper } from "@/api/firestore";
import { PAPER_TYPES } from "@/types/admin";
import ContentEditor from "@/components/only-page/admin/content-editor";

import s from "./styles.module.scss";

// ── 폼 타입 ────────────────────────────────────────────────

type SummarySection = { heading: string; content: object | null };

type PaperFormData = {
  order: number;
  type: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  url: string;
  summary: SummarySection[];
};

const EMPTY_FORM: PaperFormData = {
  order: 1,
  type: "근본",
  title: "",
  authors: "",
  journal: "",
  year: new Date().getFullYear(),
  url: "",
  summary: [
    { heading: "서론", content: null },
    { heading: "본론", content: null },
    { heading: "결론", content: null },
  ],
};

function toEditorContent(content: string | object | undefined | null): object | null {
  if (!content) return null;
  if (typeof content === "object") return content as object;
  if (typeof content === "string" && content.trim()) {
    return {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: content }] }],
    };
  }
  return null;
}

// ── 메인 컴포넌트 ──────────────────────────────────────────

export default function CardNewsPaperManager() {
  const [cardNewsList, setCardNewsList] = useState<CardNewsSummary[]>([]);
  const [selectedCn, setSelectedCn] = useState<CardNewsSummary | null>(null);
  const [papers, setPapers] = useState<StoredPaper[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPaperId, setEditingPaperId] = useState<string | null>(null);
  const [form, setForm] = useState<PaperFormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCardNewsList().then(setCardNewsList);
  }, []);

  async function loadPapers(cardNewsId: string) {
    setPapers(await getPapersForCardNews(cardNewsId));
  }

  function selectCard(cn: CardNewsSummary) {
    setSelectedCn(cn);
    setShowForm(false);
    setEditingPaperId(null);
    loadPapers(cn.id);
  }

  function startAdd() {
    setShowForm(true);
    setEditingPaperId(null);
    setForm({ ...EMPTY_FORM, order: papers.length + 1 });
  }

  function startEdit(paper: StoredPaper) {
    setShowForm(true);
    setEditingPaperId(paper.id);
    setForm({
      order: paper.order,
      type: paper.type,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      year: paper.year,
      url: paper.url,
      summary: paper.summary.map((sec) => ({
        heading: sec.heading,
        content: toEditorContent(sec.content),
      })),
    });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingPaperId(null);
  }

  async function handleSave() {
    if (!form.title.trim()) { alert("제목은 필수입니다."); return; }
    if (!selectedCn) return;
    setSaving(true);
    try {
      const paperData = {
        order: form.order,
        type: form.type,
        title: form.title,
        authors: form.authors,
        journal: form.journal,
        year: form.year,
        url: form.url,
        summary: form.summary.map((sec) => ({
          heading: sec.heading,
          content: sec.content ?? {},
        })),
      };

      if (editingPaperId) {
        await updatePaperInCardNews(selectedCn.id, editingPaperId, paperData);
      } else {
        await addPaperToCardNews(selectedCn.id, paperData);
      }
      await loadPapers(selectedCn.id);
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(paperId: string) {
    if (!selectedCn || !confirm("이 논문을 삭제할까요?")) return;
    await deletePaperFromCardNews(selectedCn.id, paperId);
    await loadPapers(selectedCn.id);
  }

  function updateField<K extends keyof PaperFormData>(key: K, value: PaperFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // ── 카드뉴스 선택 뷰 ─────────────────────────────────────

  if (!selectedCn) {
    return (
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2 className={s.sectionTitle}>논문 관리</h2>
          <p className={s.hint}>논문을 추가할 카드뉴스를 선택하세요</p>
        </div>
        {cardNewsList.length === 0 ? (
          <p className={s.empty}>등록된 카드뉴스가 없습니다.</p>
        ) : (
          <div className={s.cardGrid}>
            {cardNewsList.map((cn) => (
              <article key={cn.id} className={s.selectCard} onClick={() => selectCard(cn)}>
                <div className={s.selectCardThumb}>
                  {cn.thumbnail
                    ? <img src={cn.thumbnail} alt={cn.title} />
                    : <div className={s.thumbBlank} />}
                  <span className={[s.publishBadge, cn.published ? s.public : s.draft].join(" ")}>
                    {cn.published ? "공개" : "비공개"}
                  </span>
                </div>
                <div className={s.selectCardBody}>
                  <span className={s.cardCategory}>{cn.category}</span>
                  <p className={s.cardTitle}>{cn.title}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── 논문 폼 뷰 (스텝) ─────────────────────────────────────

  if (showForm) {
    return (
      <PaperForm
        form={form}
        onUpdate={updateField}
        editingPaperId={editingPaperId}
        selectedCn={selectedCn}
        saving={saving}
        onCancel={cancelForm}
        onSave={handleSave}
      />
    );
  }

  // ── 논문 목록 뷰 ─────────────────────────────────────────

  return (
    <div className={s.section}>
      <div className={s.backRow}>
        <button type="button" className={s.backBtn} onClick={() => setSelectedCn(null)}>
          <ArrowLeft size={15} /> 다른 카드뉴스 선택
        </button>
      </div>

      <div className={s.selectedCnCard}>
        {selectedCn.thumbnail && (
          <img src={selectedCn.thumbnail} alt={selectedCn.title} className={s.selectedThumb} />
        )}
        <div>
          <span className={s.cardCategory}>{selectedCn.category}</span>
          <p className={s.selectedTitle}>{selectedCn.title}</p>
        </div>
        <Check size={18} className={s.checkIcon} />
      </div>

      <div className={s.paperListSection}>
        <h3 className={s.paperListTitle}>논문 목록 ({papers.length})</h3>

        {papers.length === 0 && <p className={s.noPapers}>등록된 논문이 없습니다.</p>}

        {papers.map((paper) => (
          <div key={paper.id} className={s.paperRow}>
            <div className={s.paperLeft}>
              <div className={s.paperTextInfo}>
                <div className={s.paperTitleRow}>
                  <span className={s.typeBadge}>{paper.type}</span>
                  <span className={s.paperTitle}>{paper.title}</span>
                </div>
                <span className={s.paperMeta}>
                  {[paper.authors, String(paper.year), paper.journal].filter(Boolean).join(" · ")}
                </span>
              </div>
            </div>
            <div className={s.paperBtns}>
              <button type="button" className={s.editBtn} onClick={() => startEdit(paper)}>
                <Edit2 size={13} />
              </button>
              <button type="button" className={s.removeBtn} onClick={() => handleDelete(paper.id)}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        <button type="button" className={s.addBtn} onClick={startAdd}>
          <Plus size={14} /> 논문 추가하기
        </button>
      </div>
    </div>
  );
}

// ── 논문 폼 (2단계 스텝) ───────────────────────────────────

interface PaperFormProps {
  form: PaperFormData;
  onUpdate: <K extends keyof PaperFormData>(key: K, value: PaperFormData[K]) => void;
  editingPaperId: string | null;
  selectedCn: CardNewsSummary;
  saving: boolean;
  onCancel: () => void;
  onSave: () => void;
}

function PaperForm({ form, onUpdate, editingPaperId, selectedCn, saving, onCancel, onSave }: PaperFormProps) {
  const [step, setStep] = useState(1);
  const [activeSummaryIdx, setActiveSummaryIdx] = useState(0);

  function addSummary() {
    const newSummary = [...form.summary, { heading: "새 섹션", content: null }];
    onUpdate("summary", newSummary);
    setActiveSummaryIdx(newSummary.length - 1);
  }

  function removeSummary(i: number) {
    if (form.summary.length <= 1) return;
    const newSummary = form.summary.filter((_, idx) => idx !== i);
    onUpdate("summary", newSummary);
    setActiveSummaryIdx(Math.min(activeSummaryIdx, newSummary.length - 1));
  }

  function updateHeading(i: number, value: string) {
    onUpdate(
      "summary",
      form.summary.map((item, idx) => idx === i ? { ...item, heading: value } : item)
    );
  }

  function updateContent(i: number, value: object) {
    onUpdate(
      "summary",
      form.summary.map((item, idx) => idx === i ? { ...item, content: value } : item)
    );
  }

  const activeSection = form.summary[activeSummaryIdx];

  // ── Step 1: 기본 정보 ─────────────────────────────────────

  if (step === 1) {
    return (
      <div className={s.stepWrapper}>
        <div className={s.stepHeader}>
          <button type="button" className={s.backBtn} onClick={onCancel}>
            <ArrowLeft size={15} /> 목록으로
          </button>
          <div className={s.stepIndicator}>
            <span className={s.stepDot} data-active="true" />
            <span className={s.stepLine} />
            <span className={s.stepDot} />
          </div>
          <span className={s.stepLabel}>1단계 · 기본 정보</span>
        </div>

        {/* 연결된 카드뉴스 */}
        <div className={s.cnInfoCard}>
          {selectedCn.thumbnail && (
            <img src={selectedCn.thumbnail} alt={selectedCn.title} className={s.cnThumb} />
          )}
          <div className={s.cnInfoText}>
            <span className={s.cnInfoLabel}>연결된 카드뉴스</span>
            <p className={s.cnInfoTitle}>{selectedCn.title}</p>
            <span className={s.cnCategory}>{selectedCn.category}</span>
          </div>
        </div>

        {/* 기본 정보 폼 */}
        <div className={s.formCard}>
          <h3 className={s.formCardTitle}>{editingPaperId ? "논문 수정" : "논문 추가"}</h3>

          <div className={s.field}>
            <label className={s.label}>논문 제목 *</label>
            <input className={s.input} value={form.title} onChange={(e) => onUpdate("title", e.target.value)} placeholder="논문 제목을 입력하세요" />
          </div>

          <div className={s.field}>
            <label className={s.label}>저자</label>
            <input className={s.input} value={form.authors} onChange={(e) => onUpdate("authors", e.target.value)} placeholder="저자명" />
          </div>

          <div className={s.twoCol}>
            <div className={s.field}>
              <label className={s.label}>저널/출처</label>
              <input className={s.input} value={form.journal} onChange={(e) => onUpdate("journal", e.target.value)} placeholder="저널명" />
            </div>
            <div className={s.field}>
              <label className={s.label}>연도</label>
              <input className={s.input} type="number" value={form.year} onChange={(e) => onUpdate("year", Number(e.target.value))} />
            </div>
          </div>

          <div className={s.twoCol}>
            <div className={s.field}>
              <label className={s.label}>원문 링크</label>
              <input className={s.input} value={form.url} onChange={(e) => onUpdate("url", e.target.value)} placeholder="https://..." />
            </div>
            <div className={s.field}>
              <label className={s.label}>순서</label>
              <input className={s.input} type="number" min={1} value={form.order} onChange={(e) => onUpdate("order", Number(e.target.value))} />
            </div>
          </div>

          <div className={s.field}>
            <label className={s.label}>논문 유형</label>
            <div className={s.typeGroup}>
              {PAPER_TYPES.map((type) => (
                <button key={type} type="button"
                  className={[s.typeBtn, form.type === type ? s.selected : ""].join(" ")}
                  onClick={() => onUpdate("type", type)}>
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={s.stepActions}>
          <button type="button" className={s.cancelBtn} onClick={onCancel}>취소</button>
          <button type="button" className={s.nextBtn} onClick={() => setStep(2)}>
            다음 · 섹션 작성 →
          </button>
        </div>
      </div>
    );
  }

  // ── Step 2: 섹션 작성 ─────────────────────────────────────

  return (
    <div className={s.stepWrapper}>
      <div className={s.stepHeader}>
        <button type="button" className={s.backBtn} onClick={() => setStep(1)}>
          <ArrowLeft size={15} /> 이전
        </button>
        <div className={s.stepIndicator}>
          <span className={s.stepDot} />
          <span className={s.stepLine} />
          <span className={s.stepDot} data-active="true" />
        </div>
        <span className={s.stepLabel}>2단계 · 섹션 작성</span>
      </div>

      {/* 섹션 탭 */}
      <div className={s.sectionTabBar}>
        {form.summary.map((item, i) => (
          <button
            key={i}
            type="button"
            className={[s.sectionTab, activeSummaryIdx === i ? s.sectionTabActive : ""].join(" ")}
            onClick={() => setActiveSummaryIdx(i)}
          >
            {item.heading || `섹션 ${i + 1}`}
            {form.summary.length > 1 && (
              <span
                className={s.removeTabBtn}
                onClick={(e) => { e.stopPropagation(); removeSummary(i); }}
              >
                <X size={10} />
              </span>
            )}
          </button>
        ))}
        <button type="button" className={s.addTabBtn} onClick={addSummary}>
          <Plus size={13} /> 섹션 추가
        </button>
      </div>

      {/* 에디터 영역 */}
      {activeSection && (
        <div className={s.editorArea}>
          <input
            className={s.sectionHeadingInput}
            value={activeSection.heading}
            onChange={(e) => updateHeading(activeSummaryIdx, e.target.value)}
            placeholder="섹션 제목"
          />
          <ContentEditor
            key={activeSummaryIdx}
            terms={[]}
            initialContent={activeSection.content ?? undefined}
            onChange={(v) => updateContent(activeSummaryIdx, v)}
          />
        </div>
      )}

      <div className={s.stepActions}>
        <button type="button" className={s.cancelBtn} onClick={onCancel}>취소</button>
        <button type="button" className={s.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? "저장 중..." : editingPaperId ? "수정 완료" : "저장"}
        </button>
      </div>
    </div>
  );
}
