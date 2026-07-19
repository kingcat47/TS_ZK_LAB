import { Outlet } from "react-router-dom";

import Header from "@/components/ui/header";
import PWAInstallPrompt from "@/components/ui/pwa-install-prompt";

export default function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <PWAInstallPrompt />
    </>
  );
}
