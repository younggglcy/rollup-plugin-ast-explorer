import type { FC } from 'react'

export interface AppProps {
  assetsMap: typeof import('@/node/ssr/main').assetsMap
}

export const App: FC<AppProps> = (props) => {
  const {
    assetsMap,
  } = props

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={assetsMap['/dist/assets/styles/app.css']} />
        <title>rollup-plugin-ast-explorer</title>
      </head>
      <body>
        <div id="root">
          <h1>Hello, World!</h1>
        </div>
      </body>
    </html>
  )
}
