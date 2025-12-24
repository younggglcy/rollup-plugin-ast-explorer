# Rollup AST Explorer

A comprehensive monorepo for exploring Rollup's Abstract Syntax Tree (AST) in real-time.

![Rollup AST Explorer Screenshot](https://github.com/user-attachments/assets/32674a56-5724-4d12-ad60-b3dc7a829037)

## Features

- 🔍 **Real-time AST Visualization** - Explore Rollup's internal AST as your code is being bundled
- 🌐 **Live Updates** - WebSocket integration for instant updates when your code changes
- 🎯 **Interactive UI** - Click on AST nodes to highlight corresponding source code
- 🔎 **Module Search** - Quickly find and explore specific modules
- 📝 **Code View** - Syntax-highlighted source code with line numbers
- 🌳 **Tree View** - Collapsible AST tree structure for easy navigation

## Packages

This monorepo contains the following packages:

- **[@rollup-plugin-ast-explorer/shared](./packages/shared)** - Shared types and utilities
- **[rollup-plugin-ast-explorer](./packages/plugin)** - Rollup plugin that captures AST data
- **[ast-explorer-ui](./packages/ui)** - React-based web UI for visualizing ASTs
- **[ast-explorer-example-basic](./examples/basic)** - Example project demonstrating usage

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 10.17.1

### Installation

```bash
# Clone the repository
git clone https://github.com/younggglcy/rollup-plugin-ast-explorer.git
cd rollup-plugin-ast-explorer

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Running the Example

```bash
# Terminal 1: Start the example Rollup build with the plugin
pnpm --filter ast-explorer-example-basic dev

# Terminal 2: Start the UI
pnpm --filter ast-explorer-ui dev
```

Then open your browser to `http://localhost:4173` to explore the AST!

## Usage

### In Your Project

1. Install the plugin:

```bash
pnpm add -D rollup-plugin-ast-explorer
```

2. Add it to your Rollup config:

```js
import { astExplorer } from 'rollup-plugin-ast-explorer'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [
    astExplorer({
      port: 4178, // Server port (default: 4178)
      keepCode: true, // Include source code (default: true)
      include: '**/*.js', // Include pattern (optional)
      exclude: 'node_modules/**', // Exclude pattern (optional)
    }),
  ],
}
```

3. Run your build:

```bash
rollup -c -w
```

4. Start the UI:

```bash
pnpm --filter ast-explorer-ui dev
```

## API

### Plugin Options

- `port` (number): Port for the HTTP and WebSocket server. Default: `4178`
- `host` (string): Host for the server. Default: `'localhost'`
- `include` (FilterPattern): Include pattern for modules to track
- `exclude` (FilterPattern): Exclude pattern for modules to skip
- `keepCode` (boolean): Whether to keep source code in module metadata. Default: `true`
- `cwd` (string): Current working directory for relative paths. Default: `process.cwd()`

### Server Endpoints

The plugin starts an HTTP server with the following endpoints:

- `GET /modules` - Returns list of all parsed modules with metadata
- `GET /ast/:id` - Returns AST for a specific module (URL-encoded module ID)
- `WS /ws` - WebSocket endpoint for real-time updates

### WebSocket Events

The WebSocket connection emits the following events:

- `build-start` - Emitted when a build starts
- `build-end` - Emitted when a build completes (with optional error)
- `module-parsed` - Emitted when a module is parsed

## Development

### Project Structure

```
rollup-plugin-ast-explorer/
├── packages/
│   ├── shared/           # Shared TypeScript types
│   ├── plugin/           # Rollup plugin
│   └── ui/               # React UI application
├── examples/
│   └── basic/            # Basic example
└── playgrounds/
    └── basic-typescript-demo/  # TypeScript demo
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter rollup-plugin-ast-explorer build
pnpm --filter ast-explorer-ui build
pnpm --filter @rollup-plugin-ast-explorer/shared build
```

### Linting

```bash
# Lint all files
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## How It Works

1. The Rollup plugin hooks into the `moduleParsed` lifecycle to capture the AST
2. ASTs are sanitized to remove circular references and heavy fields
3. A local HTTP + WebSocket server is started to serve the data
4. The UI connects to the server and displays modules, AST, and source code
5. Live updates are pushed via WebSocket when files change

## Technology Stack

- **Plugin**: TypeScript, Rollup, h3, ws
- **UI**: React, Vite, Tailwind CSS, shadcn/ui, prism-react-renderer
- **Shared**: TypeScript, estree types

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

younggglcy (younggglcy@gmail.com)
