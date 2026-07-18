# React Default Template

내가 쓰려고 만든 템플릿.

## 사용 방법

```bash
# 1. 템플릿으로 프로젝트 생성
npx degit kingcat47/React_default-template .

# 2. 패키지 설치
npm install

# 3. .env 설정
cp .env.example .env

# 4. Git 초기화 및 원격 저장소 연결
git init
git remote add origin repo_url
git add .
git commit -m "Initial commit from template"
git push -u origin main
```

## 기술 스택

- React 19 + TypeScript
- Vite
- SCSS Modules (variables.scss 전역 자동 주입)
- React Router DOM v7
- ESLint

## 폴더 구조

```
src/
├── assets/         # 이미지, 아이콘 등 정적 파일
├── components/
│   ├── auth/       # 로그인 관련 컴포넌트
│   ├── layout/     # 레이아웃 컴포넌트
│   └── ui/         # 공용 UI 컴포넌트
├── hooks/          # 커스텀 훅
├── pages/          # 페이지 컴포넌트
├── styles/         # 전역 스타일
├── types/          # 타입 정의
├── utils/          # 유틸리티 함수
└── router.tsx      # 라우터 설정
```

## 라우터 구조

Header가 필요한 일반 페이지는 `children` 안에, 로그인처럼 Header 없는 페이지는 바깥에 추가.

```tsx
const Router = createBrowserRouter([
  {
    element: <RootLayout />,   // Header 포함
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
    ],
  },
  {
    path: "/auth/login",       // Header 없는 페이지
    element: <LoginPage />,
  },
]);
```

## UI 컴포넌트

```tsx
import { Button, Checkbox, Header, Input, Spacing, HStack, VStack, Typo } from "@/components/ui";
```

| 컴포넌트 | 설명 |
|---|---|
| `Button` | size(large/medium), variant(primary/secondary/tertiary), pending 스피너 |
| `Input` | label, size, variant, error 메시지, 좌우 아이콘 |
| `Checkbox` | controlled/uncontrolled, indeterminate, label/description/error |
| `Typo` | Display / Headline / BodyLarge / Body / Subtext / Caption |
| `HStack` / `VStack` | flex 레이아웃, align/justify/gap prop |
| `Spacing` | 수직/수평 여백 컴포넌트 |
| `Header` | 로고 + 네비게이션 + 로그인 버튼 |
| `MainLayout` | 최대 너비 1200px 컨텐츠 래퍼 |

## 레이아웃

```tsx
import { RootLayout, MainLayout, Authlayout } from "@/components/layout";
```

- `RootLayout` — 앱 전체를 감싸는 최상위 레이아웃 (Header 포함)
- `MainLayout` — 일반 페이지용 컨텐츠 래퍼
- `Authlayout` — 로그인 등 인증 페이지용 레이아웃

## 로그인 컴포넌트 (LoginModal)

SNS 로그인 버튼과 전화번호 로그인 링크를 포함한 로그인 UI 컴포넌트.

```tsx
import LoginModal from "@/components/auth";

<LoginModal providers={["google", "kakao", "naver"]} showPhoneLogin />
```

| prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| providers | `("google" \| "kakao" \| "naver")[]` | `["google", "kakao", "naver"]` | 표시할 SNS 로그인 버튼 |
| showPhoneLogin | `boolean` | `false` | 전화번호 로그인 링크 표시 여부 |

```tsx
// 구글만 + 전화번호 링크 포함
<LoginModal providers={["google"]} showPhoneLogin />

// 국내용 (카카오 + 네이버)
<LoginModal providers={["kakao", "naver"]} />
```

## 경로 별칭

`@/`는 `src/`를 가리킵니다.

```tsx
import { Button } from "@/components/ui";
```
