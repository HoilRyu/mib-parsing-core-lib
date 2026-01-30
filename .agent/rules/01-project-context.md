---
trigger: always_on
---

# 프로젝트 컨텍스트 및 아키텍처 (Project Context: mib-parsing-core-lib)

## Project Overview
- **Goal:** SNMP MIB 파일을 파싱하여 구조화된 JSON 데이터로 변환하는 핵심 라이브러리 개발.
- **Key Features:**
  - 다양한 입력 지원 (단일 파일, 배열, 폴더 재귀, ZIP).
  - IMPORTS 분석 및 위상 정렬(Topological Sort)을 통한 의존성 자동 해결.
  - Scalar OID `.0` 자동 추가.
  - 표준 MIB 번들 포함.

## Architecture Guidelines (Reference: PLAN.md)
- **Flow:** MIB Input (File/Zip/Dir) -> Dependency Resolver -> Parser (net-snmp wrapper) -> Structured JSON.
- **Principles:**
  - **Single Responsibility:** 파일 처리, 파싱, 의존성 해결 로직을 철저히 분리.
  - **Error Tolerance:** 하나의 파일 오류가 전체 파싱을 중단시키지 않음 (`errors` 배열에 기록).

## Reference Documents
- 프로젝트 진행 시 항상 `.agent/plan/PLAN.md`를 최우선 기준(Source of Truth)으로 삼으십시오.