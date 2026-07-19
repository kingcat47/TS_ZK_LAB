import { useRef, useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { saveCardNews, updateCardNews, getCardNewsForEdit } from "@/api/firestore";
import type { CardNewsFormData, Category, PaperInput } from "@/types/admin";

import BasicInfoForm from "@/components/only-page/admin/basic-info-form";
import SlideUploader from "@/components/only-page/admin/slide-uploader";
import TermManager from "@/components/only-page/admin/term-manager";
import ContentEditor from "@/components/only-page/admin/content-editor";
import PaperManager from "@/components/only-page/admin/paper-manager";
import PostList from "@/components/only-page/admin/post-list";

import s from "./styles/admin.module.scss";

const ADMIN_UID = import.meta.env.VITE_ADMIN_UID as string | undefined;

const INITIAL_FORM: CardNewsFormData = {
  title: "",
  category: "",
  tags: [],
  published: false,
  thumbnail: null,
  thumbnailPreview: "",
  existingThumbnailUrl: "",
  slides: [],
  terms: [],
  content: null,
  papers: [],
};

export default function Admin() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState<CardNewsFormData>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const formRef = useRef<HTMLDivElement>(null);

  if (loading) return null;
  if (!user) return <Navigate to="/auth/login" replace />;
  if (ADMIN_UID && user.uid !== ADMIN_UID) {
    return (
      <div className={s.accessDenied}>
        <span>접근 권한이 없습니다.</span>
      </div>
    );
  }

  function update<K extends keyof CardNewsFormData>(key: K, value: CardNewsFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleEdit(id: string) {
    const data = await getCardNewsForEdit(id);
    if (!data) return;

    setForm({
      title: data.title,
      category: data.category as Category,
      tags: data.tags,
      published: data.published,
      thumbnail: null,
      thumbnailPreview: data.thumbnail,
      existingThumbnailUrl: data.thumbnail,
      slides: data.slides.map((url: string) => ({ preview: url, existingUrl: url })),
      terms: data.terms,
      content: data.content,
      papers: data.papers as PaperInput[],
    });
    setEditingId(id);
    setStatus("idle");
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setStatus("idle");
  }

  async function handleSubmit(published: boolean) {
    if (!form.title.trim() || !form.category) {
      alert("제목과 카테고리는 필수입니다.");
      return;
    }
    setSubmitting(true);
    setStatus("idle");
    try {
      if (editingId) {
        await updateCardNews(editingId, { ...form, published });
      } else {
        await saveCardNews({ ...form, published });
      }
      setStatus("success");
      setForm(INITIAL_FORM);
      setEditingId(null);
    } catch (e) {
      console.error(e);
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={s.page}>
      <div className={s.container}>
        <div className={s.pageHeader}>
          <h1 className={s.pageTitle}>
            {editingId ? "카드뉴스 수정" : "카드뉴스 작성"}
          </h1>
          <div className={s.submitRow}>
            {editingId && (
              <button type="button" className={s.saveDraftBtn} onClick={handleCancelEdit} disabled={submitting}>
                취소
              </button>
            )}
            <button
              type="button"
              className={s.saveDraftBtn}
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              임시저장
            </button>
            <button
              type="button"
              className={s.publishBtn}
              onClick={() => handleSubmit(true)}
              disabled={submitting}
            >
              {submitting ? "저장 중..." : editingId ? "수정 완료" : "게시하기"}
            </button>
          </div>
        </div>

        {status === "success" && (
          <div className={s.successBanner}>
            {editingId ? "게시물이 수정되었습니다." : "게시물이 성공적으로 저장되었습니다."}
          </div>
        )}
        {status === "error" && (
          <div className={s.errorBanner}>저장 중 오류가 발생했습니다. 다시 시도해주세요.</div>
        )}

        <div className={s.card}>
          <PostList onEdit={handleEdit} />
        </div>

        <div ref={formRef} className={s.card}>
          <BasicInfoForm
            title={form.title}
            category={form.category as Category | ""}
            tags={form.tags}
            published={form.published}
            onTitleChange={(v) => update("title", v)}
            onCategoryChange={(v) => update("category", v)}
            onTagsChange={(v) => update("tags", v)}
            onPublishedChange={(v) => update("published", v)}
          />
        </div>

        <div className={s.card}>
          <SlideUploader
            thumbnail={form.thumbnail}
            thumbnailPreview={form.thumbnailPreview}
            slides={form.slides}
            onThumbnailChange={(file, preview) =>
              setForm((prev) => ({ ...prev, thumbnail: file, thumbnailPreview: preview }))
            }
            onSlidesChange={(v) => update("slides", v)}
          />
        </div>

        <div className={s.card}>
          <TermManager terms={form.terms} onChange={(v) => update("terms", v)} />
        </div>

        <div className={s.card}>
          <ContentEditor
            terms={form.terms}
            initialContent={form.content}
            onChange={(v) => update("content", v)}
          />
        </div>

        <div className={s.card}>
          <PaperManager papers={form.papers} onChange={(v) => update("papers", v)} />
        </div>
      </div>
    </div>
  );
}
