import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip = require('adm-zip');
import { collectAllMibFiles } from '../src/index';

describe('Integration: collectAllMibFiles', () => {
    const testBaseDir = path.join(os.tmpdir(), 'collect-all-test');
    const normalDir = path.join(testBaseDir, 'normal');
    const zipPath = path.join(testBaseDir, 'test.zip');

    beforeAll(() => {
        if (!fs.existsSync(testBaseDir)) {
            fs.mkdirSync(testBaseDir, { recursive: true });
        }
        if (!fs.existsSync(normalDir)) {
            fs.mkdirSync(normalDir);
        }

        // 일반 파일 생성
        fs.writeFileSync(path.join(normalDir, 'file1.mib'), 'dummy');

        // ZIP 파일 생성
        const zip = new AdmZip();
        zip.addFile('zip-file.my', Buffer.from('dummy'));
        zip.writeZip(zipPath);
    });

    afterAll(() => {
        fs.rmSync(testBaseDir, { recursive: true, force: true });
    });

    it('should collect files from multiple sources including ZIP', () => {
        const result = collectAllMibFiles([normalDir, zipPath]);

        try {
            expect(result.filePaths.length).toBe(2);
            expect(result.filePaths.some(p => p.endsWith('file1.mib'))).toBe(true);
            expect(result.filePaths.some(p => p.endsWith('zip-file.my'))).toBe(true);
        } finally {
            result.cleanup();
        }
    });
});
