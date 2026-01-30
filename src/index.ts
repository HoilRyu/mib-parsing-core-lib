import * as path from 'path';
import { FileHandler } from './input/file-handler';
import { ZipHandler } from './input/zip-handler';
import { MibParser } from './core/mib-parser';
import { ParseResultSummary, MibSymbolInfo } from './types';

export interface ParseOptions {
    mode: 'separate' | 'merged';
}

/**
 * MIB 입력을 받아 파싱 결과를 반환합니다.
 * @param input 파일/폴더 경로 또는 경로 배열
 * @param options 파싱 옵션 (기본값: merged)
 */
export function parseMib(
    input: string | string[],
    options: ParseOptions = { mode: 'merged' }
): ParseResultSummary {
    const { filePaths, cleanup } = collectAllMibFiles(input);
    const parser = new MibParser();

    // 2. 파싱 (Phase 3 연동)
    for (const file of filePaths) {
        try {
            parser.loadModule(file);
        } catch (error) {
            console.warn(`Failed to load ${file}:`, error);
        }
    }

    const result: ParseResultSummary = {
        mode: options.mode,
        errors: [],
    };

    const loadedModules = parser.getLoadedModules();

    if (options.mode === 'merged') {
        const mergedSymbols: Record<string, MibSymbolInfo> = {};
        for (const modName of loadedModules) {
            const modRes = parser.getModuleResults(modName);
            if (modRes) {
                Object.assign(mergedSymbols, modRes.symbols);
            }
        }
        result.merged = {
            modules: loadedModules,
            symbols: mergedSymbols,
            parsedAt: new Date(),
        };
    } else {
        result.modules = loadedModules
            .map((modName) => parser.getModuleResults(modName)!)
            .filter((m) => m !== null);
    }

    // ZIP 임시 파일 정리
    cleanup();

    return result;
}

export interface UnifiedInputResult {
    filePaths: string[];
    cleanup: () => void;
}

/**
 * 다양한 형태의 입력을 받아 MIB 파일 목록을 반환하는 통합 함수입니다.
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

    const uniquePaths = Array.from(new Set(allFilePaths.map((p) => path.resolve(p))));

    return {
        filePaths: uniquePaths,
        cleanup: () => {
            cleanups.forEach((c) => c());
        },
    };
}

export * from './types';
export * from './core/mib-parser';
export * from './input/file-handler';
export * from './input/zip-handler';
export * from './utils/type-detector';
export * from './utils/oid-formatter';
