import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImageView } from "./ResizableImageView";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attrs) => (attrs.width ? { width: String(attrs.width) } : {}),
        parseHTML: (el) => {
          const w = el.getAttribute("width");
          return w ? parseInt(w, 10) : null;
        },
      },
      align: {
        default: "left",
        renderHTML: (attrs) => ({ "data-align": attrs.align ?? "left" }),
        parseHTML: (el) => el.getAttribute("data-align") ?? "left",
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
}).configure({ inline: false });
