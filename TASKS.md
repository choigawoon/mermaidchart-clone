# Tasks

기능별 구현 상태와 작업 체크리스트입니다.

## 구현 현황 요약

| 기능 | 상태 | 진행률 |
|------|------|--------|
| API 계층 | ✅ 완료 | 100% |
| 상태 관리 | ✅ 완료 | 100% |
| 라우팅 | ✅ 완료 | 100% |
| 스타일링 | ✅ 완료 | 100% |
| 개발 도구 | ✅ 완료 | 100% |
| i18n | ✅ 완료 | 95% |
| PWA | ✅ 완료 | 95% |
| Tauri | ⚠️ 기본 설정 | 30% |
| 테스트 | ⚠️ 부분 | 40% |

---

## 상세 체크리스트

### API 계층 ✅

#### 완료된 작업
- [x] Zod 스키마 정의 (`src/schemas/`)
- [x] API 클라이언트 (`src/api/client.ts`)
- [x] TanStack Query 훅 (`src/api/services/`)
- [x] MSW 핸들러 (`src/mocks/handlers.ts`)
- [x] IndexedDB 통합 (`src/db/`)
- [x] 환경별 모드 전환 (`VITE_API_MODE`)
- [x] Items/Users/Auth/Search/Health API

#### 남은 작업
- [ ] Prisma → Zod 자동 생성 설정
- [ ] Contents API 스키마 정리

---

### 상태 관리 ✅

#### 완료된 작업
- [x] Zustand 슬라이스 패턴
- [x] ApiSlice, UiSlice, TaskSlice, WorkflowSlice
- [x] LocalStorage 지속성 (테마, 언어)
- [x] DevTools 통합
- [x] Selector hooks

---

### 라우팅 ✅

#### 완료된 작업
- [x] 파일 기반 라우팅 (TanStack Router)
- [x] 자동 코드 스플릿
- [x] 타입 안전 네비게이션
- [x] DevTools 통합
- [x] 현재 라우트: `/`, `/zustand-test`, `/msw-test`, `/db-test`

---

### 스타일링 ✅

#### 완료된 작업
- [x] Tailwind CSS v4
- [x] shadcn/ui 컴포넌트
- [x] cn() 유틸리티
- [x] 반응형 디자인
- [x] 모바일 사이드바

---

### 개발 도구 ✅

#### 완료된 작업
- [x] TanStack DevTools (Router, Query)
- [x] Vitest 설정
- [x] Testing Library
- [x] TypeScript 엄격 모드
- [x] Web Vitals

---

### i18n ✅

#### 완료된 작업
- [x] i18next 설정
- [x] 한/영/일 번역
- [x] 타입 안전 번역 키
- [x] 날짜/숫자 포맷터
- [x] 브라우저 언어 감지
- [x] Zustand 동기화

#### 남은 작업
- [ ] 동적 언어 로딩 (번들 분리)
- [ ] RTL 언어 지원 (선택)

---

### PWA ✅

#### 완료된 작업
- [x] Web App Manifest
- [x] Service Worker (Workbox)
- [x] 오프라인 지원
- [x] 설치 프롬프트
- [x] 업데이트 알림
- [x] usePWA 훅

#### 남은 작업
- [ ] 백그라운드 동기화 (선택)

---

### Tauri ⚠️

#### 완료된 작업
- [x] Tauri 2.0 기본 설정
- [x] tauri.conf.json 설정
- [x] Cargo.toml 설정
- [x] 빌드 스크립트

#### 남은 작업
- [ ] Rust 커맨드 구현
- [ ] IPC 통신 설정
- [ ] 파일 시스템 API
- [ ] 다이얼로그 API
- [ ] 자동 업데이트

---

### 테스트 ⚠️

#### 완료된 작업
- [x] Vitest 설정
- [x] i18n 테스트 유틸리티
- [x] 기본 테스트 예시

#### 남은 작업
- [ ] API 서비스 테스트
- [ ] 컴포넌트 테스트
- [ ] Zustand 스토어 테스트
- [ ] E2E 테스트

---

## 우선순위 작업

### 높음
1. Prisma → Zod 자동 생성 환경 구성
2. 테스트 커버리지 확대
3. Contents API 스키마 정리

### 중간
4. Tauri IPC 구현
5. E2E 테스트 추가
6. 동적 언어 로딩

### 낮음
7. RTL 언어 지원
8. 백그라운드 동기화

---

## 기여 방법

작업을 시작하기 전에:
1. 이 문서에서 원하는 작업 확인
2. Issue 생성 또는 기존 Issue 할당
3. 작업 완료 후 PR 제출
4. 이 문서의 체크리스트 업데이트
