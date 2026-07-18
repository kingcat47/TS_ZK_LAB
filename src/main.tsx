import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "@/router";
import { AuthProvider } from "@/contexts/AuthProvider";
import { BookmarksProvider } from "@/contexts/BookmarksProvider";
import "@/styles/globals.scss";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <BookmarksProvider>
        <RouterProvider router={router} />
      </BookmarksProvider>
    </AuthProvider>
  </StrictMode>,
);
