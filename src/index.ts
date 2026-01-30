import * as path from 'path';
import { FileHandler } from './input/file-handler';
import { ZipHandler, ZipParseResult } from './input/zip-handler';

export interface UnifiedInputResult {
    filePaths: string[];
    cleanup: () => void;
}

/**
 * 다양한 형태의 입력을 받아 MIB 파일 목록을 반환하는 통합 함수입니다.
 * @param input 단일 경로 또는 경로 배열
 * @returns 파일 목록과 정리 함수 (ZIP인 경우에만 실제 동작)
 */
export function collectAllMibFiles(input: string | string[]): UnifiedInputResult {
    const inputs = Array.isArray(input) ? input : [input];
    const fileHandler = new FileHandler();
    const zipHandler = new ZipHandler();

    let allFilePaths: string[] = [];
    const cleanups: Array<() => void> = [];

    for (const inputPath of inputs) {
        if (inputPath.toLowerCase().endsWith('.zip')) {
            const { filePaths, cleanup } = zipHandler.extractAndCollect(inputPath);
            allFilePaths = allFilePaths.concat(filePaths);
            cleanups.push(cleanup);
        } else {
            const filePaths = fileHandler.collectFiles(inputPath);
            allFilePaths = allFilePaths.concat(filePaths);
        }
    }

    // 중복 제거 및 절대 경로화
    const uniquePaths = Array.from(new Set(allFilePaths.map(p => path.resolve(p))));

    return {
        filePaths: uniquePaths,
        cleanup: () => {
            cleanups.forEach(c => c());
        },
    };
}

export * from './input/file-handler';
export * from './input/zip-handler';
