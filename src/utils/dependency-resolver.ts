import * as fs from 'fs';
import * as path from 'path';

export interface MibFileInfo {
    filePath: string;
    moduleName: string;
    dependencies: string[];
}

export class DependencyResolver {
    private fileMap: Map<string, MibFileInfo> = new Map(); // moduleName -> info
    private searchDirs: string[] = [];

    constructor(searchDirs: string[] = []) {
        this.searchDirs = searchDirs;
    }

    /**
     * MIB 파일의 텍스트에서 모듈명과 IMPORTS를 추출합니다.
     */
    public parseMibHeader(filePath: string): MibFileInfo | null {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');

            // 1. 모듈명 추출 (ModuleName DEFINITIONS ::= BEGIN)
            const moduleNameMatch = content.match(/^\s*([A-Za-z0-9-]+)\s+DEFINITIONS\s*::=\s*BEGIN/m);
            if (!moduleNameMatch || !moduleNameMatch[1]) return null;
            const moduleName = moduleNameMatch[1];

            // 2. IMPORTS 추출
            const dependencies: string[] = [];
            const importsMatch = content.match(/IMPORTS\s+([\s\S]*?);/m);
            if (importsMatch && importsMatch[1]) {
                const importsBody = importsMatch[1];
                // Symbols FROM ModuleName 패턴 찾기
                const fromMatches = importsBody.matchAll(/FROM\s+([A-Za-z0-9-]+)/g);
                for (const match of fromMatches) {
                    if (match[1]) {
                        const depModule = match[1];
                        if (!dependencies.includes(depModule)) {
                            dependencies.push(depModule);
                        }
                    }
                }
            }

            return {
                filePath,
                moduleName,
                dependencies,
            };
        } catch (error) {
            console.warn(`Failed to parse MIB header: ${filePath}`, error);
            return null;
        }
    }

    /**
     * 지정된 파일들을 분석하여 최적의 로드 순서를 반환합니다.
     * 필요 시 표준 MIB 디렉토리에서 의존성을 추가로 찾습니다.
     */
    public resolveOrder(filePaths: string[]): string[] {
        this.fileMap.clear();
        const pendingFiles = [...filePaths];
        const visitedModules = new Set<string>();

        // 1. 초기 파일들 분석
        while (pendingFiles.length > 0) {
            const filePath = pendingFiles.shift()!;
            const info = this.parseMibHeader(filePath);
            if (info) {
                if (!this.fileMap.has(info.moduleName)) {
                    this.fileMap.set(info.moduleName, info);

                    // 추가로 필요한 의존성이 있는지 확인 (표준 MIB 탐색)
                    for (const dep of info.dependencies) {
                        if (!this.fileMap.has(dep) && !visitedModules.has(dep)) {
                            // 검색 디렉토리들에서 파일 찾기
                            const depFile = this.findStandardMib(dep);
                            if (depFile) {
                                pendingFiles.push(depFile);
                            }
                            visitedModules.add(dep);
                        }
                    }
                }
            }
        }

        // 2. 위상 정렬 (DFS 알고리즘)
        const result: string[] = [];
        const state: Map<string, 'VISITING' | 'VISITED'> = new Map();

        const visit = (moduleName: string) => {
            if (state.get(moduleName) === 'VISITING') {
                throw new Error(`Circular dependency detected: ${moduleName}`);
            }
            if (state.get(moduleName) === 'VISITED') return;

            state.set(moduleName, 'VISITING');
            const info = this.fileMap.get(moduleName);
            if (info) {
                for (const dep of info.dependencies) {
                    // 의존성이 fileMap에 있는 경우에만 방문
                    if (this.fileMap.has(dep)) {
                        visit(dep);
                    }
                }
            }

            state.set(moduleName, 'VISITED');
            result.push(moduleName);
        };

        for (const moduleName of this.fileMap.keys()) {
            if (!state.has(moduleName)) {
                visit(moduleName);
            }
        }

        // 모듈명을 실제 파일 경로로 변환
        return result.map(mod => this.fileMap.get(mod)!.filePath);
    }

    private findStandardMib(moduleName: string): string | null {
        for (const dir of this.searchDirs) {
            if (!fs.existsSync(dir)) continue;

            // 일반적인 확장자들 시도
            const extensions = ['.txt', '.mib', '.my'];
            for (const ext of extensions) {
                const fullPath = path.join(dir, moduleName + ext);
                if (fs.existsSync(fullPath)) return fullPath;
            }

            // 대소문자 구분 없이 찾기
            try {
                const files = fs.readdirSync(dir);
                const matched = files.find(f => {
                    const base = path.basename(f, path.extname(f));
                    return base.toLowerCase() === moduleName.toLowerCase();
                });
                if (matched) return path.join(dir, matched);
            } catch (e) {
                // ignore
            }
        }

        return null;
    }
}
