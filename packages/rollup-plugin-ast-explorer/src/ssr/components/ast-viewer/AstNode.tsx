import type { FC, ReactNode } from 'react'
import type { AstNodeData, FilterOptions } from '@/ssr/types/ast'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { memo } from 'react'

import { cn } from '@/ssr/lib/utils'
import { AstNodeValue } from './AstNodeValue'
import { getNodeChildrenSummary, shouldFilterNode } from './utils'

export interface AstNodeProps {
  node: AstNodeData
  depth: number
  isExpanded: boolean
  isSelected: boolean
  isHovered: boolean
  filterOptions: FilterOptions
  onSelect: () => void
  onHover: (hovering: boolean) => void
  onToggleExpand: (e: React.MouseEvent) => void
  renderChildren: () => ReactNode
}

export const AstNode: FC<AstNodeProps> = memo(({
  node,
  depth,
  isExpanded,
  isSelected,
  isHovered,
  filterOptions,
  onSelect,
  onHover,
  onToggleExpand,
  renderChildren,
}) => {
  // Check if this node should be filtered
  if (shouldFilterNode(node, filterOptions)) {
    return null
  }

  const hasChildren = node.children && node.children.length > 0
  const isAstNode = typeof node.value === 'object'
    && node.value !== null
    && 'type' in (node.value as Record<string, unknown>)
    && typeof (node.value as Record<string, unknown>).type === 'string'

  const nodeType = isAstNode
    ? (node.value as Record<string, unknown>).type as string
    : null

  // Check if it's the root 'type' key (we want to show it as a badge instead)
  const isTypeKey = node.key === 'type' && typeof node.value === 'string'

  return (
    <div className="ast-node">
      <div
        className={cn(
          'flex items-center h-6 cursor-pointer select-none rounded-sm transition-colors',
          'hover:bg-neutral-100 dark:hover:bg-neutral-800',
          isSelected && 'bg-blue-100 dark:bg-blue-900/50',
          isHovered && !isSelected && 'bg-yellow-100/50 dark:bg-yellow-900/30',
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onClick={onSelect}
      >
        {/* Expand/Collapse toggle */}
        {hasChildren
          ? (
              <button
                type="button"
                className="w-4 h-4 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                onClick={onToggleExpand}
              >
                {isExpanded
                  ? <ChevronDown className="w-3 h-3" />
                  : <ChevronRight className="w-3 h-3" />}
              </button>
            )
          : (
              <span className="w-4" />
            )}

        {/* Key name */}
        <span className="text-purple-600 dark:text-purple-400 mr-1 font-mono text-sm">
          {node.key}
        </span>

        <span className="text-neutral-400 mr-1">:</span>

        {/* Node type badge for AST nodes */}
        {nodeType && !isTypeKey && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 rounded font-medium">
            {nodeType}
          </span>
        )}

        {/* Type key value */}
        {isTypeKey && (
          <span className="text-orange-600 dark:text-orange-400 font-mono text-sm">
            &quot;
            {node.value as string}
            &quot;
          </span>
        )}

        {/* Simple value for leaf nodes */}
        {!hasChildren && !isAstNode && !isTypeKey && (
          <span className="font-mono text-sm">
            <AstNodeValue value={node.value} />
          </span>
        )}

        {/* Children summary when collapsed */}
        {hasChildren && !isExpanded && (
          <span className="ml-2 text-neutral-400 text-xs font-mono">
            {getNodeChildrenSummary(node)}
          </span>
        )}

        {/* Selected indicator */}
        {isSelected && (
          <span className="ml-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            = $node
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ast-node-children">
          {renderChildren()}
        </div>
      )}
    </div>
  )
})

AstNode.displayName = 'AstNode'
