# rollup-plugin-ast-explorer

A Rollup plugin that captures and serves AST data from your build process.

## Features

- Captures Rollup's internal AST via the `moduleParsed` hook
- Runs an HTTP server with WebSocket support for live updates
- Provides REST API endpoints to query module metadata and AST data
- Broadcasts build events in real-time

## Installation

```bash
pnpm add -D rollup-plugin-ast-explorer
```

## Usage

```js
import { astExplorer } from 'rollup-plugin-ast-explorer'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
  },
  plugins: [
    astExplorer({
      port: 4178,
      host: 'localhost',
      keepCode: true,
    }),
  ],
}
```

## Options

- `port` (number): Port for the server (default: 4178)
- `host` (string): Host for the server (default: 'localhost')
- `include` (FilterPattern): Include pattern for modules
- `exclude` (FilterPattern): Exclude pattern for modules
- `keepCode` (boolean): Whether to include source code (default: true)
- `cwd` (string): Current working directory (default: process.cwd())

## API Endpoints

- `GET /modules` - Returns list of all parsed modules
- `GET /ast/:id` - Returns AST for a specific module
- `WS /ws` - WebSocket for real-time build events

## Events

The WebSocket connection emits the following events:

- `build-start` - Build has started
- `build-end` - Build has completed
- `module-parsed` - A module has been parsed
