import type { FC } from 'react'
import { Monitor, Moon, RotateCcw, Sun } from 'lucide-react'
import { useTheme } from '@/ssr/hooks/useTheme'
import { cn } from '@/ssr/lib/utils'

declare const __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: string

export interface HeaderProps {
  showReset?: boolean
  onReset?: () => void
}

export const Header: FC<HeaderProps> = ({ showReset, onReset }) => {
  const version = typeof __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__ !== 'undefined'
    ? __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__
    : '0.0.0'

  const { theme, toggleTheme } = useTheme()

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Rollup AST Explorer</h1>
        <span className="text-xs text-neutral-400">
          v
          {version}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
              'bg-neutral-800 hover:bg-neutral-700 transition-colors',
              'text-neutral-300 hover:text-white',
            )}
            title="Reset panel sizes to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
        <button
          type="button"
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded text-xs',
            'bg-neutral-800 hover:bg-neutral-700 transition-colors',
            'text-neutral-300 hover:text-white',
          )}
          title={`Current: ${theme} (click to toggle)`}
        >
          <ThemeIcon className="w-3.5 h-3.5" />
          <span className="capitalize">{theme}</span>
        </button>
        <span className="text-xs text-neutral-400 ml-2">Powered by Rollup</span>
      </div>
    </header>
  )
}
