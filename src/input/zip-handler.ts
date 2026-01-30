import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import AdmZip = require('adm-zip');
import { FileHandler } from './file-handler';

export interface ZipParseResult {
    filePaths: string[];
    cleanup: () => void;
}

export class ZipHandler {
    private readonly fileHandler: FileHandler;

    constructor() {
        this.fileHandler = new FileHandler();
    }

    /**
     * ZIP 파일의 압축을 임시 폴더에 풀고 MIB 파일 목록을 반환합니다.
     * @param zipPath ZIP 파일 경로
     * @returns 파일 목록과 정리 함수를 포함한 객체
     */
    public extractAndCollect(zipPath: string): ZipParseResult {
        const absoluteZipPath = path.resolve(zipPath);
        if (!fs.existsSync(absoluteZipPath)) {
            return { filePaths: [], cleanup: () => { } };
        }

        // OS 임시 디렉토리에 전용 폴더 생성
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mib-parsing-'));

        try {
            const zip = new AdmZip(absoluteZipPath);
            zip.extractAllTo(tempDir, true);

            const filePaths = this.fileHandler.collectFiles(tempDir);

            return {
                filePaths,
                cleanup: () => {
                    if (fs.existsSync(tempDir)) {
                        fs.rmSync(tempDir, { recursive: true, force: true });
                    }
                },
            };
        } catch (error) {
            // 에러 발생 시 임시 폴더 정리
            fs.rmSync(tempDir, { recursive: true, force: true });
            throw error;
        }
    }
}
