import { Instagram } from "lucide-react";
import s from "./styles.module.scss";

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.brand}>
          <span className={s.logo}>ZKDeck</span>
          <p className={s.tagline}>
            Zero-Knowledge, 전체를 몰라도 핵심을 아는 것<br />
            논문의 본질을 카드 한 장으로.
          </p>
        </div>
        <div className={s.links}>
          <a
            href="https://www.instagram.com/ts.zkdeck/"
            target="_blank"
            rel="noopener noreferrer"
            className={s.instagram}
          >
            <Instagram size={18} />
            <span>@ts.zkdeck</span>
          </a>
        </div>
      </div>
      <p className={s.copyright}>© 2025 ZKDeck. All rights reserved.</p>
    </footer>
  );
}
