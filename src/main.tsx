import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { AuthProvider } from "@/contexts/auth/AuthProvider";
import { BookmarksProvider } from "@/contexts/bookmarks/BookmarksProvider";
import { ToastProvider } from "@/contexts/toast/ToastProvider";
import "@/styles/globals.scss";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BookmarksProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </BookmarksProvider>
    </AuthProvider>
  </StrictMode>,
);
