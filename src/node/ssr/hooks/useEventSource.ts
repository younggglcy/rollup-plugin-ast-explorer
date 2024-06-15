import { useEffect, useState } from 'react'
import type { ModuleInfosMap } from '@/types'
import { stringToMap } from '@/utils'

export function useEventSource(url: string) {
  const eventSource = typeof window === 'undefined' ? null : new EventSource(url)

  const [data, setData] = useState<ModuleInfosMap | null>(null)

  useEffect(() => {
    if (!eventSource) {
      return
    }

    eventSource.onmessage = (event) => {
      setData(stringToMap<ModuleInfosMap>(event.data))
    }

    return () => {
      eventSource.close()
    }
  }, [eventSource])

  return {
    data,
  }
}
