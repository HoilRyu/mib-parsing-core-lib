import * as path from 'path';
import * as fs from 'fs';
import { DependencyResolver } from '../../src/utils/dependency-resolver';

describe('DependencyResolver', () => {
    const testDir = path.join(__dirname, 'dep-test-data');
    const resolver = new DependencyResolver([
        path.join(process.cwd(), 'assets/mibs/standard'),
        path.join(process.cwd(), 'node_modules/net-snmp/lib/mibs'),
    ]);

    beforeAll(() => {
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        // A -> B -> C 순차 의존성 생성
        fs.writeFileSync(path.join(testDir, 'C-MIB.mib'), 'C-MIB DEFINITIONS ::= BEGIN \n END');
        fs.writeFileSync(path.join(testDir, 'B-MIB.mib'), 'B-MIB DEFINITIONS ::= BEGIN \n IMPORTS symbol FROM C-MIB; \n END');
        fs.writeFileSync(path.join(testDir, 'A-MIB.mib'), 'A-MIB DEFINITIONS ::= BEGIN \n IMPORTS symbol FROM B-MIB; \n END');
    });

    afterAll(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should resolve files in correct topological order (C, B, A)', () => {
        const files = [
            path.join(testDir, 'A-MIB.mib'),
            path.join(testDir, 'B-MIB.mib'),
            path.join(testDir, 'C-MIB.mib'),
        ];

        const ordered = resolver.resolveOrder(files);

        const baseNames = ordered.map(f => path.basename(f));
        expect(baseNames).toEqual(['C-MIB.mib', 'B-MIB.mib', 'A-MIB.mib']);
    });

    it('should automatically find standard MIBs (e.g., IF-MIB depends on SNMPv2-SMI)', () => {
        const ifMibPath = path.join(process.cwd(), 'assets/mibs/standard/IF-MIB.txt');

        const ordered = resolver.resolveOrder([ifMibPath]);

        // 확장자 없이 모듈명만 추출하여 비교
        const moduleNames = ordered.map(f => path.basename(f, path.extname(f)));

        expect(moduleNames).toContain('SNMPv2-SMI');
        expect(moduleNames).toContain('SNMPv2-TC');
        expect(moduleNames[moduleNames.length - 1]).toBe('IF-MIB');
    });

    it('should throw error on circular dependency', () => {
        fs.writeFileSync(path.join(testDir, 'X-MIB.mib'), 'X-MIB DEFINITIONS ::= BEGIN \n IMPORTS s FROM Y-MIB; \n END');
        fs.writeFileSync(path.join(testDir, 'Y-MIB.mib'), 'Y-MIB DEFINITIONS ::= BEGIN \n IMPORTS s FROM X-MIB; \n END');

        const files = [path.join(testDir, 'X-MIB.mib'), path.join(testDir, 'Y-MIB.mib')];
        expect(() => resolver.resolveOrder(files)).toThrow('Circular dependency');
    });
});
