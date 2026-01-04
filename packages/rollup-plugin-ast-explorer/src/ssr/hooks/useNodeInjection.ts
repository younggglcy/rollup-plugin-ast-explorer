import type { AstNodeData } from '@/ssr/types/ast'

import { useEffect } from 'react'
import { isNodeEnv } from '@/constants'

declare global {
  interface Window {
    $node: unknown
    $ast: unknown
  }
}

/**
 * Hook to inject selected AST node into window.$node for console access
 */
export function useNodeInjection(
  selectedNode: AstNodeData | null,
  ast: unknown,
) {
  useEffect(() => {
    if (isNodeEnv)
      return

    // Inject selected node
    window.$node = selectedNode?.value ?? null

    // Inject full AST
    window.$ast = ast

    // Log to console when node changes
    if (selectedNode) {
      // eslint-disable-next-line no-console
      console.log(
        '%c$node updated',
        'color: #4CAF50; font-weight: bold;',
        selectedNode.value,
      )
    }
  }, [selectedNode, ast])
}
