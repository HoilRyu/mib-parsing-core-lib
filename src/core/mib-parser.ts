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

        // 1. Providers 우선 처리 (정확한 Scalar/Table/Column 구분용)
        const providers = this.store.getProvidersForModule(moduleName);
        for (const p of providers) {
            if (p.type === snmp.MibProviderType.Scalar) {
                symbols[p.name] = this.extractSymbolInfo(p.name, p, 'Scalar', moduleName);
            } else if (p.type === snmp.MibProviderType.Table) {
                symbols[p.name] = this.extractSymbolInfo(p.name, p, 'Table', moduleName);

                // 컬럼들도 추가
                if (p.tableColumns) {
                    for (const col of p.tableColumns) {
                        const colOid = p.oid + '.' + col.number;
                        symbols[col.name] = this.extractSymbolInfo(col.name, { ...col, oid: colOid }, 'TableColumn', moduleName);
                    }
                }
            }
        }

        // 2. 나머지 노드 수집 (계층 노드, MODULE-IDENTITY 등)
        for (const name in module) {
            if (symbols[name]) continue; // 이미 처리된 경우 스킵

            const node = module[name];
            if (typeof node === 'object' && node !== null) {
                const type = TypeDetector.detect(node);
                if (type !== 'Unknown') {
                    symbols[name] = this.extractSymbolInfo(name, node, type, moduleName);
                }
            }
        }

        return {
            moduleName,
            symbols,
            parsedAt: new Date(),
        };
    }

    private extractSymbolInfo(name: string, nodeOrProvider: any, type: any, currentModuleName: string): MibSymbolInfo {
        const rawOid = nodeOrProvider.oid || nodeOrProvider.OID || nodeOrProvider['OBJECT IDENTIFIER OID'] || '';
        const oid = OidFormatter.format(rawOid, type);

        // 설명 추출
        let description = nodeOrProvider.description || nodeOrProvider.DESCRIPTION;
        if (!description) {
            // 모듈 정보에서 직접 찾음
            const storeNode = this.store.getModule(currentModuleName)?.[name];
            if (storeNode) {
                description = storeNode.description || storeNode.DESCRIPTION;
            }
        }

        return {
            oid,
            rawOid,
            name: name,
            type: type,
            description: description,
            syntax: this.formatSyntax(nodeOrProvider.syntax || nodeOrProvider.SYNTAX || nodeOrProvider.scalarType || nodeOrProvider.type),
            access: nodeOrProvider.access || nodeOrProvider.ACCESS || nodeOrProvider.maxAccess || nodeOrProvider['MAX-ACCESS'],
        };
    }

    private formatSyntax(syntax: any): any {
        if (!syntax) return undefined;
        if (typeof syntax === 'string') return syntax;
        if (typeof syntax === 'object') {
            const keys = Object.keys(syntax);
            if (keys.length === 1) return keys[0];
            return JSON.stringify(syntax);
        }
        return syntax;
    }
}
