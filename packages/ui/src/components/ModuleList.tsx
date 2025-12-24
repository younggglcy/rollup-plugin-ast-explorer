import type { ModuleMetadata } from '@rollup-plugin-ast-explorer/shared'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

interface ModuleListProps {
  modules: ModuleMetadata[]
  selectedModuleId: string | null
  onSelectModule: (id: string) => void
}

export function ModuleList({ modules, selectedModuleId, onSelectModule }: ModuleListProps) {
  const [search, setSearch] = useState('')

  const filteredModules = modules.filter(m =>
    m.id.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-full flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Modules</h2>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search modules..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {filteredModules.length}
          {' '}
          module
          {filteredModules.length !== 1 ? 's' : ''}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredModules.map(module => (
            <button
              type="button"
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-colors',
                selectedModuleId === module.id && 'bg-gray-200 font-medium',
              )}
            >
              <div className="truncate">{module.id}</div>
              {module.isEntry && (
                <span className="text-xs text-blue-600">Entry</span>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
