import type { editor } from 'monaco-editor'
import type { FC } from 'react'
import type { HighlightRange } from '@/ssr/types/ast'
import { lazy, Suspense, useCallback, useState } from 'react'

import { useHighlight } from './useHighlight'

// Lazy load Monaco Editor
const MonacoEditor = lazy(() => import('@monaco-editor/react'))

export interface CodeViewerProps {
  code: string
  language?: string
  highlightRange?: HighlightRange | null
}

const CodeFallback: FC<{ code: string }> = ({ code }) => (
  <div className="h-full w-full bg-neutral-50 dark:bg-neutral-900">
    <pre className="h-full overflow-auto p-4 font-mono text-sm">
      <code>{code}</code>
    </pre>
  </div>
)

export const CodeViewer: FC<CodeViewerProps> = ({
  code,
  language = 'javascript',
  highlightRange = null,
}) => {
  const [editorInstance, setEditorInstance] = useState<editor.IStandaloneCodeEditor | null>(null)

  useHighlight(editorInstance, highlightRange)

  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor) => {
    setEditorInstance(editor)
  }, [])

  return (
    <div className="h-full w-full">
      <Suspense fallback={<CodeFallback code={code} />}>
        <MonacoEditor
          height="100%"
          language={language}
          value={code}
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
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
            },
            fontSize: 13,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          }}
          onMount={handleEditorDidMount}
        />
      </Suspense>
    </div>
  )
}
