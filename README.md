# TaskFlow

**칸반(Kanban) 보드 기반의 투두리스트** 웹 애플리케이션입니다.
게시판(Board) → 리스트(List) → 일(Task)의 계층 구조로 할 일을 시각적으로 관리하고,
모든 활동을 기록(Activity Log)하며, Google 계정으로 로그인할 수 있습니다.

> 학습용 프로젝트로, React 19 / Redux Toolkit / vanilla-extract / Firebase 등
> 최신 프론트엔드 스택을 직접 다뤄보는 것을 목표로 합니다.

🔗 **배포 주소**: https://trello-clone-b1b07.web.app (Firebase Hosting)




---

## 📌 주요 기능

### 게시판 (Board)
- 좌측 사이드바에서 여러 개의 게시판을 생성/전환/삭제
- `새로운 게시판 등록하기` 폼으로 게시판 추가
- 활성화된 게시판은 하이라이트되어 표시
- 게시판은 최소 1개가 유지되도록 보장 (마지막 1개는 삭제 불가)

### 리스트 (List)
- 게시판 내에 여러 리스트를 생성/삭제 (예: `해야 할 일`, `진행 중`, `완료`)
- `새로운 리스트 등록` 버튼으로 리스트 추가

### 일 / 카드 (Task)
- 리스트 내에 여러 개의 일(Task) 추가
- 카드 클릭 시 수정 모달(EditModal)이 열리며 **제목 / 설명 / 생성한 사람** 수정 가능
- 모달에서 일 수정 및 삭제
- **드래그 앤 드롭(Drag & Drop)** 으로 같은 리스트 내 순서 변경 및 다른 리스트로 이동
  (`@hello-pangea/dnd` 사용)

### 활동 기록 (Activity Logger)
- 게시판·리스트·일의 **생성/수정/삭제 모든 동작을 로그로 기록**
- `활동 목록 보이기` 버튼으로 활동 기록 모달 확인
- 각 로그는 작성자, 메시지, 상대 시간(`3m 20s ago`, `just now`)을 표시

### 인증 (Authentication)
- **Firebase Authentication** 기반 Google 소셜 로그인 (팝업 방식)
- 로그인/로그아웃 상태를 Redux로 관리 (`useAuth` 커스텀 훅)

---



## 📸 스크린샷


### 메인 화면
게시판 사이드바 · 리스트 · 일(카드)로 구성된 칸반 보드 전체 레이아웃
<img width="1728" height="891" alt="image" src="https://github.com/user-attachments/assets/aba0423c-6fb6-4e35-8ac8-a26385f34e12" />

### 일 드래그 앤 드롭
일(카드)을 끌어 같은 리스트 내 순서를 바꾸거나 다른 리스트로 이동
<img width="856" height="310" alt="Jun-21-2026 22-39-31" src="https://github.com/user-attachments/assets/9bee8cb9-76b0-4ee1-ba66-579b56261d9d" />

### 리스트 / 일 추가
`새로운 리스트 등록` · `새로운 일 등록` 드롭다운 입력 폼
</br>
<img width="277" height="304" alt="image" src="https://github.com/user-attachments/assets/67b90dd5-93e2-4f99-85b6-3bf225cc5f80" />
<img width="245" height="176" alt="image" src="https://github.com/user-attachments/assets/7ac1ce90-71b1-4aed-b0e4-9f7e110d9a8b" />



### 일 수정 모달
카드 클릭 시 열리는 제목 · 설명 · 생성한 사람 수정 및 삭제 모달
<img width="824" height="511" alt="image" src="https://github.com/user-attachments/assets/454fd1b6-f2df-4329-a562-7491965ae694" />


### 활동 기록
게시판·리스트·일의 생성/수정/삭제/이동 내역과 상대 시간 표시
<img width="825" height="526" alt="image" src="https://github.com/user-attachments/assets/72eb6c75-6427-45b7-8586-341756c27621" />

---

## 🛠 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Core** | React 19, TypeScript 5.9 |
| **Build** | Vite 8, React Compiler (babel-plugin-react-compiler) |
| **상태 관리** | Redux Toolkit, React-Redux |
| **스타일링** | vanilla-extract (CSS-in-TS, zero-runtime) |
| **백엔드 / 인증** | Firebase (Auth, Hosting) |
| **드래그 앤 드롭** | @hello-pangea/dnd (react-beautiful-dnd의 React 19 지원 포크) |
| **기타** | react-icons, clsx, uuid |
| **품질 / CI** | ESLint (typescript-eslint), GitHub Actions |

