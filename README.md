# TS ZK Lab

정보보안 분야의 최신 논문과 트렌드를 카드뉴스 형식으로 소개하는 웹 서비스입니다.

## 주요 기능

- **카드뉴스** — 슬라이드 형식으로 보안 주제를 쉽게 읽을 수 있는 카드뉴스
- **논문 아카이브** — 각 카드뉴스와 연결된 근본/발전/트렌드/한계 논문 목록
- **논문 상세** — 서론/본론/결론으로 구조화된 논문 요약
- **검색** — 카드뉴스 및 논문 통합 검색
- **찜하기** — Google 계정 기반 북마크 (기기 간 동기화)
- **어드민** — 게시물 작성/수정/삭제, 게시 여부 관리

## 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router v7 |
| Styling | SCSS Modules + Design Tokens |
| Editor | Tiptap |
| Auth / DB | Firebase Authentication, Firestore |
| Storage | Cloudflare R2 + Workers |
| Deployment | Vercel |

## 로컬 실행

```bash
npm install
npm run dev
```

`.env.local` 파일을 만들어 아래 값을 설정해야 합니다.

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_UID=
VITE_UPLOAD_WORKER_URL=
VITE_ADMIN_TOKEN=
```

## Firestore 보안 규칙

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cardNews/{id} {
      allow read: if true;
      allow write: if request.auth.uid == "<ADMIN_UID>";
      match /papers/{paperId} {
        allow read: if true;
        allow write: if request.auth.uid == "<ADMIN_UID>";
      }
    }
    match /users/{uid}/data/{docId} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

## 프로젝트 구조

```
src/
├── api/          # Firebase, Firestore, 이미지 업로드
├── components/   # 공통 UI 및 페이지별 컴포넌트
├── contexts/     # Auth, Bookmarks Context
├── mocks/        # 초기 목데이터
├── pages/        # 라우트 페이지
├── styles/       # 전역 SCSS 변수/토큰
└── types/        # 공통 TypeScript 타입
```
