import type { AstNodeData, FilterOptions, SourceLocation } from '@/ssr/types/ast'

/**
 * Convert an ESTree AST node to our renderable tree structure
 */
export function astToNodeData(
  value: unknown,
  key: string = 'root',
  path: string = '',
): AstNodeData {
  const currentPath = path ? `${path}.${key}` : key

  // Handle null/undefined
  if (value === null) {
    return {
      key,
      path: currentPath,
      value: null,
      type: 'null',
    }
  }

  if (value === undefined) {
    return {
      key,
      path: currentPath,
      value: undefined,
      type: 'undefined',
    }
  }

  // Handle primitives
  if (typeof value !== 'object') {
    return {
      key,
      path: currentPath,
      value,
      type: typeof value,
    }
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return {
      key,
      path: currentPath,
      value,
      type: 'array',
      children: value.map((item, index) =>
        astToNodeData(item, String(index), currentPath),
      ),
    }
  }

  // Handle objects/AST nodes
  const obj = value as Record<string, unknown>
  const nodeType = typeof obj.type === 'string' ? obj.type : 'object'

  const children: AstNodeData[] = []
  for (const [k, v] of Object.entries(obj)) {
    children.push(astToNodeData(v, k, currentPath))
  }

  return {
    key,
    path: currentPath,
    value,
    type: nodeType,
    start: typeof obj.start === 'number' ? obj.start : undefined,
    end: typeof obj.end === 'number' ? obj.end : undefined,
    loc: isSourceLocation(obj.loc) ? obj.loc : undefined,
    children: children.length > 0 ? children : undefined,
  }
}

function isSourceLocation(loc: unknown): loc is SourceLocation {
  return (
    typeof loc === 'object'
    && loc !== null
    && 'start' in loc
    && 'end' in loc
    && typeof (loc as SourceLocation).start === 'object'
    && typeof (loc as SourceLocation).end === 'object'
  )
}

/**
 * Check if a node should be filtered out based on options
 */
export function shouldFilterNode(node: AstNodeData, options: FilterOptions): boolean {
  // Hide location data
  if (options.hideLocationData && ['loc', 'start', 'end', 'range'].includes(node.key)) {
    return true
  }

  // Hide empty keys
  if (options.hideEmptyKeys && isEmpty(node.value)) {
    return true
  }

  // Hide methods (functions)
  if (options.hideMethods && typeof node.value === 'function') {
    return true
  }

  // Hide type keys
  if (options.hideTypeKeys && node.key === 'type') {
    return true
  }

  return false
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined)
    return true
  if (Array.isArray(value) && value.length === 0)
    return true
  if (typeof value === 'object' && Object.keys(value as object).length === 0)
    return true
  return false
}

/**
 * Collect all paths in the AST tree for "expand all" functionality
 */
export function collectAllPaths(node: AstNodeData): string[] {
  const paths: string[] = [node.path]

  if (node.children) {
    for (const child of node.children) {
      paths.push(...collectAllPaths(child))
    }
  }

  return paths
}

/**
 * Get highlight range from AST node location info
 */
export function getHighlightRangeFromNode(
  node: AstNodeData,
  code?: string,
): { startLine: number, startColumn: number, endLine: number, endColumn: number } | null {
  // Prefer loc (line/column info)
  if (node.loc) {
    return {
      startLine: node.loc.start.line,
      startColumn: node.loc.start.column,
      endLine: node.loc.end.line,
      endColumn: node.loc.end.column,
    }
  }

  // Fall back to start/end (character offsets)
  if (typeof node.start === 'number' && typeof node.end === 'number' && code) {
    const startPos = offsetToPosition(code, node.start)
    const endPos = offsetToPosition(code, node.end)
    return {
      startLine: startPos.line,
      startColumn: startPos.column,
      endLine: endPos.line,
      endColumn: endPos.column,
    }
  }

  // Try to get from value if it's an AST node
  if (node.value && typeof node.value === 'object') {
    const val = node.value as Record<string, unknown>
    if (val.loc && isSourceLocation(val.loc)) {
      return {
        startLine: val.loc.start.line,
        startColumn: val.loc.start.column,
        endLine: val.loc.end.line,
        endColumn: val.loc.end.column,
      }
    }
  }

  return null
}

function offsetToPosition(code: string, offset: number): { line: number, column: number } {
  let line = 1
  let column = 0

  for (let i = 0; i < offset && i < code.length; i++) {
    if (code[i] === '\n') {
      line++
      column = 0
    }
    else {
      column++
    }
  }

  return { line, column }
}

/**
 * Generate a summary of node children for collapsed view
 */
export function getNodeChildrenSummary(node: AstNodeData): string {
  if (!node.children || node.children.length === 0)
    return ''

  // For arrays, show count
  if (node.type === 'array') {
    return `[${node.children.length}]`
  }

  // For objects, show key names
  const keys = node.children
    .filter(child => !['loc', 'start', 'end', 'range'].includes(child.key))
    .map(child => child.key)
    .slice(0, 5)

  const suffix = node.children.length > 5 ? `, ... +${node.children.length - 5}` : ''
  return `{${keys.join(', ')}${suffix}}`
}
