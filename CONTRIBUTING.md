# Contributing

프로젝트에 기여해 주셔서 감사합니다!

## 문서 구조

기여하기 전에 아래 문서들을 확인하세요:

| 문서 | 용도 |
|------|------|
| [README.md](./README.md) | 프로젝트 개요 |
| [CLAUDE.md](./CLAUDE.md) | 개발 가이드, 기술 스택, 코드 컨벤션 |
| [ROADMAP.md](./ROADMAP.md) | 단계별 확장 전략 |
| [TASKS.md](./TASKS.md) | 작업 체크리스트 |

## 기여 절차

### 1. Issue 확인
- [TASKS.md](./TASKS.md)에서 작업할 항목 확인
- 기존 Issue가 있으면 할당 요청
- 없으면 새 Issue 생성

### 2. 브랜치 생성
```bash
git checkout -b feature/your-feature-name
# 또는
git checkout -b fix/bug-description
```

### 3. 개발
- [CLAUDE.md](./CLAUDE.md)의 코드 컨벤션 준수
- TypeScript 엄격 모드 유지 (`any` 타입 금지)
- 모든 사용자 텍스트는 i18n 적용

### 4. 테스트
```bash
pnpm test
pnpm build  # 타입 체크 포함
```

### 5. PR 제출
- 명확한 제목과 설명
- 관련 Issue 링크
- 변경 사항 요약
- 스크린샷 (UI 변경 시)

## 코드 규칙

### Import 순서
```tsx
// 1. React & 외부 라이브러리
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. 내부 모듈 (@/ 별칭)
import { Button } from '@/components/ui/button'
import { useTheme } from '@/stores'

// 3. 타입
import type { User } from '@/schemas'
```

### 컴포넌트 구조
```tsx
// 1. 타입 정의
interface Props {
  title: string
}

// 2. 컴포넌트
export const MyComponent = ({ title }: Props) => {
  const { t } = useTranslation()
  return <div>{t('key')}</div>
}
```

### 핵심 규칙
- **pnpm** 사용 (npm, yarn 금지)
- **서버 상태**는 TanStack Query
- **클라이언트 상태**는 Zustand
- **스키마 검증**은 Zod
- **번역**은 i18next (모든 로케일 파일 동시 업데이트)

## PR 체크리스트

- [ ] `pnpm build` 성공
- [ ] `pnpm test` 통과
- [ ] TypeScript 오류 없음
- [ ] i18n 키 추가 시 en/ko/ja 모두 업데이트
- [ ] [TASKS.md](./TASKS.md) 체크리스트 업데이트 (해당 시)

## 질문 및 논의

- **Bug**: GitHub Issues
- **Feature Request**: GitHub Issues
- **질문**: GitHub Discussions

감사합니다!
