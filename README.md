# XCaliber Demo

XCaliber Demo Apps is a platform that demonstrate the capabilities of XCaliber APIs though a collection of various example apps.

## Prerequisites

- Node.js >= 18
- pnpm 9.0.0

## Setup

1. Install pnpm if you haven't already:
   ```bash
   npm install -g pnpm@9.0.0
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development

To start all apps in development mode:
```bash
pnpm dev
```

To start a specific app in development mode:
```bash
pnpm dev --filter=<app-name>
```
Example:
```bash
pnpm dev --filter=@xcaliber/demo-app
```


## Building

To build all apps and packages:
```bash
pnpm build
```

## Other Commands

- **Lint**: Run linting across all projects
  ```bash
  pnpm lint 
  ```

- **Format**: Format all files using Prettier
  ```bash
  pnpm format
  ```

## Project Structure

- `/apps` - Contains the main demo app
- `/packages` - Contains shared modules used by the main demo app
