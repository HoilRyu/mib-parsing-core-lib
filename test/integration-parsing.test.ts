import * as path from 'path';
import * as fs from 'fs';
import AdmZip = require('adm-zip');
import { parseMib } from '../src/index';

describe('Integration: Core Parsing', () => {
    const testDir = path.join(__dirname, 'integration-test-data');
    const zipPath = path.join(testDir, 'test-mibs.zip');

    beforeAll(() => {
        if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);

        // 테스트용 MIB들을 담은 ZIP 생성
        const zip = new AdmZip();

        // SNMPv2-SMI (최소 정의)
        const smiContent = `
SNMPv2-SMI DEFINITIONS ::= BEGIN
org OBJECT IDENTIFIER ::= { iso 3 }
dod OBJECT IDENTIFIER ::= { org 6 }
internet OBJECT IDENTIFIER ::= { dod 1 }
private OBJECT IDENTIFIER ::= { internet 4 }
enterprises OBJECT IDENTIFIER ::= { private 1 }
END
    `;

        // CUSTOM-MIB (Scalar 포함)
        const customContent = `
CUSTOM-MIB DEFINITIONS ::= BEGIN
IMPORTS
    enterprises
        FROM SNMPv2-SMI
    OBJECT-TYPE
        FROM SNMPv2-SMI;

myCompany OBJECT IDENTIFIER ::= { enterprises 9999 }

customerCount OBJECT-TYPE
    SYNTAX      INTEGER
    MAX-ACCESS  read-only
    STATUS      current
    DESCRIPTION "Number of customers"
    ::= { myCompany 1 }
END
    `;

        zip.addFile('SNMPv2-SMI.mib', Buffer.from(smiContent));
        zip.addFile('CUSTOM-MIB.mib', Buffer.from(customContent));
        zip.writeZip(zipPath);
    });

    afterAll(() => {
        if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should collect files from ZIP and parse them into merged results', () => {
        const result = parseMib(zipPath, { mode: 'merged' });

        expect(result.mode).toBe('merged');
        expect(result.merged).toBeDefined();

        if (result.merged) {
            const { modules, symbols } = result.merged;

            // 로드된 모듈 확인
            expect(modules).toContain('SNMPv2-SMI');
            expect(modules).toContain('CUSTOM-MIB');

            // 심볼 확인
            const customerCount = symbols['customerCount'];
            expect(customerCount).toBeDefined();
            if (customerCount) {
                expect(customerCount.type).toBe('Scalar');
                // .0 이 붙어야 함
                expect(customerCount.oid).toBe('1.3.6.1.4.1.9999.1.0');
            }
        }
    });
});
