import type { Node } from 'estree'

/**
 * Sanitizes an AST by removing circular references and heavy fields
 * that should not be sent to the client
 */
export function sanitizeAST(ast: Node | null): Node | null {
  if (!ast)
    return null

  // Fields to remove from nodes
  const fieldsToRemove = new Set([
    'parent',
    'scope',
    'start',
    'end',
    'leadingComments',
    'trailingComments',
    'innerComments',
  ])

  function sanitizeNode(node: any, visited = new WeakSet()): any {
    if (node === null || node === undefined)
      return node
    if (typeof node !== 'object')
      return node
    if (visited.has(node))
      return null // Handle circular references

    visited.add(node)

    const sanitized: any = Array.isArray(node) ? [] : {}

    for (const key in node) {
      if (fieldsToRemove.has(key))
        continue

      const value = node[key]
      if (Array.isArray(value)) {
        sanitized[key] = value.map(item => sanitizeNode(item, visited))
      }
      else if (value && typeof value === 'object') {
        sanitized[key] = sanitizeNode(value, visited)
      }
      else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  return sanitizeNode(ast)
}
