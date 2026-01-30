import * as snmp from 'net-snmp';
import { MibSymbolInfo, ModuleParseResult } from '../types';
import { TypeDetector } from '../utils/type-detector';
import { OidFormatter } from '../utils/oid-formatter';

export class MibParser {
    private store: any;

    constructor() {
        this.store = snmp.createModuleStore();
    }

    public loadModule(filePath: string): void {
        this.store.loadFromFile(filePath);
    }

    public getLoadedModules(): string[] {
        return this.store.getModuleNames(true);
    }

    /**
     * 지정된 모듈의 모든 심볼 정보를 가져옵니다.
     * @param moduleName MIB 모듈 이름
     * @returns 모듈 파싱 결과
     */
    public getModuleResults(moduleName: string): ModuleParseResult | null {
        const module = this.store.getModule(moduleName);
        if (!module) return null;

        const symbols: Record<string, MibSymbolInfo> = {};

        // net-snmp의 프로바이더 추출 로직을 활용합니다. (Scalar/Table 구분)
        const providers = this.store.getProvidersForModule(moduleName);

        for (const provider of providers) {
            if (provider.type === snmp.MibProviderType.Scalar) {
                const type = 'Scalar';
                const rawOid = provider.oid;
                const oid = OidFormatter.format(rawOid, type);

                symbols[provider.name] = {
                    oid,
                    rawOid,
                    name: provider.name,
                    type,
                    description: provider.description, // getProviders에서 description을 넣어주나 확인 필요
                    syntax: provider.scalarType,
                    access: provider.maxAccess,
                };
            } else if (provider.type === snmp.MibProviderType.Table) {
                // 테이블 처리
                const type = 'Table';
                symbols[provider.name] = {
                    oid: provider.oid,
                    rawOid: provider.oid,
                    name: provider.name,
                    type,
                    description: provider.description,
                    // 테이블 하위 컬럼들도 심볼로 추가할 수 있으나, 일단 테이블 자체만 추가
                };

                // 컬럼들도 개별 심볼로 추가 (TableColumn)
                if (provider.tableColumns) {
                    for (const col of provider.tableColumns) {
                        const colType = 'TableColumn';
                        symbols[col.name] = {
                            oid: provider.oid + '.' + col.number,
                            rawOid: provider.oid + '.' + col.number,
                            name: col.name,
                            type: colType,
                            syntax: col.type,
                            access: col.maxAccess,
                        };
                    }
                }
            }
        }

        // OBJECT IDENTIFIER 같은 나머지 노드들도 포함하고 싶다면 기존 로직과 병합 필요
        // 일단은 SNMP 연동에 중요한 Scalar/Table 위주로 처리

        return {
            moduleName,
            symbols,
            parsedAt: new Date(),
        };
    }
}
