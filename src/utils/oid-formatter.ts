import { MibNodeType } from '../types';

export class OidFormatter {
    /**
     * 노드 타입에 따라 OID를 포맷팅합니다.
     * @param oid 원본 OID
     * @param type 노드 타입
     * @returns 포맷팅된 OID
     */
    public static format(oid: string, type: MibNodeType): string {
        // Scalar 타입은 실제 수집 시 .0을 붙여야 함
        if (type === 'Scalar' && !oid.endsWith('.0')) {
            return `${oid}.0`;
        }
        return oid;
    }
}
