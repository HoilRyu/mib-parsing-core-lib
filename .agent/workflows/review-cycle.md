---
description: 코드 리뷰 및 검증 (The Gatekeeper)
---

# Workflow: Code Review & Validation Cycle

## Trigger
- 사용자가 Phase 2(구현)를 마치고 "리뷰 해줘" 또는 "검증 해줘"라고 요청할 때 실행.

## Steps

1.  **Context Binding (컨텍스트 확인)**
    - 현재 진행 중인 `PLAN.md`의 단계(Step)와 사용자가 작성한 코드를 매핑합니다.
    - [Check] 사용자가 구현한 범위가 현재 단계의 범위를 벗어나지 않았는지 확인하십시오. (Over-engineering 방지)

2.  **Static Analysis Simulation (정적 분석 시뮬레이션)**
    - **Type Safety:** `any` 타입이 불필요하게 사용되지 않았는지 체크하십시오.
    - **Naming:** 변수명/함수명이 직관적인지, `PLAN.md`의 용어(MIB, OID, Symbol 등)와 일치하는지 확인하십시오.
    - **Error Handling:** `PLAN.md`의 '에러 핸들링 정책' 테이블에 따라 예외 처리가 되어 있는지 확인하십시오.

3.  **Logical Verification (논리 검증 질문)**
    - 코드를 평가하기 전, 사용자에게 다음 질문을 던져 스스로 검증하게 하십시오:
      - *"작성하신 로직에서 [특정 엣지 케이스, 예: 순환 참조]가 발생하면 어떻게 되나요?"*
      - *"이 함수를 단위 테스트한다면 어떤 입력값을 넣어서 검증하시겠습니까?"*
      - *"console.log로 확인했을 때 데이터 구조가 예상대로 출력되었나요?"*

4.  **Feedback (피드백)**
    - 수정이 필요한 부분은 구체적인 이유(Why)와 함께 힌트를 제공하십시오.
    - 모든 기준을 통과했다면 **"Phase 3 통과. 다음 단계(Phase 4)로 진행 승인 대기 중"**임을 알리십시오.