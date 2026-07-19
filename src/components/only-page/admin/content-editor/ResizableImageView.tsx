import { useRef, useCallback } from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

export function ResizableImageView({ node, updateAttributes, selected }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      startX.current = e.clientX;
      startWidth.current = imgRef.current?.offsetWidth ?? 300;

      function onMouseMove(ev: MouseEvent) {
        const newWidth = Math.max(80, startWidth.current + ev.clientX - startX.current);
        if (imgRef.current) {
          imgRef.current.style.width = `${newWidth}px`;
        }
      }

      function onMouseUp(ev: MouseEvent) {
        const newWidth = Math.max(80, startWidth.current + ev.clientX - startX.current);
        updateAttributes({ width: newWidth });
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateAttributes]
  );

  const width = node.attrs.width;
  const align = node.attrs.align ?? "left";

  return (
    <NodeViewWrapper style={{ display: "block", textAlign: align }}>
      <div
        style={{
          display: "inline-block",
          position: "relative",
          maxWidth: "100%",
          lineHeight: 0,
        }}
      >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt ?? ""}
        style={{
          width: width ? `${width}px` : "100%",
          maxWidth: "100%",
          display: "block",
          borderRadius: "8px",
          outline: selected ? "2px solid #45C1FF" : "none",
          outlineOffset: "2px",
        }}
        draggable={false}
      />
      {selected && (
        <>
          <div
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 4,
              background: "rgba(0,0,0,0.6)",
              borderRadius: 6,
              padding: "3px 6px",
            }}
          >
            {([
              { value: "left", icon: <AlignLeft size={13} /> },
              { value: "center", icon: <AlignCenter size={13} /> },
              { value: "right", icon: <AlignRight size={13} /> },
            ] as const).map(({ value, icon }) => (
              <button
                key={value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateAttributes({ align: value });
                }}
                style={{
                  background: align === value ? "#45C1FF" : "transparent",
                  border: "none",
                  borderRadius: 4,
                  color: "#fff",
                  cursor: "pointer",
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
          <div
            onMouseDown={onMouseDown}
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              width: 14,
              height: 14,
              backgroundColor: "#45C1FF",
              border: "2px solid #fff",
              borderRadius: "3px",
              cursor: "se-resize",
            }}
          />
        </>
      )}
      </div>
    </NodeViewWrapper>
  );
}
