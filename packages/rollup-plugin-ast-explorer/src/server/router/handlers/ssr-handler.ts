import { defineEventHandler, setHeader } from 'h3'

export function ssrHandler() {
  return defineEventHandler((event) => {
    // Serve a minimal static HTML shell; client app mounts with createRoot.
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    return [
      '<!doctype html>',
      '<html>',
      '<head>',
      '<meta charset="utf-8" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1" />',
      '<link rel="icon" href="/favicon.png" type="image/png" />',
      '<title>Rollup AST Explorer</title>',
      '</head>',
      '<body>',
      '<div id="root" class="h-full"></div>',
      '<script type="module" src="/main.css.js"></script>',
      '<script type="module" src="/entry-client.js"></script>',
      '</body>',
      '</html>',
    ].join('')
  })
}
