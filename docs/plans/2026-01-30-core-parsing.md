# 핵심 파싱 (Phase 3) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `net-snmp` 라이브러리를 사용하여 MIB 파일을 파싱하고, OID/이름/타입/설명 등이 포함된 구조화된 JSON 데이터를 생성합니다.

**Architecture:** MIB 파싱 엔진을 캡슐화하고 데이터 변환 로직을 분리합니다.
- `MibParser`: `net-snmp`를 호출하여 MIB 모듈을 로드하고 데이터를 추출하는 메인 클래스.
- `TypeDetector`: 파싱된 노드가 Scalar인지 TableColumn인지 판별하는 유틸리티.
- `OidFormatter`: Scalar OID에 `.0`을 붙이는 등의 포맷팅 로직 처리.

**Tech Stack:** Node.js, `net-snmp`, TypeScript

---

### Task 1: net-snmp 설치 및 MibParser 기초 구현

**Files:**
- Create: `src/core/mib-parser.ts`
- Create: `test/core/mib-parser.test.ts`

**Step 1: net-snmp 라이브러리 연동**
`net-snmp` 패키지를 설치하고, 핵심 클래스인 `MibParser`의 뼈대를 만듭니다.

**Step 2: 기본 파싱 테스트 (TDD)**
- 간단한 MIB 파일 하나를 로드했을 때 모듈 이름이 정확히 추출되는지 확인하는 테스트를 작성합니다.

---

### Task 2: 심볼 데이터 추출 및 타입 분류

**Files:**
- Create: `src/utils/type-detector.ts`
- Modify: `src/core/mib-parser.ts`

**Step 1: MIB 노드 순회 및 데이터 매핑**
파싱된 MIB 모듈 내의 모든 심볼을 순회하며 OID, 이름, 설명을 추출합니다.

**Step 2: 타입 판별 로직 구현**
`net-snmp`에서 제공하는 데이터를 기반으로 해당 심볼이 `Scalar`인지 `TableColumn`인지 판별하는 로직을 `TypeDetector`에 구현합니다.

---

### Task 3: OID 보정 (Scalar .0 추가)

**Files:**
- Create: `src/utils/oid-formatter.ts`

**Step 1: Scalar 보정 규칙 적용**
타입이 `Scalar`인 경우 OID 끝에 `.0`을 자동으로 추가하는 기능을 구현합니다. 이는 실제 SNMP GET 요청을 위해 필수적입니다.

---

### Task 4: 최종 JSON 결과 구조화

**Files:**
- Modify: `src/index.ts`

**Step 1: API 통합**
사용자가 경로를 주면 [입력 처리] -> [파싱] -> [데이터 변환] 단계를 거쳐 최종 `ParseResultSummary`를 반환하도록 통합합니다.
