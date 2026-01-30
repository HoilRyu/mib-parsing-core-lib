import * as fs from 'fs';
import * as path from 'path';
import { MibParser } from '../../src/core/mib-parser';

describe('MibParser', () => {
    const testMibPath = path.join(__dirname, 'TEST-MIB.mib');

    afterAll(() => {
        // 복사한 파일은 삭제하지 않거나, 필요시 삭제
        // if (fs.existsSync(testMibPath)) {
        //   fs.unlinkSync(testMibPath);
        // }
    });

    it('should extract symbols with correct types and formatted OIDs', () => {
        const parser = new MibParser();
        const smiPath = path.join(__dirname, 'SNMPv2-SMI.mib');
        parser.loadModule(smiPath);

        // SNMPv2-SMI 결과 확인
        const result = parser.getModuleResults('SNMPv2-SMI');
        expect(result).not.toBeNull();
        if (result) {
            expect(result.moduleName).toBe('SNMPv2-SMI');
            expect(result.symbols['org']).toBeDefined();
            expect(result.symbols['org']?.oid).toBe('1.3');
        }
    });

    it('should have base modules loaded by default', () => {
        const parser = new MibParser();
        const modules = parser.getLoadedModules();
        console.log('Base Modules:', modules);
        // net-snmp는 기본적으로 RFC1155-SMI, SNMPv2-SMI 등을 로드합니다.
        expect(modules).toContain('SNMPv2-SMI');
    });

    it('should load a MIB module and return its name', () => {
        const parser = new MibParser();
        parser.loadModule(testMibPath);

        const modules = parser.getLoadedModules();
        expect(modules).toContain('TEST-MIB');
    });
});
