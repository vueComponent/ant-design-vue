# Ant Design Vue

## Overview
This is the Ant Design Vue component library - an enterprise-class UI design language and Vue-based implementation. This repository contains both the component library source code and the documentation site.

## Project Structure
- `components/` - Vue 3 component library source code
- `site/` - Vite-powered documentation site
- `scripts/` - Build and utility scripts
- `plugin/` - Custom Vite plugins for documentation processing
- `antd-tools/` - Build tooling for the component library

## Development Setup
The project uses:
- **Node.js 20** - JavaScript runtime
- **Vite 3** - Development server and build tool
- **Vue 3** - Frontend framework
- **Less** - CSS preprocessing
- **TypeScript** - Type-safe JavaScript

## Running the Project
The dev server runs on port 5000:
```bash
npm run dev
```

This starts the documentation site with hot reload for development.

## Key Scripts
- `npm run dev` - Start development server
- `npm run build` - Build the documentation site for production
- `npm run compile` - Compile the component library
- `npm run test` - Run tests

## Configuration
- Vite config: `site/vite.config.ts`
- TypeScript config: `tsconfig.json`
- ESLint config: `.eslintrc.js`

## Recent Changes
- December 2024: Configured for Replit environment with port 5000
