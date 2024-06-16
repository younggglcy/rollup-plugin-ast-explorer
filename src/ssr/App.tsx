import type { FC } from 'react'
import { Container } from './components/Container'
import { NoModulesHint } from './components/NoModulesHint'
import { useEventSource } from './hooks/useEventSource'

export const App: FC = () => {
  const { data } = useEventSource('/stream')

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <title>rollup-plugin-ast-explorer</title>
      </head>
      <body>
        <div id="root" className="border-box">
          {data
            ? <Container moduleInfos={data} />
            : <NoModulesHint />}
        </div>
      </body>
    </html>
  )
}
