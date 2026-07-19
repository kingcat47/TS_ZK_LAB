import { useEffect, useState } from "react";
import s from "./styles.module.scss";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isDismissed]);

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!isVisible) return null;

  return (
    <div className={s.banner}>
      <img src="/HomeIcon.png" alt="ZKDeck" className={s.icon} />
      <div className={s.text}>
        <span className={s.title}>ZKDeck 앱 설치</span>
        <span className={s.desc}>홈 화면에 추가하고 빠르게 접근하세요</span>
      </div>
      <div className={s.actions}>
        <button className={s.installBtn} onClick={handleInstall}>설치</button>
        <button className={s.dismissBtn} onClick={handleDismiss}>닫기</button>
      </div>
    </div>
  );
}
