# mib-parsing-core-lib

SNMP MIB 파일을 파싱하여 구조화된 JSON 데이터로 변환하는 핵심 라이브러리입니다. `net-snmp`를 기반으로 하며, 실제 장비의 복잡한 MIB 의존성을 자동으로 해결합니다.

## 주요 기능

- **다양한 입력 지원**: 단일 파일, 폴더(재귀 탐색), ZIP 파일을 모두 처리할 수 있습니다.
- **의존성 자동 해결 (Dependency Resolution)**: MIB 파일 내의 `IMPORTS`를 분석하여 로딩 순서를 자동으로 결정합니다. 순환 참조를 감지하고 위상 정렬을 수행합니다.
- **표준 MIB 자동 로딩**: 의존성 해결 중 누락된 표준 MIB가 있다면 `assets/mibs/standard` 또는 `net-snmp` 내장 경로에서 찾아 자동으로 추가합니다.
- **지능형 타입 판별**: `Scalar`, `Table`, `TableColumn` 타입을 정확히 구분합니다.
- **Scalar OID 보정**: SNMP GET 요청에 필요한 `.0` 접미사를 Scalar 타입에 자동으로 추가합니다.
- **유연한 결과 모드**: 모듈별로 결과를 나누거나(`separate`), 모든 심볼을 하나로 병합(`merged`)하여 받을 수 있습니다.

## 설치

```bash
npm install
```

## 사용 방법

```typescript
import { parseMib } from 'mib-parsing-core-lib';

// 1. 단순 사용 (병합 모드)
const result = parseMib('./assets/test-data/IPTIME-ROUTER-MIB');
console.log(result.merged.symbols['ipTime']);

// 2. 상세 옵션 (분리 모드)
const resultSeparate = parseMib(['./mibs/my-mib.txt', './zips/vendor.zip'], {
  mode: 'separate',
  standardMibDirs: ['./custom-standard-mibs']
});

resultSeparate.modules.forEach(mod => {
  console.log(`Module: ${mod.moduleName}, Symbols: ${Object.keys(mod.symbols).length}`);
});
```

## 아키텍처

1. **Input Stage**: `FileHandler`, `ZipHandler`가 입력을 수집하여 개별 MIB 파일 목록을 만듭니다.
2. **Analysis Stage**: `DependencyResolver`가 파일들을 스캔하여 `IMPORTS` 관계를 파악하고 로딩 순서를 정렬합니다.
3. **Parsing Stage**: `MibParser`가 `net-snmp`를 사용하여 정해진 순서대로 MIB를 로드합니다.
4. **Output Stage**: `TypeDetector`와 `OidFormatter`를 거쳐 최종 JSON 구조를 생성합니다.

## 개발 및 테스트

```bash
# 전체 테스트 실행
npm test

# 특정 테스트 실행
npm test test/utils/dependency-resolver.test.ts
```

## 에러 처리 정책

- **에러 내성**: 특정 파일에 문법 오류가 있어도 전체 파싱 과정이 중단되지 않으며, 해당 에러는 결과의 `errors` 배열에 기록됩니다.
- **의존성 누락**: 검색 경로 내에서 의존성을 찾을 수 없는 경우 경고를 출력하고 가능한 범위까지 파싱을 진행합니다.

## 라이선스

MIT
