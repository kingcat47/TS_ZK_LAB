import { useState, useCallback } from "react";
import type { ReactNode } from "react";

import { ToastContext } from "./ToastContext";
import s from "./toast.module.scss";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && (
        <div className={s.toast} role="alert">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
