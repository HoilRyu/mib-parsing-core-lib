export type MibNodeType =
    | 'Scalar'
    | 'TableColumn'
    | 'Table'
    | 'TableRow'
    | 'Notification'
    | 'Group'
    | 'ModuleIdentity'
    | 'Node'
    | 'Unknown';

export interface MibSymbolInfo {
    oid: string; // 호출용 OID (Scalar는 .0 포함 가능)
    rawOid: string; // MIB 원본 OID
    name: string;
    type: MibNodeType;
    syntax?: string;
    access?: string;
    description?: string;
}

export interface ModuleParseResult {
    moduleName: string;
    symbols: Record<string, MibSymbolInfo>;
    parsedAt: Date;
}

export interface MergedParseResult {
    modules: string[];
    symbols: Record<string, MibSymbolInfo>;
    parsedAt: Date;
}

export interface ParseError {
    filePath: string;
    error: 'INVALID_EXTENSION' | 'INVALID_FORMAT' | 'PARSE_ERROR' | 'DEPENDENCY_ERROR';
    message: string;
}

export interface ParseResultSummary {
    mode: 'separate' | 'merged';
    modules?: ModuleParseResult[];
    merged?: MergedParseResult;
    errors: ParseError[];
}
