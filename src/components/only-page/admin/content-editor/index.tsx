import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, ImageIcon, Tag } from "lucide-react";
import { useRef, useState } from "react";

import { uploadImage } from "@/api/storage";
import type { TermInput } from "@/types/admin";
import { TermMark } from "./TermMark";

import s from "./styles.module.scss";

interface ContentEditorProps {
  terms: TermInput[];
  onChange: (json: object) => void;
}

export default function ContentEditor({ terms, onChange }: ContentEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [termDropdownOpen, setTermDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: "본문을 작성하세요..." }),
      TermMark,
    ],
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, `content/${Date.now()}_${file.name}`);
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function applyTerm(term: TermInput) {
    if (!editor) return;
    editor.chain().focus().setTermMark({ word: term.word, description: term.description }).run();
    setTermDropdownOpen(false);
  }

  if (!editor) return null;

  return (
    <div className={s.wrapper}>
      <div className={s.toolbar}>
        <button
          type="button"
          className={[s.toolBtn, editor.isActive("bold") ? s.active : ""].join(" ")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="굵게"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          className={[s.toolBtn, editor.isActive("italic") ? s.active : ""].join(" ")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="기울임"
        >
          <Italic size={16} />
        </button>
        <div className={s.divider} />
        <button
          type="button"
          className={[s.toolBtn, editor.isActive("bulletList") ? s.active : ""].join(" ")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="글머리 기호"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          className={[s.toolBtn, editor.isActive("orderedList") ? s.active : ""].join(" ")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="번호 목록"
        >
          <ListOrdered size={16} />
        </button>
        <div className={s.divider} />
        <button
          type="button"
          className={s.toolBtn}
          onClick={() => fileInputRef.current?.click()}
          title="이미지 삽입"
          disabled={uploading}
        >
          <ImageIcon size={16} />
          {uploading && <span className={s.uploading}>업로드 중...</span>}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className={s.hidden} onChange={handleImageUpload} />

        <div className={s.termDropdownWrapper}>
          <button
            type="button"
            className={s.toolBtn}
            onClick={() => setTermDropdownOpen((v) => !v)}
            title="용어 지정"
            disabled={terms.length === 0}
          >
            <Tag size={16} />
            <span className={s.toolLabel}>용어 지정</span>
          </button>
          {termDropdownOpen && terms.length > 0 && (
            <div className={s.termDropdown}>
              {terms.map((term) => (
                <button
                  key={term.word}
                  type="button"
                  className={s.termItem}
                  onClick={() => applyTerm(term)}
                >
                  <span className={s.termWord}>{term.word}</span>
                  <span className={s.termDesc}>{term.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className={s.toolBtn}
          onClick={() => editor.chain().focus().unsetTermMark().run()}
          title="용어 지정 해제"
          disabled={!editor.isActive("termMark")}
        >
          <span className={s.toolLabel}>용어 해제</span>
        </button>
      </div>

      <EditorContent editor={editor} className={s.editor} />
    </div>
  );
}
