import type { Node } from 'estree'
import { useEffect, useState } from 'react'
import { ASTViewer } from './components/ASTViewer'
import { CodeViewer } from './components/CodeViewer'
import { Toolbar } from './components/Toolbar'
import { useModules } from './hooks/useModules'
import { fetchAST } from './lib/api'

function App() {
  const { modules, loading, error } = useModules()
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [ast, setAst] = useState<Node | null>(null)
  const [code, setCode] = useState<string | null | undefined>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Auto-select first module
  useEffect(() => {
    if (modules.length > 0 && !selectedModuleId) {
      const firstModule = modules[0]
      setSelectedModuleId(firstModule.id)
    }
  }, [modules, selectedModuleId])

  // Load AST when module is selected
  useEffect(() => {
    if (selectedModuleId) {
      fetchAST(selectedModuleId)
        .then((data) => {
          setAst(data.ast)
          setCode(data.code)
          setSelectedNode(null)
        })
        .catch((err) => {
          console.error('Failed to load AST:', err)
          setAst(null)
          setCode(null)
        })
    }
  }, [selectedModuleId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading modules...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-600 text-center">
          <div className="text-xl font-semibold mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">No modules found</h2>
          <p className="text-gray-500">
            Make sure the Rollup plugin is running and has parsed some modules.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar
        modules={modules}
        selectedModuleId={selectedModuleId}
        onSelectModule={setSelectedModuleId}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 border-b border-gray-200">
          <CodeViewer
            code={code}
            highlightedNode={selectedNode}
          />
        </div>
        <div className="flex-1">
          <ASTViewer ast={ast} onNodeClick={setSelectedNode} />
        </div>
      </div>
    </div>
  )
}

export default App
