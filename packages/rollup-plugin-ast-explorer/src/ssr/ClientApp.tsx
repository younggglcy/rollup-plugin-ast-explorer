import type { FC } from 'react'
import type { ModuleInfosMap } from '@/types'
import { useEffect } from 'react'
import { fromEvent } from 'rxjs'
import { MODULES_STOREAGE_KEY } from '@/constants'
import { mapToString, stringToMap } from '@/utils'
import { Container } from './components/Container'
import { NoModulesHint } from './components/NoModulesHint'
import { useEventSource } from './hooks/useEventSource'

export const ClientApp: FC = () => {
  const initialModulesInfo = stringToMap<ModuleInfosMap>(
    localStorage.getItem(MODULES_STOREAGE_KEY) || '',
  )

  const { data } = useEventSource(
    '/stream',
    initialModulesInfo,
  )

  useEffect(() => {
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
    <>
      {data?.size
        ? <Container moduleInfos={data} />
        : <NoModulesHint />}
    </>
  )
}
