import { useState } from "react";
import { Plus, X } from "lucide-react";

import type { TermInput } from "@/types/admin";

import s from "./styles.module.scss";

interface TermManagerProps {
  terms: TermInput[];
  onChange: (terms: TermInput[]) => void;
}

export default function TermManager({ terms, onChange }: TermManagerProps) {
  const [word, setWord] = useState("");
  const [description, setDescription] = useState("");

  function addTerm() {
    if (!word.trim() || !description.trim()) return;
    if (terms.some((t) => t.word === word.trim())) return;
    onChange([...terms, { word: word.trim(), description: description.trim() }]);
    setWord("");
    setDescription("");
  }

  function removeTerm(index: number) {
    onChange(terms.filter((_, i) => i !== index));
  }

  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>전문 용어</h2>

      <div className={s.inputRow}>
        <input
          className={s.input}
          placeholder="용어명"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <input
          className={[s.input, s.descInput].join(" ")}
          placeholder="설명 (hover 시 툴팁으로 표시)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTerm()}
        />
        <button type="button" className={s.addBtn} onClick={addTerm}>
          <Plus size={16} /> 추가
        </button>
      </div>

      {terms.length > 0 && (
        <ul className={s.termList}>
          {terms.map((term, i) => (
            <li key={i} className={s.termItem}>
              <span className={s.termWord}>{term.word}</span>
              <span className={s.termDesc}>{term.description}</span>
              <button type="button" className={s.removeBtn} onClick={() => removeTerm(i)}>
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
