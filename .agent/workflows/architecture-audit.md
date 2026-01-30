---
description: 기술 부채 및 구조 점검 (The Architect)
---

# Workflow: Architecture & Consistency Audit

## Trigger
- 주요 마일스톤(Phase 완료) 마다, 또는 파일 개수가 급격히 늘어났을 때.
- 사용자가 "구조 점검해줘"라고 요청할 때.

## Steps

1.  **Review Directory Structure (폴더 구조 점검)**
    - 현재 파일 트리를 `PLAN.md`의 '프로젝트 구조' 섹션과 비교하십시오.
    - 역할에 맞지 않는 위치에 있는 파일(예: `utils`에 있어야 할 로직이 `core`에 있는지)을 식별하십시오.

2.  **Check Responsibility (책임 분리 확인)**
    - 하나의 파일이 너무 많은 일을 하고 있는지(God Class) 확인하십시오.
    - *Check:* `MibParser` 클래스 안에 파일 읽기 로직(File I/O)이 섞여 있지 않은가? (File I/O는 `InputHandler`로 분리되어야 함)

3.  **Refactoring Suggestion (리팩토링 제안)**
    - 기능 구현에는 문제가 없더라도, 유지보수성을 위해 분리하거나 합쳐야 할 모듈이 있다면 제안하십시오.
    - **Why:** 왜 지금 리팩토링을 해야 나중에 편한지 설명하십시오.

4.  **Alignment Check (계획서 일치 여부)**
    - 현재 구현된 기능이 `PLAN.md`의 Scope를 벗어나지 않았는지(Scope Creep) 점검하십시오.