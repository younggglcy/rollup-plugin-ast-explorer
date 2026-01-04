import type { FC } from 'react'

declare const __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: string

export const Header: FC = () => {
  const version = typeof __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__ !== 'undefined'
    ? __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__
    : '0.0.0'

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-neutral-900 text-white">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Rollup AST Explorer</h1>
        <span className="text-xs text-neutral-400">
          v
          {version}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <span>Powered by Rollup</span>
      </div>
    </header>
  )
}
