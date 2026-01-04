import type { FC, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/ssr/lib/utils'

export interface ResizablePanelLayoutProps {
  leftPanel: ReactNode
  centerPanel: ReactNode
  rightPanel: ReactNode
  leftDefaultWidth?: number
  rightDefaultWidth?: number
  onResizeStateChange?: (isResized: boolean) => void
  resetTrigger?: number
}

interface ResizeHandleProps {
  onDrag: (deltaX: number) => void
}

const ResizeHandle: FC<ResizeHandleProps> = ({ onDrag }) => {
  const [isDragging, setIsDragging] = useState(false)
  const lastXRef = useRef(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    lastXRef.current = e.clientX

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - lastXRef.current
      lastXRef.current = moveEvent.clientX
      onDrag(deltaX)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onDrag])

  return (
    <div
      className={cn(
        'w-1.5 cursor-col-resize bg-neutral-200 dark:bg-neutral-700 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors flex-shrink-0',
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
  onResizeStateChange,
  resetTrigger,
}) => {
  const [leftWidth, setLeftWidth] = useState(leftDefaultWidth)
  const [rightWidth, setRightWidth] = useState(rightDefaultWidth)

  // Track if panels have been resized
  const isResized = leftWidth !== leftDefaultWidth || rightWidth !== rightDefaultWidth

  // Notify parent when resize state changes
  useEffect(() => {
    onResizeStateChange?.(isResized)
  }, [isResized, onResizeStateChange])

  // Reset panels when resetTrigger changes
  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      setLeftWidth(leftDefaultWidth)
      setRightWidth(rightDefaultWidth)
    }
  }, [resetTrigger, leftDefaultWidth, rightDefaultWidth])

  const handleLeftDrag = useCallback((deltaX: number) => {
    setLeftWidth(prev => Math.max(100, Math.min(prev + deltaX, 400)))
  }, [])

  const handleRightDrag = useCallback((deltaX: number) => {
    setRightWidth(prev => Math.max(200, Math.min(prev - deltaX, 800)))
  }, [])

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Panel - File List */}
      <div
        className="flex-shrink-0 overflow-hidden bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"
        style={{ width: leftWidth }}
      >
        {leftPanel}
      </div>

      <ResizeHandle onDrag={handleLeftDrag} />

      {/* Center Panel - Code Viewer */}
      <div className="flex-1 min-w-0 overflow-hidden bg-white dark:bg-neutral-950">
        {centerPanel}
      </div>

      <ResizeHandle onDrag={handleRightDrag} />

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
