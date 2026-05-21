# Mixpedia — 프로젝트 폴더 구조

## 최상위

```
mixpedia/
├── public/
└── src/
```

---

## src/

```
src/
├── App.jsx               루트 컴포넌트 — Router 렌더링
├── main.jsx              React 진입점 — Axios 인터셉터 초기화
├── index.css             전역 CSS — 디자인 토큰(변수), 레이아웃, Sidebar, GridJS 공통 테마
│
├── config/
│   ├── config.js         API 엔드포인트 상수 (endpoint)
│   └── axiosSetup.js     Axios 기본 설정 — 토큰 인터셉터, 401 자동 로그아웃
│
├── routes/
│   ├── Router.jsx        전체 라우팅 정의 (BrowserRouter + Route 매핑)
│   └── PrivateRoute.jsx  인증 가드 — localStorage token 검증, 미인증 시 /login 리디렉트
│
├── layouts/
│   ├── MainLayout.jsx    메인 레이아웃 — Sidebar + <Outlet>, BookmarkProvider 감싸기
│   └── SidebarLayout.jsx 사이드바 UI — 메뉴 그룹, 로그아웃, 활성 경로 하이라이트
│
├── context/
│   └── BookmarkContext.jsx 전역 북마크 상태 — 추가/삭제, 서버 동기화, useBookmark 훅 제공
│
├── utils/                 ★ 공통 유틸 (여러 페이지에서 import)
│   ├── notify.js          Notyf 토스트 인스턴스 — notify.success / notify.error
│   └── mixUtils.js        공통 포맷 함수 — toArr, fmtBudget, GENDER_LABEL
│
├── hooks/                 ★ 공통 커스텀 훅
│   └── useAuthToken.js    인증 토큰 헬퍼 — getToken(), authHeader() 반환
│
├── components/            ★ 공통 UI 컴포넌트 (여러 페이지에서 재사용 가능)
│   └── MultiSelect.jsx    다중선택 드롭다운 — 검색, 태그 표시, 외부클릭 닫기
│
└── pages/                 페이지 단위 기능 모듈 (feature-folder 패턴)
    ├── Login/
    ├── MixSearch/
    ├── MediaInsight/
    └── MarketingMixModel/
```

---

## pages/Login/

```
Login/
├── LoginPage.jsx   로그인 폼 — 아이디/비밀번호 입력, 토큰 저장, 메인 리디렉트
└── styles.css      로그인 페이지 전용 스타일
```

---

## pages/MixSearch/

미디어믹스 검색 및 북마크 기능

```
MixSearch/
├── index.jsx                진입점 — MixSearchPage 재export
├── MixSearchPage.jsx        메인 페이지 — 필터 + 테이블 + 상세 조회 조합
├── styles.css               MixSearch 전용 스타일
│
├── hooks/
│   └── useMixSearch.js      검색 로직 훅 — 필터 상태, API 호출, 옵션 로드
│
├── components/
│   ├── SearchPanel.jsx       필터 UI — 매체, 업종, 성별, 연령 등 입력
│   ├── MixTable.jsx          GridJS 결과 테이블 — 북마크 토글, 행 선택
│   └── detail/
│       ├── MixDetail.jsx     믹스 상세 — 예산 차트, 유사 믹스, 파일 링크
│       ├── DonutChart.jsx    매체별 예산 도넛차트 (ECharts)
│       ├── EditModal.jsx     수정 요청 모달
│       └── MixMicroGrid.jsx  상세 집행내역 GridJS 테이블
│
└── MyBookmarks/
    ├── index.jsx             북마크 목록 페이지 — CRUD, 선택, 분석 진입
    └── BookmarkInsights.jsx  선택된 북마크 비교 분석 페이지
```

---

## pages/MediaInsight/

매체별 인사이트 조회

```
MediaInsight/
├── index.jsx                진입점 — MediaInsightPage 재export
├── MediaInsightPage.jsx     메인 페이지 — 매체 목록 + 상세 조회
├── styles.css               MediaInsight 전용 스타일
└── components/
    ├── MediaTable.jsx        매체 목록 테이블
    ├── MediaDetail.jsx       매체 상세 — 업종/프로그램 분포, 혼합 조회
    └── MediaNetwork.jsx      매체 관계 네트워크 시각화
```

---

## pages/MarketingMixModel/

MMM(Marketing Mix Model) 생성·조회·분석

```
MarketingMixModel/
├── MmmCreatePage.jsx         5단계 모델 생성 위저드
├── MmmMyModelsPage.jsx       모델 목록 조회 + 삭제
├── MmmDetailPage.jsx         모델 상세 — 3탭 (Overview / Ad Effect / Optimize)
├── styles.css                MMM 전용 스타일 (mmm-card, mmm-badge 등)
├── mmmUtils.js               MMM 내부 헬퍼 — 모델 ID 생성, 단계 상수, JSON 파싱
│
├── steps/                    위저드 단계별 컴포넌트
│   ├── Step00Define.jsx      1단계: 모델명 입력
│   ├── Step01Upload.jsx      2단계: CSV 업로드
│   ├── Step02Variables.jsx   3단계: 시간/KPI/매체 변수 매핑
│   ├── Step03Settings.jsx    4단계: ROI·커버리지·최적빈도 설정
│   └── Step04Complete.jsx    5단계: 완료 안내
│
├── components/               MMM 전용 공통 컴포넌트
│   ├── StepIndicator.jsx     진행 단계 표시바
│   ├── Alerts.jsx            경고/에러 배너
│   ├── MmmFilterCard.jsx     모델 조회 필터 (날짜, 모델명, ID)
│   ├── MmmModelsGrid.jsx     모델 목록 GridJS 테이블 (상태 뱃지, 삭제 버튼)
│   └── DeleteConfirmModal.jsx 모델 삭제 확인 모달 — 되돌릴 수 없음 경고 포함
│
└── detail/                   상세 탭별 차트·테이블 컴포넌트
    ├── MmmDetailHeader.jsx   모델 메타 정보 헤더 (기간, KPI, 매체 변수 카드)
    ├── TabOverview.jsx       Overview 탭 — 모델 성능, 기여 KPI, ROI 시각화
    ├── TabAdEffect.jsx       Ad Effect 탭 — Carry Over(Adstock) / Saturation 차트
    ├── TabOptimize.jsx       Optimize 탭 — 반응 곡선, 예산 배분 최적화
    └── chartUtils.js         차트 공통 — MIXPEDIA 팔레트, hexToRgba, TIMESEQ_LABEL
```

---

## 설계 원칙

| 위치 | 기준 |
|------|------|
| `src/utils/` | 2개 이상의 feature에서 사용하는 순수 함수 |
| `src/hooks/` | 2개 이상의 feature에서 사용하는 커스텀 훅 |
| `src/components/` | 2개 이상의 feature에서 사용하는 UI 컴포넌트 |
| `pages/<Feature>/utils/` | 해당 feature 전용 유틸 함수 |
| `pages/<Feature>/hooks/` | 해당 feature 전용 커스텀 훅 |
| `pages/<Feature>/components/` | 해당 feature 전용 UI 컴포넌트 |
