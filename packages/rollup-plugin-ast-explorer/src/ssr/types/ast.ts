export interface SourceLocation {
  start: Position
  end: Position
}

export interface Position {
  line: number
  column: number
}

export interface AstNodeData {
  key: string
  path: string
  value: unknown
  type: string
  start?: number
  end?: number
  loc?: SourceLocation
  children?: AstNodeData[]
}

export interface HighlightRange {
  startLine: number
  startColumn: number
  endLine: number
  endColumn: number
}

export interface FilterOptions {
  hideMethods: boolean
  hideEmptyKeys: boolean
  hideLocationData: boolean
  hideTypeKeys: boolean
}

export interface AstExplorerState {
  selectedModuleId: string | null
  selectedNode: AstNodeData | null
  hoveredNode: AstNodeData | null
  viewMode: 'tree' | 'json'
  filterOptions: FilterOptions
  expandedPaths: Set<string>
}

export type AstExplorerAction
  = | { type: 'SELECT_MODULE', moduleId: string }
    | { type: 'SELECT_NODE', node: AstNodeData | null }
    | { type: 'HOVER_NODE', node: AstNodeData | null }
    | { type: 'SET_VIEW_MODE', mode: 'tree' | 'json' }
    | { type: 'TOGGLE_FILTER', filter: keyof FilterOptions }
    | { type: 'TOGGLE_EXPAND', path: string }
    | { type: 'EXPAND_TO_PATH', path: string }
    | { type: 'COLLAPSE_ALL' }
    | { type: 'EXPAND_ALL', paths: string[] }
