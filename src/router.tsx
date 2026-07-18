import { createBrowserRouter } from "react-router-dom";

import { Home, LoginPage, CardNewsDetail } from "@/pages";
import { RootLayout } from "@/components/layout";

const Router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/card-news/:id", element: <CardNewsDetail /> },
    ],
  },
  {
    path: "/auth/login",
    element: <LoginPage />,
  },
]);

export default Router;