### 왜 이 스택인가
- **React Compiler**: 수동 메모이제이션 없이 자동 최적화 적용
- **vanilla-extract**: 타입 안전한 CSS를 런타임 비용 없이 작성 (`*.css.ts`)
- **Redux Toolkit**: 보드/리스트/일/모달/로그/유저 도메인을 slice로 분리

---

## 📁 프로젝트 구조

```
src/
├── App.tsx                  # 루트 컴포넌트 (보드 전환, 삭제, 로거 토글)
├── main.tsx                 # Redux Provider 마운트
├── firebase.ts              # Firebase 초기화
│
├── components/
│   ├── BoardList/           # 좌측 게시판 목록 + 로그인/로그아웃
│   │   └── SideForm/        # 게시판 추가 폼
│   ├── ListsContainer/      # 활성 게시판의 리스트들을 렌더
│   ├── List/                # 단일 리스트 (헤더, 일 목록, 삭제)
│   ├── Task/                # 단일 일(카드) UI
│   ├── ActionButton/        # 리스트/일 추가 버튼
│   │   └── DropDownForm/    # 리스트·일 입력 폼
│   ├── EditModal/           # 일 수정/삭제 모달
│   └── LoggerModal/         # 활동 기록 모달
│       └── LogItem/         # 개별 로그 항목
│
├── store/
│   ├── index.ts             # configureStore + RootState/AppDispatch 타입
│   ├── reducer/reducer.ts   # 루트 리듀서 결합
│   └── slices/
│       ├── boardsSlice.ts   # 보드/리스트/일 CRUD + 모달 활성화
│       ├── loggerSlice.ts   # 활동 로그
│       ├── modalSlice.ts    # 수정 중인 일의 데이터
│       └── userSlice.ts     # 로그인 유저 정보
│
├── hooks/
│   ├── redux.ts             # 타입 적용된 useSelector/useDispatch
│   └── useAuth.ts           # 인증 상태 조회 훅
│
└── types/index.ts           # IBoard, IList, ITask, ILogItem 인터페이스
```

### 데이터 모델

```ts
IBoard   { boardId, boardName, lists: IList[] }
IList    { listId,  listName,  tasks: ITask[] }
ITask    { taskId,  taskName,  taskDescription, taskOwner }
ILogItem { logId,   logAuthor, logMessage, logTimestamp }
```

게시판 → 리스트 → 일로 이어지는 중첩 구조이며,
모든 상태는 Redux store에서 단일 소스(single source of truth)로 관리됩니다.

---

## 🚀 시작하기

### 요구 사항
- Node.js 18+ 권장
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드 (tsc 타입 체크 + vite build)
npm run build

# 빌드 결과 미리보기
npm run preview

# 린트
npm run lint
```

### Firebase 설정
`src/firebase.ts`에 Firebase 프로젝트 설정이 포함되어 있습니다.
Google 로그인을 사용하려면 Firebase 콘솔에서 **Authentication → Google 제공업체**를
활성화해야 합니다.

---

## ☁️ 배포 (CI/CD)

GitHub Actions와 Firebase Hosting을 통해 자동 배포됩니다.

- **`main` 브랜치 푸시** → 프로덕션(live)으로 자동 배포
  (`.github/workflows/firebase-hosting-merge.yml`)
- **Pull Request 생성** → 미리보기(preview) 채널로 자동 배포
  (`.github/workflows/firebase-hosting-pull-request.yml`)

빌드 산출물은 `dist/` 디렉터리에 생성되며, SPA 라우팅을 위해 모든 경로가
`index.html`로 rewrite됩니다.

---

## 📝 참고 / 한계

- 현재 보드 데이터는 **클라이언트 메모리(Redux)** 에만 저장되어 새로고침 시 초기화됩니다.
  (Firestore 연동 등 영속화는 향후 확장 가능)
- 드래그 앤 드롭은 **일(Task) 단위**로 지원합니다. 리스트 자체의 순서 변경은 향후 확장 가능합니다.
- 인증은 구현되어 있으나, 사용자별 데이터 분리는 적용되지 않았습니다.
