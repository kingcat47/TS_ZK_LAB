import { Button, Spacing, Typo } from "@/components/ui";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { signInWithGoogle } from "@/api/auth";
import s from "./styles.module.scss";

export type SnsProvider = "google" | "kakao" | "naver";

interface LoginModalProps {
  providers?: SnsProvider[];
  showPhoneLogin?: boolean;
}

const providerConfig: Record<
  SnsProvider,
  { icon: string; label: string; className: string }
> = {
  google: { icon: "/google.svg", label: "구글로 시작하기", className: s.google_button },
  kakao: { icon: "/kakao.svg", label: "카카오톡으로 시작하기", className: s.kakao_button },
  naver: { icon: "/naver.svg", label: "네이버로 시작하기", className: s.naver_button },
};

const providerHandlers: Record<SnsProvider, () => Promise<void>> = {
  google: async () => {
    await signInWithGoogle();
  },
  kakao: async () => { console.log("kakao login - 미구현"); },
  naver: async () => { console.log("naver login - 미구현"); },
};

export default function LoginModal({ providers = ["google", "kakao", "naver"], showPhoneLogin = false }: LoginModalProps) {
  const navigate = useNavigate();

  async function handleLogin(provider: SnsProvider) {
    await providerHandlers[provider]();
    navigate("/");
  }

  return (
    <>
      <div className={s.container}>
        <img src="/logo.svg" alt="logo" width="180" height="58" />
        <Spacing size={12} />
        <div className={s.login_container}>
        </div>
        {providers.map((provider) => {
          const { icon, label, className } = providerConfig[provider];
          return (
            <Button
              key={provider}
              size="large"
              variant="secondary"
              fullWidth
              className={className}
              leadingIcon={
                <img src={icon} alt={provider} style={{ width: "20px", height: "20px" }} />
              }
              onClick={() => handleLogin(provider)}
            >
              {label}
            </Button>
          );
        })}

        </div>
        {showPhoneLogin && (
          <>
            <Spacing size={8} />
            <Link to="/auth/login" className={s.number_container}>
              <Typo.BodyLarge>전화번호로 시작하기</Typo.BodyLarge> <ChevronRight size={21} />
            </Link>
          </>
        )}
      </>
  );
}