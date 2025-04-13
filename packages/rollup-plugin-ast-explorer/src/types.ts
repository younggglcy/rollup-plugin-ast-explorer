import type { ModuleInfo } from 'rollup'
import type { BehaviorSubject } from 'rxjs'

export type ModuleInfosMap = Map<string, ModuleInfo>

export interface ServerContext {
  moduleInfos: BehaviorSubject<ModuleInfosMap>
}
