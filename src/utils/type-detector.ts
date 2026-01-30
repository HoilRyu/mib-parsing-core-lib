import { MibNodeType } from '../types';

export class TypeDetector {
    /**
     * net-snmp 노드 정보를 기반으로 MibNodeType을 판별합니다.
     * @param node net-snmp에서 가져온 노드 객체
     * @returns 판별된 노드 타입
     */
    public static detect(node: any): MibNodeType {
        if (!node) return 'Unknown';

        const type = node.type;

        // net-snmp의 node type 상수 값 또는 속성을 기반으로 판별
        // 1: Node, 2: Scalar, 3: Table, 4: Row, 5: Column, 6: Notification, 7: Group, 8: ModuleIdentity
        switch (type) {
            case 1:
                return 'Node';
            case 2:
                return 'Scalar';
            case 3:
                return 'Table';
            case 4:
                return 'TableRow';
            case 5:
                return 'TableColumn';
            case 6:
                return 'Notification';
            case 7:
                return 'Group';
            case 8:
                return 'ModuleIdentity';
            default:
                return 'Unknown';
        }
    }
}
