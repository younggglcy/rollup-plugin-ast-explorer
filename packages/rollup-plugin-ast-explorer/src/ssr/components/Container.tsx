import type { FC } from 'react'
import type { AstNodeData, FilterOptions } from '@/ssr/types/ast'
import type { ModuleInfosMap } from '@/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useNodeInjection } from '@/ssr/hooks/useNodeInjection'
import { astToNodeData, AstViewer, collectAllPaths, getHighlightRangeFromNode } from './ast-viewer'
import { CodeViewer } from './code-viewer'
import { FileList } from './file-list'
import { Header, ResizablePanelLayout } from './layout'

export interface ContainerProps {
  moduleInfos: ModuleInfosMap
}

export const Container: FC<ContainerProps> = ({ moduleInfos }) => {
  // File list
  const fileList = useMemo(() => Array.from(moduleInfos.keys()), [moduleInfos])
  const [selectedFileId, setSelectedFileId] = useState(() => fileList[0] || null)

  // Panel resize state
  const [isPanelResized, setIsPanelResized] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(0)

  // Current module
  const currentModule = selectedFileId ? moduleInfos.get(selectedFileId) : null
  const code = currentModule?.code || ''
  const ast = currentModule?.ast || null

  // AST Explorer state
  const [selectedNode, setSelectedNode] = useState<AstNodeData | null>(null)
  const [hoveredNode, setHoveredNode] = useState<AstNodeData | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'json'>('tree')
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    hideMethods: true,
    hideEmptyKeys: false,
    hideLocationData: false,
    hideTypeKeys: false,
  })
  const [expandedPaths, setExpandedPaths] = useState(() => new Set(['Program']))

  // Keep selection in sync with module list updates (e.g., SSE removes/renames files)
  useEffect(() => {
    if (!selectedFileId || !moduleInfos.has(selectedFileId)) {
      const next = fileList[0] || null
      if (next !== selectedFileId) {
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- Intentional sync with external data
        setSelectedFileId(next)
        // reset state tied to selection so UI is consistent
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- Intentional sync with external data
        setSelectedNode(null)
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- Intentional sync with external data
        setHoveredNode(null)
        // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect -- Intentional sync with external data
        setExpandedPaths(new Set(['Program']))
      }
    }
  }, [moduleInfos, fileList, selectedFileId])

  // Inject $node for console access
  useNodeInjection(selectedNode, ast)

  // Calculate highlight range from hovered node
  const highlightRange = useMemo(() => {
    if (!hoveredNode)
      return null
    return getHighlightRangeFromNode(hoveredNode, code)
  }, [hoveredNode, code])

  // Handlers
  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFileId(fileId)
    setSelectedNode(null)
    setHoveredNode(null)
    setExpandedPaths(new Set(['Program']))
  }, [])

  const handleNodeSelect = useCallback((node: AstNodeData) => {
    setSelectedNode(node)
  }, [])

  const handleNodeHover = useCallback((node: AstNodeData | null) => {
    setHoveredNode(node)
  }, [])

  const handleViewModeChange = useCallback((mode: 'tree' | 'json') => {
    setViewMode(mode)
  }, [])

  const handleFilterChange = useCallback((filter: keyof FilterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }, [])

  const handleToggleExpand = useCallback((path: string, shiftKey?: boolean) => {
    setExpandedPaths((prev) => {
      const newExpanded = new Set(prev)

      if (shiftKey && ast) {
        // Shift+click: expand entire subtree
        const rootNode = astToNodeData(ast, 'Program', '')
        const findNode = (node: AstNodeData): AstNodeData | null => {
          if (node.path === path)
            return node
          if (node.children) {
            for (const child of node.children) {
              const found = findNode(child)
              if (found)
                return found
            }
          }
          return null
        }
        const targetNode = findNode(rootNode)
        if (targetNode) {
          const subtreePaths = collectAllPaths(targetNode)
          for (const p of subtreePaths) {
            newExpanded.add(p)
          }
        }
      }
      else {
        // Normal click: toggle single node
        if (newExpanded.has(path)) {
          newExpanded.delete(path)
        }
        else {
          newExpanded.add(path)
        }
      }

      return newExpanded
    })
  }, [ast])

  const handleCollapseAll = useCallback(() => {
    setExpandedPaths(new Set(['Program']))
  }, [])

  const handleExpandAll = useCallback((paths: string[]) => {
    setExpandedPaths(new Set(paths))
  }, [])

  const handleResetPanels = useCallback(() => {
    setResetTrigger(prev => prev + 1)
  }, [])

  // Detect language from file extension
  const language = useMemo(() => {
    if (!selectedFileId)
      return 'javascript'
    if (selectedFileId.endsWith('.ts') || selectedFileId.endsWith('.tsx'))
      return 'typescript'
    if (selectedFileId.endsWith('.json'))
      return 'json'
    if (selectedFileId.endsWith('.css'))
      return 'css'
    return 'javascript'
  }, [selectedFileId])

  return (
    <div className="flex flex-col h-full">
      <Header showReset={isPanelResized} onReset={handleResetPanels} />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelLayout
          leftPanel={(
            <FileList
              files={fileList}
              activeFile={selectedFileId}
              onSelect={handleFileSelect}
            />
          )}
          centerPanel={(
            <CodeViewer
              code={code}
              language={language}
              highlightRange={highlightRange}
            />
          )}
          rightPanel={(
            <AstViewer
              ast={ast}
              code={code}
              viewMode={viewMode}
              filterOptions={filterOptions}
              selectedPath={selectedNode?.path || null}
              hoveredPath={hoveredNode?.path || null}
              expandedPaths={expandedPaths}
              onViewModeChange={handleViewModeChange}
              onFilterChange={handleFilterChange}
              onNodeSelect={handleNodeSelect}
              onNodeHover={handleNodeHover}
              onToggleExpand={handleToggleExpand}
              onCollapseAll={handleCollapseAll}
              onExpandAll={handleExpandAll}
            />
          )}
          onResizeStateChange={setIsPanelResized}
          resetTrigger={resetTrigger}
        />
      </div>
    </div>
  )
}
