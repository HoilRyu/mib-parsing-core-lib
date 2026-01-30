# 프로젝트 초기화 (Phase 1) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** TypeScript 라이브러리 개발을 위한 기본 환경(TypeScript, ESLint, Prettier, Jest)을 구축합니다.

**Architecture:** Node.js 기반의 TypeScript 라이브러리 프로젝트 구조를 따릅니다.

**Tech Stack:** Node.js, TypeScript, ESLint, Prettier, Jest

---

### Task 1: Node.js 프로젝트 초기화 및 기본 의존성 설치

**Files:**
- Create: `package.json`
- Modify: `.gitignore`

**Step 1: 프로젝트 초기화 설명**
사용자에게 `npm init` 명령어를 통해 `package.json`을 생성하도록 가이드하고, 라이브러리 개발에 필수적인 `devDependencies`들을 설명합니다.

**Step 2: 의존성 설치 유도**
다음 라이브러리들이 왜 필요한지 설명하고 설치하도록 합니다:
- `typescript`
- `ts-node` (개발용)
- `@types/node`

**Step 3: 커밋**
`package.json`과 `package-lock.json`을 커밋합니다.

---

### Task 2: TypeScript 설정 (`tsconfig.json`)

**Files:**
- Create: `tsconfig.json`

**Step 1: tsconfig 설정 방향 제시**
라이브러리 배포를 위해 `outDir`, `declaration`, `sourceMap` 등의 옵션이 왜 중요한지 Socratic Method로 질문하고 가이드합니다.

**Step 2: 설정 파일 생성**
사용자가 직접 `npx tsc --init`을 실행하거나 설정을 작성하도록 힌트를 제공합니다.

---

### Task 3: 코드 퀄리티 관리 설정 (ESLint & Prettier)

**Files:**
- Create: `.eslintrc.json`, `.prettierrc`

**Step 1: Lint/Format 필요성 설명**
팀 협업과 코드 일관성을 위해 왜 이 도구들이 필요한지 설명합니다.

**Step 2: 설정 가이드**
TypeScript와 호환되는 ESLint 플러그인 설정 방법을 의사 코드로 제공합니다.

---

### Task 4: 테스트 환경 구축 (Jest)

**Files:**
- Create: `jest.config.js`
- Create: `test/initial.test.ts`

**Step 1: TDD의 중요성 강조**
복잡한 MIB 파싱 로직을 검증하기 위해 왜 Jest가 유효한지 설명합니다.

**Step 2: Jest 초기 설정 및 첫 번째 실패하는 테스트 작성**
간단한 환경 확인용 테스트 코드를 작성하도록 가이드합니다.
