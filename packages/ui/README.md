# AST Explorer UI

React-based UI for exploring Rollup AST.

## Features

- Module list with search
- AST tree viewer with expandable nodes
- Source code viewer with syntax highlighting
- Click AST nodes to highlight corresponding code
- Live updates via WebSocket

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build
```

The UI will be available at `http://localhost:4173`.

## Requirements

The UI expects the Rollup plugin server to be running at `http://localhost:4178`.
