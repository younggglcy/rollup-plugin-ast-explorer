import type { editor } from 'monaco-editor'
import type { HighlightRange } from '@/ssr/types/ast'

import { useEffect, useRef } from 'react'

export function useHighlight(
  editorInstance: editor.IStandaloneCodeEditor | null,
  highlightRange: HighlightRange | null,
) {
  const decorationsRef = useRef<string[]>([])

  useEffect(() => {
    if (!editorInstance)
      return

    // Clear old decorations
    decorationsRef.current = editorInstance.deltaDecorations(
      decorationsRef.current,
      [],
    )

    if (!highlightRange)
      return

    const { startLine, startColumn, endLine, endColumn } = highlightRange

    // Add new highlight decoration
    decorationsRef.current = editorInstance.deltaDecorations([], [
      {
        range: {
          startLineNumber: startLine,
          startColumn: startColumn + 1,
          endLineNumber: endLine,
          endColumn: endColumn + 1,
        },
        options: {
          className: 'ast-highlight-line',
          isWholeLine: false,
          inlineClassName: 'ast-highlight-inline',
        },
      },
    ])

    // Scroll to highlighted area if out of view
    editorInstance.revealLineInCenterIfOutsideViewport(startLine)

    return () => {
      if (editorInstance && decorationsRef.current.length > 0) {
        editorInstance.deltaDecorations(decorationsRef.current, [])
      }
    }
  }, [editorInstance, highlightRange])
}
