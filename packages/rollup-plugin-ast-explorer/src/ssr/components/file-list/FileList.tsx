import type { FC } from 'react'
import { FolderTree } from 'lucide-react'

import { ScrollArea } from '@/ssr/components/ui/scroll-area'
import { FileItem } from './FileItem'

export interface FileListProps {
  files: string[]
  activeFile: string | null
  onSelect: (fileId: string) => void
}

export const FileList: FC<FileListProps> = ({ files, activeFile, onSelect }) => {
  if (files.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-neutral-400">
        <FolderTree className="h-8 w-8 mb-2" />
        <span className="text-sm">No files</span>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="py-2">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Files (
          {files.length}
          )
        </div>
        <div className="mt-1">
          {files.map(file => (
            <FileItem
              key={file}
              path={file}
              isActive={file === activeFile}
              onClick={() => onSelect(file)}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
