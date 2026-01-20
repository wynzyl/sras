# Core Domain Logic

This directory contains domain-specific business logic organized by domain.

## Structure

Each domain (`academic`, `students`, `accounting`, `auth`, `shared`) should contain:

- **Services**: Business logic and orchestration
- **Validators**: Zod schemas for domain validation
- **Repositories**: Data access layer (calls to `/db`)
- **Types**: Domain-specific TypeScript types

## Rules

- No UI components
- No Next.js-specific code (routes, server actions)
- Pure business logic that can be tested independently
- Dependencies should flow inward: `/core` → `/db`, `/lib`, `/types`
