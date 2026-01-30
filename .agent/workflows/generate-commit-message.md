---
description: 커밋 메시지 생성
---

# Git Commit Message Generation Workflow

이 워크플로우는 사용자가 "커밋 메시지 만들어줘", "깃 커밋 할래"라고 요청하거나, 기능 구현 및 테스트가 완료된 시점에서 실행됩니다.
AI는 변경된 사항을 분석하여 **Conventional Commits** 규칙에 맞는 명확하고 전문적인 커밋 메시지를 제안해야 합니다.

## Step 1: Change Analysis (변경 사항 분석)
가장 먼저 무엇이 변경되었는지 파악해야 합니다.
1. **Request Diff:** AI가 현재 변경된 파일을 인식할 수 없는 경우, 사용자에게 `git diff --staged` 결과를 보여달라고 요청하거나 변경 내용을 요약해달라고 합니다.
2. **Identify Scope:** 변경된 코드가 어떤 모듈이나 기능(Scope)에 해당하는지 파악합니다. (예: `auth`, `db`, `ui`)

## Step 2: Determine Type (유형 결정)
변경 사항의 성격에 따라 태그(Type)를 결정합니다.
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등 (비즈니스 로직 변경 없음)
- `refactor`: 코드 리팩토링 (기능 변경 없음)
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등

## Step 3: Draft Message (메시지 작성)
아래 표준 포맷에 맞춰 메시지를 작성합니다.

```text
<type>(<scope>): <subject>

<body>