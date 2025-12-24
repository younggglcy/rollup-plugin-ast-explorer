import type { Node } from 'estree'

/**
 * Event types emitted by the WebSocket server
 */
export enum EventType {
  BuildStart = 'build-start',
  BuildEnd = 'build-end',
  ModuleParsed = 'module-parsed',
}

/**
 * Base event structure
 */
export interface BaseEvent {
  type: EventType
  timestamp: number
}

/**
 * Build start event
 */
export interface BuildStartEvent extends BaseEvent {
  type: EventType.BuildStart
}

/**
 * Build end event
 */
export interface BuildEndEvent extends BaseEvent {
  type: EventType.BuildEnd
  error?: string
}

/**
 * Module parsed event
 */
export interface ModuleParsedEvent extends BaseEvent {
  type: EventType.ModuleParsed
  moduleId: string
}

/**
 * Union type for all events
 */
export type WSEvent = BuildStartEvent | BuildEndEvent | ModuleParsedEvent

/**
 * Module metadata returned by the server
 */
export interface ModuleMetadata {
  id: string
  code: string | null
  isEntry: boolean
  isExternal: boolean
  importedIds: readonly string[]
  importers: readonly string[]
  dynamicallyImportedIds: readonly string[]
}

/**
 * AST payload with optional code
 */
export interface ASTPayload {
  id: string
  ast: Node | null
  code?: string
}

/**
 * Response from GET /modules endpoint
 */
export interface ModulesResponse {
  modules: ModuleMetadata[]
}

/**
 * Response from GET /ast/:id endpoint
 */
export interface ASTResponse extends ASTPayload {}
