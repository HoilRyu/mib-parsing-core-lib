import * as fs from 'fs';
import * as path from 'path';

export class FileHandler {
    private readonly ALLOWED_EXTENSIONS = ['.mib', '.my', '.txt'];

    /**
     * 지정된 경로(파일 또는 폴더)에서 모든 MIB 파일들의 절대 경로 목록을 수집합니다.
     * @param inputPath 검색할 파일 또는 폴더 경로
     * @returns MIB 파일 경로 배열
     */
    public collectFiles(inputPath: string): string[] {
        const absolutePath = path.resolve(inputPath);

        // 1. inputPath가 존재하지 않으면 빈 배열 반환
        if (!fs.existsSync(absolutePath)) {
            return [];
        }

        const stats = fs.statSync(absolutePath);

        // 2. 파일인 경우
        if (stats.isFile()) {
            return this.isMibFile(absolutePath) ? [absolutePath] : [];
        }

        // 3. 디렉터리인 경우
        if (stats.isDirectory()) {
            return this.scanDirectory(absolutePath);
        }

        return [];
    }

    /**
   * 디렉터리를 재귀적으로 탐색하여 MIB 파일들을 수집합니다.
   */
    private scanDirectory(dirPath: string): string[] {
        let results: string[] = [];
        const list = fs.readdirSync(dirPath);

        for (const file of list) {
            const fullPath = path.join(dirPath, file);
            // collectFiles를 재귀적으로 호출하여 파일/폴더 여부에 따른 처리를 위임합니다.
            const collected = this.collectFiles(fullPath);
            results = results.concat(collected);
        }

        return results;
    }

    /**
     * 파일이 유효한 MIB 확장자를 가졌는지 확인합니다.
     */
    private isMibFile(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase();
        // 정의된 허용 확장자 목록에 포함되어 있는지 확인합니다.
        return this.ALLOWED_EXTENSIONS.includes(ext);
    }
}
