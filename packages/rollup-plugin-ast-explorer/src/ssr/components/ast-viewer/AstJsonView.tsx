import type { FC } from 'react'
import { lazy, Suspense, useMemo } from 'react'

import { ScrollArea } from '@/ssr/components/ui/scroll-area'

// Lazy load Monaco Editor
const MonacoEditor = lazy(() => import('@monaco-editor/react'))

export interface AstJsonViewProps {
  ast: unknown
}

const JsonFallback: FC<{ content: string }> = ({ content }) => (
  <ScrollArea className="h-full">
    <pre className="p-4 font-mono text-sm text-neutral-700 dark:text-neutral-300">
      {content}
    </pre>
  </ScrollArea>
)

export const AstJsonView: FC<AstJsonViewProps> = ({ ast }) => {
  const jsonString = useMemo(() => {
    if (!ast)
      return ''
    try {
      return JSON.stringify(ast, null, 2)
    }
    catch {
      return 'Error: Unable to stringify AST'
    }
  }, [ast])

  return (
    <div className="h-full w-full">
      <Suspense fallback={<JsonFallback content={jsonString} />}>
        <MonacoEditor
          height="100%"
          language="json"
          value={jsonString}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'none',
            wordWrap: 'on',
            fontSize: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          }}
        />
      </Suspense>
    </div>
  )
}
