import type { ModuleInfosMap } from '@/types'
import type { FC } from 'react'
import { useState } from 'react'
import { List } from './List'

export interface ContainerProps {
  moduleInfos: ModuleInfosMap
}

export const Container: FC<ContainerProps> = (props) => {
  const {
    moduleInfos,
  } = props

  const moduleInfosKeys = Array.from(moduleInfos.keys())
  const [id, setId] = useState(moduleInfosKeys[0])
  const [_moduleInfo, setModuleInfo] = useState(moduleInfos.get(id)!)

  return (
    <div
      className="flex h-full"
    >
      <List
        keys={moduleInfosKeys}
        activeId={id}
        onClick={(id) => {
          setId(id)
          setModuleInfo(moduleInfos.get(id)!)
        }}
      />
    </div>
  )
}
