import { createBrowserRouter } from "react-router-dom";

import { Home, LoginPage, CardNewsDetail, PaperList, PaperDetail } from "@/pages";
import { RootLayout } from "@/components/layout";

const Router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/card-news/:id", element: <CardNewsDetail /> },
      { path: "/card-news/:id/papers", element: <PaperList /> },
      { path: "/card-news/:id/papers/:paperId", element: <PaperDetail /> },
    ],
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);

export default Router;
