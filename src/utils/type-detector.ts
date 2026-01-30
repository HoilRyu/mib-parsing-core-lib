import { MibNodeType } from '../types';

export class TypeDetector {
    /**
     * net-snmp 노드 정보를 기반으로 MibNodeType을 판별합니다.
     * @param node net-snmp에서 가져온 노드 객체(provider 또는 module node)
     * @returns 판별된 노드 타입
     */
    public static detect(node: any): MibNodeType {
        if (!node) return 'Unknown';

        // 1. Provider 객체 형식 (숫자형 type)
        if (typeof node.type === 'number') {
            switch (node.type) {
                case 1: return 'Scalar';
                case 2: return 'Table';
                case 3: return 'TableRow';
                case 5: return 'TableColumn';
                default: break;
            }
        }

        // 2. Module Node 객체 형식 (MACRO 및 속성 기반)
        const macro = node.MACRO || '';
        const syntax = node.SYNTAX || node.syntax;

        // OBJECT-TYPE을 우선 확인 (Scalar, Table 등 상세 정보 포함)
        if (macro === 'OBJECT-TYPE' || node['OBJECT-TYPE']) {
            // Table 판별
            if (syntax && typeof syntax === 'object') {
                const keys = Object.keys(syntax);
                if (keys.some(k => k.startsWith('SEQUENCE OF')) || node['SEQUENCE OF']) {
                    return 'Table';
                }
            }
            if (typeof syntax === 'string' && syntax.startsWith('SEQUENCE OF')) {
                return 'Table';
            }

            // TableRow 판별
            if (node.INDEX || node.AUGMENTS || node['RowStatus']) {
                return 'TableRow';
            }

            return 'Scalar';
        }

        // 기타 매크로 기반 판별
        if (macro === 'MODULE-IDENTITY' || node['MODULE-IDENTITY']) return 'ModuleIdentity';
        if (macro === 'NOTIFICATION-TYPE' || macro === 'TRAP-TYPE' || node['NOTIFICATION-TYPE'] || node['TRAP-TYPE']) return 'Notification';
        if (macro === 'OBJECT-GROUP' || node['OBJECT-GROUP']) return 'Group';
        if (macro === 'MODULE-COMPLIANCE' || node['MODULE-COMPLIANCE']) return 'Group';

        // 계층 노드 (OBJECT IDENTIFIER)
        if (macro === 'OBJECT IDENTIFIER' || node['OBJECT IDENTIFIER']) return 'Node';

        // OID만 있는 경우 노드로 처리
        if (node.OID || node.oid || node['OBJECT IDENTIFIER OID']) {
            return 'Node';
        }

        return 'Unknown';
    }
}
