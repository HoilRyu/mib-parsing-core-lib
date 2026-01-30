---
trigger: always_on
---

# 개발 워크플로우 (Development Workflow Cycle)

이 프로젝트는 반드시 다음 4단계 사이클을 반복하며 진행됩니다. AI는 각 단계의 역할을 엄격히 수행해야 합니다.

## Phase 1: 단계 설정 및 가이드 (AI's Role)
- **Trigger:** 새로운 기능 개발 시작 시.
- **[Required Skill]**: `@writing-plans`
  - 계획을 수립할 때 이 스킬을 활용하여 현재 `PLAN.md`와 충돌하지 않는지, 논리적인 단계인지 검증하십시오.
- **Action:** `.agent/plan/PLAN.md`를 참고하여 **"지금부터 [Step X.X: 기능명] 단계를 진행하겠습니다."**라고 선언.
- **Content:**
  1.  **Explain the 'Why':** 왜 이 기능이 필요한지, 왜 이 기술/패턴을 써야 하는지 기술적 배경 설명.
  2.  **Guidance:** 논리적 흐름(Flow), 폴더 구조 제안, 필요한 라이브러리.
  3.  **Strictly No Full Code:** 오직 의사 코드(Pseudo-code)와 힌트만 제공.

## Phase 2: 구현 (User's Role)
- **Action:** AI의 가이드를 바탕으로 사용자가 직접 코드를 작성.
- **[Support Skill]**: `@backend-dev-guidelines`
  - 사용자가 코드 작성 힌트를 요청하거나 부분 코드를 질문할 때, 이 가이드라인(Zod, Async 등)에 입각하여 답변하십시오.

## Phase 3: 리뷰 및 검증 (Review Cycle)
- **Trigger:** 사용자가 구현을 완료했다고 할 때.
- **[Required Skill]**: `@requesting-code-review`, `@verification-before-completion`
  - **Checklist:** `@verification-before-completion` 스킬을 사용하여 "완료 전 필수 점검 리스트"를 먼저 생성하고 사용자에게 확인받으십시오.
  - **Review:** 그 후 `@requesting-code-review` 포맷에 맞춰 코드의 잠재적 문제점을 지적하십시오.

## Phase 4: 승인 및 다음 단계 (Next Step)
- **Rule:** 모든 테스트(또는 검증)가 통과하고, 사용자가 명시적으로 **"다음 단계로 넘어가자"**고 말하기 전까지는 절대 다음 기능으로 넘어가지 마십시오.
- **[Bonus Action]**: `@generate-commit-message`
  - 단계 완료 후 Git 커밋을 할 때가 되면, 이 워크플로우를 사용하여 깔끔한 커밋 메시지를 제안해 주십시오.