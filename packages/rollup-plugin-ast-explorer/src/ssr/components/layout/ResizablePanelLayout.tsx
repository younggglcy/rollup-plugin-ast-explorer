import type { FC, ReactNode } from 'react'
import { useCallback, useRef, useState } from 'react'

import { cn } from '@/ssr/lib/utils'

export interface ResizablePanelLayoutProps {
  leftPanel: ReactNode
  centerPanel: ReactNode
  rightPanel: ReactNode
  leftDefaultWidth?: number
  rightDefaultWidth?: number
}

interface ResizeHandleProps {
  onResize: (delta: number) => void
}

const ResizeHandle: FC<ResizeHandleProps> = ({ onResize }) => {
  const handleRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)

    const startX = e.clientX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      onResize(delta)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onResize])

  return (
    <div
      ref={handleRef}
      className={cn(
        'w-1 cursor-col-resize bg-neutral-200 dark:bg-neutral-800 hover:bg-blue-500 transition-colors flex-shrink-0',
        isDragging && 'bg-blue-500',
      )}
      onMouseDown={handleMouseDown}
    />
  )
}

export const ResizablePanelLayout: FC<ResizablePanelLayoutProps> = ({
  leftPanel,
  centerPanel,
  rightPanel,
  leftDefaultWidth = 200,
  rightDefaultWidth = 400,
}) => {
  const [leftWidth, setLeftWidth] = useState(leftDefaultWidth)
  const [rightWidth, setRightWidth] = useState(rightDefaultWidth)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth(prev => Math.max(100, Math.min(prev + delta, 400)))
  }, [])

  const handleRightResize = useCallback((delta: number) => {
    setRightWidth(prev => Math.max(200, Math.min(prev - delta, 800)))
  }, [])

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden">
      {/* Left Panel - File List */}
      <div
        className="flex-shrink-0 overflow-hidden bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"
        style={{ width: leftWidth }}
      >
        {leftPanel}
      </div>

      <ResizeHandle onResize={handleLeftResize} />

      {/* Center Panel - Code Viewer */}
      <div className="flex-1 min-w-0 overflow-hidden bg-white dark:bg-neutral-950">
        {centerPanel}
      </div>

      <ResizeHandle onResize={handleRightResize} />

      {/* Right Panel - AST Viewer */}
      <div
        className="flex-shrink-0 overflow-hidden bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800"
        style={{ width: rightWidth }}
      >
        {rightPanel}
      </div>
    </div>
  )
}
