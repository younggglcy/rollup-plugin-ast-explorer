import type { Node } from 'estree'
import { useEffect, useState } from 'react'
import { ASTViewer } from './components/ASTViewer'
import { CodeViewer } from './components/CodeViewer'
import { ModuleList } from './components/ModuleList'
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
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading modules...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">
          Error:
          {' '}
          {error}
        </div>
      </div>
    )
  }

  if (modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No modules found</h2>
          <p className="text-gray-500">
            Make sure the Rollup plugin is running and has parsed some modules.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-900 text-white px-6 py-4 border-b">
        <h1 className="text-xl font-bold">Rollup AST Explorer</h1>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80">
          <ModuleList
            modules={modules}
            selectedModuleId={selectedModuleId}
            onSelectModule={setSelectedModuleId}
          />
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 border-r">
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 border-b bg-gray-50">
                <h3 className="font-semibold">AST Tree</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <ASTViewer ast={ast} onNodeClick={setSelectedNode} />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="h-full flex flex-col">
              <div className="px-4 py-2 border-b bg-gray-50">
                <h3 className="font-semibold">Source Code</h3>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeViewer
                  code={code}
                  highlightedNode={selectedNode}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
