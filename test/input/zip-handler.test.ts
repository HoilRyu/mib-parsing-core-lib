import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip = require('adm-zip');
import { ZipHandler } from '../../src/input/zip-handler';

describe('ZipHandler', () => {
    const testDir = path.join(os.tmpdir(), 'zip-handler-test');
    const zipPath = path.join(testDir, 'test.zip');

    beforeAll(() => {
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }

        const zip = new AdmZip();
        zip.addFile('test1.mib', Buffer.from('dummy content'));
        zip.addFile('subdir/test2.my', Buffer.from('dummy content'));
        zip.addFile('ignored.pdf', Buffer.from('dummy content'));
        zip.writeZip(zipPath);
    });

    afterAll(() => {
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    it('should extract zip and collect MIB files', () => {
        const handler = new ZipHandler();
        const result = handler.extractAndCollect(zipPath);

        try {
            expect(result.filePaths.length).toBe(2);
            expect(result.filePaths.some(p => p.endsWith('test1.mib'))).toBe(true);
            expect(result.filePaths.some(p => p.endsWith('test2.my'))).toBe(true);
            expect(result.filePaths.some(p => p.endsWith('ignored.pdf'))).toBe(false);
        } finally {
            result.cleanup();
        }
    });

    it('should handle non-existent zip file', () => {
        const handler = new ZipHandler();
        const result = handler.extractAndCollect('non-existent.zip');
        expect(result.filePaths).toEqual([]);
    });
});
