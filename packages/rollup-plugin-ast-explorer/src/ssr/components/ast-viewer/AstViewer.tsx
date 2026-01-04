import type { FC } from 'react'
import type { AstNodeData, FilterOptions } from '@/ssr/types/ast'
import { useCallback, useMemo } from 'react'

import { AstJsonView } from './AstJsonView'
import { AstToolbar } from './AstToolbar'
import { AstTreeView } from './AstTreeView'
import { astToNodeData, collectAllPaths } from './utils'

export interface AstViewerProps {
  ast: unknown
  code?: string
  viewMode: 'tree' | 'json'
  filterOptions: FilterOptions
  selectedPath: string | null
  hoveredPath: string | null
  expandedPaths: Set<string>
  onViewModeChange: (mode: 'tree' | 'json') => void
  onFilterChange: (filter: keyof FilterOptions) => void
  onNodeSelect: (node: AstNodeData) => void
  onNodeHover: (node: AstNodeData | null) => void
  onToggleExpand: (path: string, shiftKey?: boolean) => void
  onCollapseAll: () => void
  onExpandAll: (paths: string[]) => void
}

export const AstViewer: FC<AstViewerProps> = ({
  ast,
  viewMode,
  filterOptions,
  selectedPath,
  hoveredPath,
  expandedPaths,
  onViewModeChange,
  onFilterChange,
  onNodeSelect,
  onNodeHover,
  onToggleExpand,
  onCollapseAll,
  onExpandAll,
}) => {
  // Collect all paths for "expand all" functionality
  const allPaths = useMemo(() => {
    if (!ast)
      return []
    const rootNode = astToNodeData(ast, 'Program', '')
    return collectAllPaths(rootNode)
  }, [ast])

  const handleExpandAll = useCallback(() => {
    onExpandAll(allPaths)
  }, [allPaths, onExpandAll])

  return (
    <div className="flex flex-col h-full">
      <AstToolbar
        viewMode={viewMode}
        filterOptions={filterOptions}
        onViewModeChange={onViewModeChange}
        onFilterChange={onFilterChange}
        onCollapseAll={onCollapseAll}
        onExpandAll={handleExpandAll}
      />

      <div className="flex-1 overflow-hidden">
        {viewMode === 'tree'
          ? (
              <AstTreeView
                ast={ast}
                filterOptions={filterOptions}
                selectedPath={selectedPath}
                hoveredPath={hoveredPath}
                expandedPaths={expandedPaths}
                onNodeSelect={onNodeSelect}
                onNodeHover={onNodeHover}
                onToggleExpand={onToggleExpand}
              />
            )
          : (
              <AstJsonView ast={ast} />
            )}
      </div>
    </div>
  )
}
