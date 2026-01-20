# Database Layer

This directory contains:
- Prisma client instance (`index.ts`)
- Database helper functions
- Query builders and utilities

## Usage

```typescript
import { prisma } from "@/db";

// Use prisma client for database operations
const users = await prisma.user.findMany();
```
