export {}

declare global {
  declare const __ROLLUP_PLUGIN_AST_EXPLORER_VERSION__: string

  interface Window {
    assetsMap: Record<string, string>
  }
}
