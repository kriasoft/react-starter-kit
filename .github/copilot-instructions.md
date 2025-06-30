## Introduction

This repository, named React Starter Kit, is a boilerplate for building web applications using Bun, TypeScript, and React. It is designed to be a starting point for developers who want to create modern web applications with a focus on performance, simplicity, and best practices.

## Project Structure

- `app` - Front-end code built with React and TypeScript.
- `server` - Back-end server built with Bun and Hono.
  - `modules/ai` - AI related modules.
  - `modules/ws` - WebSocket router, types, etc.
  - `modules/*` - Other server modules.
  - `api` - API routes for the server using Hono
  - `ws` - WebSocket routes for the server using `WebSocketRouter`.
- `packages/*` - Shared packages and libraries.
- `scripts` - Development and build scripts.

## Coding Style

- Use functional programming principles.
- Follow existing code style and conventions.
- Use modern TypeScript features.
- Avoid outdated coding patterns, e.g. using `_` for private variables.
- Use Bun/Hono features and idioms, for example pub-sub for WebSocket.
