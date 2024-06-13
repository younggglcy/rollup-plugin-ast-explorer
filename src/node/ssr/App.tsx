import { resolve } from 'node:path'
import type { FC } from 'react'
import { dirname } from '../constants'

export const App: FC = () => {
  const assertsPath = resolve(dirname, '..', 'asserts')
  const assertsMap = {
    'styles/app.css': `${assertsPath}/styles/app.css`,
  } as const

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={assertsMap['styles/app.css']} />
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
