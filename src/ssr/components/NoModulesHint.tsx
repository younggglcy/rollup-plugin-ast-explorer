import type { FC } from 'react'

export const NoModulesHint: FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-3xl text-red-500">
        No modules found !
      </div>
    </div>
  )
}
