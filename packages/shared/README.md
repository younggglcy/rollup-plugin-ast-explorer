# @rollup-plugin-ast-explorer/shared

Shared types and utilities for Rollup AST Explorer.

## Types

- **EventType**: WebSocket event types (build-start, build-end, module-parsed)
- **WSEvent**: Union type for all WebSocket events
- **ModuleMetadata**: Module information returned by the server
- **ASTPayload**: AST data with optional source code
- **ModulesResponse**: Response from GET /modules
- **ASTResponse**: Response from GET /ast/:id
