import type { FC } from 'react'

// Minimal HTML shell for SSR - client takes over rendering via createRoot
export const App: FC = () => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <title>Rollup AST Explorer</title>
      </head>
      <body>
        <div
          id="root"
          className="h-full"
        >
          {/* Loading state - will be replaced by ClientApp */}
          <div className="flex h-full items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <div className="text-neutral-500 dark:text-neutral-400">
              Loading...
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
