import type { Node } from 'estree'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from './ui/scroll-area'

interface ASTViewerProps {
  ast: Node | null
  onNodeClick?: (node: Node) => void
}

interface TreeNodeProps {
  node: any
  depth: number
  onNodeClick?: (node: Node) => void
}

function TreeNode({ node, depth, onNodeClick }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (!node || typeof node !== 'object') {
    return (
      <div className="text-sm text-gray-500 ml-4">
        {JSON.stringify(node)}
      </div>
    )
  }

  const hasChildren = Object.keys(node).some((key) => {
    const value = node[key]
    return (
      typeof value === 'object'
      && value !== null
      && key !== 'loc'
      && key !== 'range'
    )
  })

  const nodeType = node.type || 'Unknown'

  return (
    <div className="text-sm">
      <button
        type="button"
        onClick={() => {
          setExpanded(!expanded)
          if (onNodeClick && node.type) {
            onNodeClick(node)
          }
        }}
        className={cn(
          'flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded w-full text-left transition-colors',
          onNodeClick && 'cursor-pointer',
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {hasChildren && (
          <span className="text-gray-400">
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {!hasChildren && <span className="w-3.5" />}
        <span className="font-medium text-blue-600">{nodeType}</span>
        {node.name && (
          <span className="text-gray-600 ml-1">
            (
            {node.name}
            )
          </span>
        )}
        {node.operator && (
          <span className="text-purple-600 ml-1">
            {node.operator}
          </span>
        )}
        {node.value !== undefined && typeof node.value !== 'object' && (
          <span className="text-green-600 ml-1">
            =
            {' '}
            {JSON.stringify(node.value)}
          </span>
        )}
      </button>

      {expanded && (
        <div>
          {Object.keys(node).map((key) => {
            if (key === 'type' || key === 'loc' || key === 'range')
              return null

            const value = node[key]

            if (Array.isArray(value)) {
              return (
                <div key={key}>
                  <div
                    className="text-gray-500 text-xs ml-4"
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                  >
                    {key}
                    :
                  </div>
                  {value.map((item, idx) => (
                    <TreeNode
                      key={`${key}-${idx}`}
                      node={item}
                      depth={depth + 1}
                      onNodeClick={onNodeClick}
                    />
                  ))}
                </div>
              )
            }

            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <div
                    className="text-gray-500 text-xs ml-4"
                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                  >
                    {key}
                    :
                  </div>
                  <TreeNode
                    node={value}
                    depth={depth + 1}
                    onNodeClick={onNodeClick}
                  />
                </div>
              )
            }

            return null
          })}
        </div>
      )}
    </div>
  )
}

export function ASTViewer({ ast, onNodeClick }: ASTViewerProps) {
  if (!ast) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No AST available
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <TreeNode node={ast} depth={0} onNodeClick={onNodeClick} />
      </div>
    </ScrollArea>
  )
}
