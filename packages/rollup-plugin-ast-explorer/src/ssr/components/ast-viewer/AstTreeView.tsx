import type { FC } from 'react'
import type { AstNodeData, FilterOptions } from '@/ssr/types/ast'
import { useCallback, useMemo } from 'react'

import { ScrollArea } from '@/ssr/components/ui/scroll-area'
import { AstNode } from './AstNode'
import { astToNodeData } from './utils'

export interface AstTreeViewProps {
  ast: unknown
  filterOptions: FilterOptions
  selectedPath: string | null
  hoveredPath: string | null
  expandedPaths: Set<string>
  onNodeSelect: (node: AstNodeData) => void
  onNodeHover: (node: AstNodeData | null) => void
  onToggleExpand: (path: string, shiftKey?: boolean) => void
}

export const AstTreeView: FC<AstTreeViewProps> = ({
  ast,
  filterOptions,
  selectedPath,
  hoveredPath,
  expandedPaths,
  onNodeSelect,
  onNodeHover,
  onToggleExpand,
}) => {
  // Convert AST to renderable tree structure
  const rootNode = useMemo(() => {
    if (!ast)
      return null
    return astToNodeData(ast, 'Program', '')
  }, [ast])

  // Recursive render function
  const renderNode = useCallback((node: AstNodeData, depth: number) => {
    const isExpanded = expandedPaths.has(node.path)
    const isSelected = selectedPath === node.path
    const isHovered = hoveredPath === node.path

    return (
      <AstNode
        key={node.path}
        node={node}
        depth={depth}
        isExpanded={isExpanded}
        isSelected={isSelected}
        isHovered={isHovered}
        filterOptions={filterOptions}
        onSelect={() => onNodeSelect(node)}
        onHover={hovering => onNodeHover(hovering ? node : null)}
        onToggleExpand={(e) => {
          e.stopPropagation()
          onToggleExpand(node.path, e.shiftKey)
        }}
        renderChildren={() =>
          node.children?.map(child => renderNode(child, depth + 1))}
      />
    )
  }, [expandedPaths, selectedPath, hoveredPath, filterOptions, onNodeSelect, onNodeHover, onToggleExpand])

  if (!rootNode) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        No AST available
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 font-mono text-sm">
        {renderNode(rootNode, 0)}
      </div>
    </ScrollArea>
  )
}
