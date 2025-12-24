import type { Node } from 'estree'
import { Highlight, themes } from 'prism-react-renderer'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from './ui/scroll-area'

interface CodeViewerProps {
  code: string | null | undefined
  language?: string
  highlightedNode?: Node | null
}

export function CodeViewer({ code, language = 'javascript', highlightedNode }: CodeViewerProps) {
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  useEffect(() => {
    if (highlightedNode && 'loc' in highlightedNode && highlightedNode.loc) {
      const startLine = highlightedNode.loc.start.line
      const lineToHighlight = startLine
      setHighlightedLine(lineToHighlight)

      // Scroll to highlighted line
      const lineElement = lineRefs.current.get(lineToHighlight)
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
    else {
      setHighlightedLine(null)
    }
  }, [highlightedNode])

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
        <div className="text-center">
          <div className="text-lg mb-2">No code available</div>
          <div className="text-sm">Select a module to view its source</div>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full bg-gray-50">
      <Highlight
        theme={themes.github}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: '1rem', margin: 0, background: '#f9fafb', fontSize: '13px', lineHeight: '1.5' }}>
            {tokens.map((line, lineIdx) => {
              const lineNumber = lineIdx + 1
              const isHighlighted = highlightedLine === lineNumber
              return (
                <div
                  key={`line-${lineIdx}`}
                  {...getLineProps({ line })}
                  ref={(el) => {
                    if (el) {
                      lineRefs.current.set(lineNumber, el)
                    }
                  }}
                  style={{
                    ...getLineProps({ line }).style,
                    backgroundColor: isHighlighted ? '#fff3cd' : undefined,
                    display: 'flex',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '3em',
                      userSelect: 'none',
                      opacity: 0.4,
                      textAlign: 'right',
                      paddingRight: '1em',
                      color: '#6b7280',
                    }}
                  >
                    {lineNumber}
                  </span>
                  <span style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, monospace' }}>
                    {line.map((token, tokenIdx) => (
                      <span key={`token-${tokenIdx}`} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
    </ScrollArea>
  )
}
