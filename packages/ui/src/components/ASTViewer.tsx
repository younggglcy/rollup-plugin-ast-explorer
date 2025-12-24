import type { Node } from 'estree'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { ScrollArea } from './ui/scroll-area'

interface ASTViewerProps {
  ast: Node | null
  onNodeClick?: (node: Node) => void
}

interface TreeNodeProps {
  node: any
  depth: number
  onNodeClick?: (node: Node) => void
  path?: string
}

function TreeNode({ node, depth, onNodeClick, path = '' }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (!node || typeof node !== 'object') {
    return (
      <div className="text-xs text-gray-600 font-mono">
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
  const currentPath = path ? `${path}.${nodeType}` : nodeType

  return (
    <div className="text-xs font-mono">
      <div
        className="flex items-start hover:bg-blue-50 cursor-pointer py-0.5"
        style={{ paddingLeft: `${depth * 12}px` }}
        onClick={(e) => {
          e.stopPropagation()
          setExpanded(!expanded)
          if (onNodeClick && node.type) {
            onNodeClick(node)
          }
        }}
      >
        <span className="text-gray-400 mr-1 flex-shrink-0 w-3">
          {hasChildren && (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          )}
        </span>
        <span className="text-blue-600 font-medium">{nodeType}</span>
        {node.name && (
          <span className="text-purple-600 ml-1">
            {' '}
            &quot;
            {node.name}
            &quot;
          </span>
        )}
        {node.operator && (
          <span className="text-green-600 ml-1">
            {' '}
            {node.operator}
          </span>
        )}
        {node.value !== undefined && typeof node.value !== 'object' && (
          <span className="text-orange-600 ml-1">
            {' '}
            =
            {' '}
            {JSON.stringify(node.value)}
          </span>
        )}
        {node.kind && (
          <span className="text-gray-500 ml-1">
            {' '}
            (
            {node.kind}
            )
          </span>
        )}
      </div>

      {expanded && (
        <div>
          {Object.keys(node).map((key) => {
            if (key === 'type' || key === 'loc' || key === 'range')
              return null

            const value = node[key]

            if (Array.isArray(value)) {
              if (value.length === 0)
                return null
              return (
                <div key={key}>
                  <div
                    className="text-gray-500 text-xs font-mono"
                    style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                  >
                    {key}
                    {' '}
                    [
                    {value.length}
                    ]
                  </div>
                  {value.map((item, idx) => (
                    <TreeNode
                      key={`${currentPath}.${key}[${idx}]`}
                      node={item}
                      depth={depth + 2}
                      onNodeClick={onNodeClick}
                      path={`${currentPath}.${key}[${idx}]`}
                    />
                  ))}
                </div>
              )
            }

            if (typeof value === 'object' && value !== null) {
              return (
                <div key={key}>
                  <div
                    className="text-gray-500 text-xs font-mono"
                    style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                  >
                    {key}
                  </div>
                  <TreeNode
                    node={value}
                    depth={depth + 2}
                    onNodeClick={onNodeClick}
                    path={`${currentPath}.${key}`}
                  />
                </div>
              )
            }

            if (value !== undefined && value !== null) {
              return (
                <div
                  key={key}
                  className="text-gray-600 text-xs font-mono"
                  style={{ paddingLeft: `${(depth + 1) * 12}px` }}
                >
                  {key}
                  :
                  {' '}
                  {typeof value === 'string' ? `"${value}"` : String(value)}
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
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <div className="text-lg mb-2">No AST available</div>
          <div className="text-sm">Select a module to view its AST</div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full bg-white">
      <div className="p-3">
        <TreeNode node={ast} depth={0} onNodeClick={onNodeClick} />
      </div>
    </ScrollArea>
  )
}
