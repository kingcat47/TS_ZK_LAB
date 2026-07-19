import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import type { PaperSummarySection } from "@/types/paper";
import { ResizableImage } from "@/components/only-page/admin/content-editor/ResizableImageExtension";
import { TermMark } from "@/components/only-page/admin/content-editor/TermMark";

import s from "./styles.module.scss";

interface PaperSummaryProps {
  sections: PaperSummarySection[];
}

function SectionContent({ content }: { content: string | object }) {
  const editor = useEditor({
    extensions: [StarterKit, ResizableImage, TermMark],
    content: typeof content === "object" ? content : undefined,
    editable: false,
  });

  if (typeof content === "string") {
    return <p className={s.content}>{content}</p>;
  }

  return <EditorContent editor={editor} className={s.content} />;
}

export default function PaperSummary({ sections }: PaperSummaryProps) {
  return (
    <div className={s.wrapper}>
      {sections.map((section, i) => (
        <div key={i} className={s.section}>
          <h3 className={s.heading}>{section.heading}</h3>
          <SectionContent content={section.content} />
        </div>
      ))}
    </div>
  );
}
