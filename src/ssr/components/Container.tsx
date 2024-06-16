import type { FC } from 'react'
import type { ModuleInfosMap } from '@/types'

export interface ContainerProps {
  moduleInfos: ModuleInfosMap
}

export const Container: FC<ContainerProps> = (props) => {
  const {
    moduleInfos: _,
  } = props

  return (
    <div>
      Hello, World!
    </div>
  )
}
