import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    termMark: {
      setTermMark: (attrs: { word: string; description: string }) => ReturnType;
      unsetTermMark: () => ReturnType;
    };
  }
}

export const TermMark = Mark.create({
  name: "termMark",

  addAttributes() {
    return {
      word: { default: null },
      description: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "mark[data-word]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mark",
      mergeAttributes({
        "data-word": HTMLAttributes.word,
        "data-description": HTMLAttributes.description,
        class: "term-mark",
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setTermMark:
        (attrs) =>
        ({ commands }) =>
          commands.setMark(this.name, attrs),
      unsetTermMark:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    };
  },
});
