# 입력 처리 (Phase 2) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 단일 파일, 다중 파일, 폴더, ZIP 파일 등 다양한 입력을 받아 유효한 MIB 파일 경로 목록을 추출하는 기능을 구현합니다.

**Architecture:** 입력 타입에 따라 책임을 분리합니다.
- `FileHandler`: 정규 파일 및 디렉터리 재귀 탐색 담당
- `ZipHandler`: ZIP 파일의 압축 해제 및 임시 디렉터리 관리 담당

**Tech Stack:** Node.js (fs, path), `adm-zip`

---

### Task 1: FileHandler - 파일 및 디렉터리 스캔

**Files:**
- Create: `src/input/file-handler.ts`
- Create: `test/input/file-handler.test.ts`

**Step 1: 유효성 검사 로직 설계**
MIB 파일의 확장자(.mib, .my, .txt)를 정의하고, 디렉터리인 경우 재귀적으로 탐색하여 이 파일들을 수집하는 함수를 설계합니다.

**Step 2: TDD 기반 구현**
- 폴더 구조를 모킹하거나 실제 테스트용 `assets` 폴더를 사용하여 파일 목록이 정확히 추출되는지 테스트를 먼저 작성합니다.
- `src/input/file-handler.ts`에 기능을 구현합니다.

---

### Task 2: ZipHandler - ZIP 파일 처리

**Files:**
- Create: `src/input/zip-handler.ts`
- Create: `test/input/zip-handler.test.ts`

**Step 1: 임시 폴더 관리 전략**
ZIP 파일을 해제할 임시 폴더(`tmp/`)를 생성하고, 작업 완료 후 안전하게 삭제하는 `Disposable` 패턴 또는 `try...finally` 전략을 논의합니다.

**Step 2: adm-zip 연동 및 구현**
- `adm-zip`을 사용하여 지정된 위치에 압축을 풀고, 풀린 파일들 중 MIB 파일들의 경로를 반환하는 기능을 구현합니다.

---

### Task 3: 입력 처리기 통합 (Entry Point)

**Files:**
- Modify: `src/index.ts`

**Step 1: 통합 API 설계**
사용자가 경로 하나(문자열) 또는 여러 경로(배열)를 넘겼을 때, 내부적으로 `FileHandler`와 `ZipHandler`를 적절히 호출하여 최종 파일 배열을 만드는 로직을 통합합니다.
