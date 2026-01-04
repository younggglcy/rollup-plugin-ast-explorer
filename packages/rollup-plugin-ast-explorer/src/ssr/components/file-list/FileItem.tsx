import type { FC } from 'react'
import { FileIcon } from 'lucide-react'

import { cn } from '@/ssr/lib/utils'

export interface FileItemProps {
  path: string
  isActive: boolean
  onClick: () => void
}

export const FileItem: FC<FileItemProps> = ({ path, isActive, onClick }) => {
  const fileName = path.split('/').pop() || path
  const directory = path.includes('/') ? path.slice(0, path.lastIndexOf('/')) : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors',
        'text-neutral-700 dark:text-neutral-200',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        isActive && 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      )}
      title={path}
    >
      <FileIcon className="h-4 w-4 flex-shrink-0 text-neutral-400" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{fileName}</div>
        {directory && (
          <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">
            {directory}
          </div>
        )}
      </div>
    </button>
  )
}
