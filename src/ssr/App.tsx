import { type FC, useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { Container } from './components/Container'
import { NoModulesHint } from './components/NoModulesHint'
import { useEventSource } from './hooks/useEventSource'
import { MODULES_STOREAGE_KEY } from '@/constants'
import type { ModuleInfosMap } from '@/types'
import { mapToString, stringToMap } from '@/utils'

export const App: FC = () => {
  const { data } = useEventSource(
    '/stream',
    typeof window === 'undefined'
      ? null
      : stringToMap<ModuleInfosMap>(localStorage.getItem(MODULES_STOREAGE_KEY) || ''),
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const $beforeunload = fromEvent(window, 'beforeunload')
      .subscribe(() => {
        if (data?.size) {
          localStorage.setItem(MODULES_STOREAGE_KEY, mapToString(data))
        }
      })
    return () => {
      $beforeunload.unsubscribe()
    }
  }, [data])

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
          {data?.size
            ? <Container moduleInfos={data} />
            : <NoModulesHint />}
        </div>
      </body>
    </html>
  )
}
