import type { ModuleMetadata } from '@rollup-plugin-ast-explorer/shared'

interface ToolbarProps {
  modules: ModuleMetadata[]
  selectedModuleId: string | null
  onSelectModule: (id: string) => void
}

export function Toolbar({ modules, selectedModuleId, onSelectModule }: ToolbarProps) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3 flex items-center gap-4">
      <div className="font-semibold text-gray-700">Rollup AST Explorer</div>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <label htmlFor="module-select" className="text-sm text-gray-600">
          Module:
        </label>
        <select
          id="module-select"
          value={selectedModuleId || ''}
          onChange={e => onSelectModule(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.id}
              {module.isEntry ? ' (entry)' : ''}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
