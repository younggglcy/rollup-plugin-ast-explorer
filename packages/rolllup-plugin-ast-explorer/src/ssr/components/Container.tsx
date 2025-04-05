import type { ModuleInfosMap } from '@/types'
import type { FC } from 'react'

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
