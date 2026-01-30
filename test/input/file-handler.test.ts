import * as fs from 'fs';
import * as path from 'path';
import { FileHandler } from '../../src/input/file-handler';

describe('FileHandler', () => {
    const testDir = path.join(__dirname, 'test-assets');

    beforeAll(() => {
        // 테스트용 폴더 구조 생성
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        fs.writeFileSync(path.join(testDir, 'test1.mib'), 'dummy content');
        fs.writeFileSync(path.join(testDir, 'test2.my'), 'dummy content');
        fs.writeFileSync(path.join(testDir, 'test3.txt'), 'dummy content');
        fs.writeFileSync(path.join(testDir, 'not-a-mib.pdf'), 'dummy content');

        const subDir = path.join(testDir, 'subdir');
        if (!fs.existsSync(subDir)) {
            fs.mkdirSync(subDir);
        }
        fs.writeFileSync(path.join(subDir, 'sub-test.mib'), 'dummy content');
    });

    afterAll(() => {
        // 테스트 폴더 삭제
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    it(' should collect all MIB files (.mib, .my, .txt) recursively', () => {
        const handler = new FileHandler();
        const files = handler.collectFiles(testDir);

        expect(files.length).toBe(4);
        expect(files).toContain(path.join(testDir, 'test1.mib'));
        expect(files).toContain(path.join(testDir, 'test2.my'));
        expect(files).toContain(path.join(testDir, 'test3.txt'));
        expect(files).toContain(path.join(testDir, 'subdir', 'sub-test.mib'));
        expect(files).not.toContain(path.join(testDir, 'not-a-mib.pdf'));
    });

    it('should handle a single file path', () => {
        const handler = new FileHandler();
        const filePath = path.join(testDir, 'test1.mib');
        const files = handler.collectFiles(filePath);

        expect(files).toEqual([filePath]);
    });
});
