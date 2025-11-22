# My SPA Template

**브라우저에서 풀스택 개발, 클라우드로 즉시 전환**

## 해결하는 문제

> "백엔드 서버 없이 풀스택처럼 개발하고, 나중에 코드 변경 없이 실제 백엔드로 전환하고 싶다"

기존 방식:
- 백엔드 설정에 시간 소요 → 프론트엔드 개발 지연
- Mock 데이터와 실제 API 간 불일치 → 전환 시 코드 수정 필요
- 인프라 변경 시 프론트엔드 코드도 함께 변경

이 템플릿의 해결책:
- **MSW + IndexedDB**로 브라우저에서 완전한 API 동작
- **환경 변수 하나**로 Mock ↔ Real 백엔드 전환
- **추상화된 API 계층**으로 인프라 독립적 개발

## 핵심 기능

| 기능 | 설명 |
|------|------|
| **Mock Backend** | MSW + IndexedDB로 브라우저에서 CRUD API 완전 동작 |
| **Type-Safe API** | Zod 스키마로 요청/응답 검증, TypeScript 타입 자동 추론 |
| **State Management** | Zustand 슬라이스 패턴 + TanStack Query |
| **i18n** | 한/영/일 지원, 타입 안전 번역 키 |
| **PWA** | 오프라인 지원, 설치 가능 |
| **Desktop** | Tauri 2.0 기본 설정 포함 |

## Quick Start

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## 단계별 확장

```
Stage 1: MSW 모킹        →  백엔드 없이 풀스택 개발
Stage 2: 단일 백엔드      →  FastAPI + PostgreSQL
Stage 3: MSA             →  nginx 리버스 프록시로 서비스 분리
```

**각 단계에서 프론트엔드 코드 변경 없음** - 환경 변수만 변경

## 문서 구조

| 문서 | 내용 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | AI 어시스턴트용 개발 가이드, 기술 스택, 코드 컨벤션 |
| [ROADMAP.md](./ROADMAP.md) | 단계별 확장 전략, 아키텍처 다이어그램 |
| [TASKS.md](./TASKS.md) | 기능별 구현 상태, 작업 체크리스트 |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 기여 방법, PR 규칙 |

## 주요 스크립트

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm test         # 테스트 실행
pnpm tauri:dev    # 데스크톱 앱 개발
```

## 기술 스택

- **Frontend**: React 19, TypeScript 5.7, Vite 7
- **Routing**: TanStack Router (파일 기반)
- **State**: Zustand + TanStack Query
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Mock**: MSW 2 + Dexie (IndexedDB)
- **Validation**: Zod 4
- **i18n**: i18next
- **Desktop**: Tauri 2.0

## License

MIT

---

Issues나 개선 사항은 [GitHub Issues](https://github.com/choigawoon/my-spa-template/issues)에 남겨주세요.
