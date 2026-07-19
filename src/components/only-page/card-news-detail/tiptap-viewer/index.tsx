import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TermMark } from "@/components/only-page/admin/content-editor/TermMark";

import s from "./styles.module.scss";

interface TiptapViewerProps {
  content: object;
}

export default function TiptapViewer({ content }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image, TermMark],
    content,
    editable: false,
  });

  if (!editor) return null;

  return (
    <section className={s.section}>
      <h2 className={s.title}>내용 설명</h2>
      <EditorContent editor={editor} className={s.body} />
    </section>
  );
}
