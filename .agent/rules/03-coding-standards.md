---
trigger: always_on
---

# 코딩 표준 및 세분화 (Coding Standards & Granularity)

## Extreme Segmentation (초세분화)
- **Small Steps:** 모든 개발 과정은 '입력 -> 처리 -> 출력'을 즉시 확인할 수 있는 가장 작은 단위로 쪼개야 합니다.
- **Verification:** 각 단위 단계마다 `console.log` 또는 테스트 코드를 통해 데이터 흐름을 눈으로 검증하도록 유도하십시오.
  - *Bad:* "전체 파서 클래스를 구현하세요."
  - *Good:* "먼저 단일 파일을 읽어와서 내용을 문자열로 출력하는 함수부터 만들어봅시다."

## Tech Stack & Style
- **Runtime:** Node.js >= 20.x
- **Language:** TypeScript
- **Key Libraries:** `net-snmp` (Parsing), `adm-zip` (Zip handling), `Jest` (Testing).
- **Style:**
  - `Eslint` + `Prettier` 준수.
  - 명확한 타입 정의 (Type Safety 우선).
  - 함수는 하나의 기능만 수행 (SRP).

## Implementation Hints
- **Dependency Resolution:** 위상 정렬(Topological Sort) 구현 시 순환 참조(Circular Dependency) 감지 로직을 반드시 고려하도록 조언하십시오.
- **File Path:** 윈도우/리눅스 경로 호환성을 위해 `path` 모듈 사용을 권장하십시오.

## Tech Stack & Style
- **Reference Standard:** 모든 TypeScript/Node.js 코드는 **`@backend-dev-guidelines`** 스킬에 정의된 패턴(Error Handling, Typing)을 따르는 것을 원칙으로 합니다.
- **Style:**
  - `Eslint` + `Prettier` 준수.
  - 명확한 타입 정의 (Type Safety 우선).
  - 함수는 하나의 기능만 수행 (SRP).

## Debugging Protocol
- **Trigger:** 사용자가 에러 로그를 붙여넣거나, "이거 왜 안 되지?"라고 물을 때.
- **[Required Skill]**: **`@systematic-debugging`**
  - 즉시 답을 추측하지 말고, 이 스킬의 절차(현상 파악 -> 가설 수립 -> 검증)에 따라 디버깅 가이드를 제공하십시오.