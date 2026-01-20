# Architecture Guide

## Overview

SRAS follows a **domain-driven design** approach with clear separation of concerns. The architecture is organized into distinct layers, each with specific responsibilities.

## Folder Structure

```
/src
  /app              # Next.js App Router - Routes, pages, server actions, UI composition
    /(auth)         # Authentication routes (login, register, etc.)
    /(dashboard)    # Dashboard routes (protected routes)
  /core             # Domain logic - Business rules, services, validators, repositories
    /academic       # Academic domain (courses, programs, schedules)
    /students       # Student domain (student management, enrollment)
    /accounting     # Accounting domain (fees, payments, transactions)
    /auth           # Authentication domain (user management, sessions)
    /shared         # Shared domain logic used across multiple domains
  /db               # Database layer - Prisma client and database helpers
  /ui               # Reusable UI components (presentation-only)
  /lib              # Cross-cutting utilities (date, money, formatting)
  /types            # Shared TypeScript types and interfaces
```

## Layer Responsibilities

### `/app` - Application Layer
**Purpose**: Next.js routes, pages, server actions, and UI composition

- Contains route handlers and page components
- Server Actions that wire together domain services
- UI composition (combining `/ui` components)
- Route-specific layouts and metadata
- **No business logic** - delegates to `/core`

**Example**:
```typescript
// src/app/(dashboard)/students/page.tsx
import { getStudents } from "@/core/students/services";
import { StudentTable } from "@/ui/components";

export default async function StudentsPage() {
  const students = await getStudents();
  return <StudentTable students={students} />;
}
```

### `/core` - Domain Logic Layer
**Purpose**: Business logic, validation, and data access orchestration

Each domain (`academic`, `students`, `accounting`, `auth`, `shared`) contains:

- **Services**: Business logic and orchestration
- **Validators**: Zod schemas for domain validation
- **Repositories**: Data access functions (calls to `/db`)
- **Types**: Domain-specific TypeScript types

**Rules**:
- No UI components
- No Next.js-specific code
- Pure business logic (testable independently)
- Can depend on `/db`, `/lib`, `/types`

**Example**:
```typescript
// src/core/students/services.ts
import { prisma } from "@/db";
import { studentSchema } from "./validators";
import type { Student } from "./types";

export async function getStudents(): Promise<Student[]> {
  return prisma.student.findMany();
}

export async function createStudent(data: unknown): Promise<Student> {
  const validated = studentSchema.parse(data);
  return prisma.student.create({ data: validated });
}
```

### `/db` - Database Layer
**Purpose**: Prisma client instance and database helpers

- Exports singleton Prisma client instance
- Database connection management
- Query builders and utilities
- Migration helpers

**Example**:
```typescript
// src/db/index.ts
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
```

### `/ui` - UI Components Layer
**Purpose**: Reusable presentation components

- Buttons, tables, forms, cards, modals
- Styled with Tailwind CSS
- Accept props for customization
- **No business logic** - pure presentation

**Example**:
```typescript
// src/ui/components/Button.tsx
export function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>;
}
```

### `/lib` - Utilities Layer
**Purpose**: Cross-cutting utility functions

- Date formatting and manipulation
- Money/currency formatting
- String formatting
- Common utility functions
- Should be pure functions (no side effects)

**Example**:
```typescript
// src/lib/format.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
```

### `/types` - Types Layer
**Purpose**: Shared TypeScript types

- Common types used across multiple domains
- Domain-specific types live in `/core/*/types.ts`
- Interfaces and type definitions

## Dependency Rules

Dependencies should flow **inward**:

```
/app → /core → /db
  ↓      ↓      ↓
/ui    /lib   /types
```

- `/app` can depend on: `/core`, `/ui`, `/lib`, `/types`
- `/core` can depend on: `/db`, `/lib`, `/types`
- `/db` can depend on: `/lib`, `/types`
- `/ui` can depend on: `/lib`, `/types`
- `/lib` can depend on: `/types`
- `/types` has no dependencies

**Never**:
- `/core` should not depend on `/app` or `/ui`
- `/db` should not depend on `/core` or `/app`
- `/lib` should not depend on `/core` or `/app`

## Ledger-First Principle

SRAS follows a **ledger-first** accounting approach:

### What is Ledger-First?

All financial transactions are recorded in a **double-entry ledger** before any other operations. This ensures:

1. **Data Integrity**: Every debit has a corresponding credit
2. **Audit Trail**: Complete history of all financial transactions
3. **Accuracy**: Financial statements are always balanced
4. **Compliance**: Meets accounting standards and regulations

### Implementation

- All financial operations (`/core/accounting`) must:
  1. Create ledger entries first
  2. Then update related entities (student balances, fee records, etc.)
  3. Use database transactions to ensure atomicity

- Ledger entries are **immutable** - never deleted, only reversed with new entries

- Financial reports are generated from ledger data, not from aggregated balances

### Example Flow

```typescript
// Payment processing
async function processPayment(amount: number, studentId: string) {
  return prisma.$transaction(async (tx) => {
    // 1. Create ledger entries (debit cash, credit accounts receivable)
    await tx.ledgerEntry.createMany({
      data: [
        { account: "cash", type: "debit", amount },
        { account: "accounts_receivable", type: "credit", amount },
      ],
    });

    // 2. Update student balance
    await tx.student.update({
      where: { id: studentId },
      data: { balance: { decrement: amount } },
    });

    // 3. Create payment record
    return tx.payment.create({ data: { amount, studentId } });
  });
}
```

## Best Practices

1. **Keep `/core` pure**: No framework dependencies, easily testable
2. **Compose in `/app`**: Wire together services and UI components
3. **Reuse in `/ui`**: Build reusable, composable components
4. **Validate early**: Use Zod schemas in `/core` validators
5. **Type everything**: Leverage TypeScript for type safety
6. **Test domain logic**: Focus tests on `/core` services
7. **Ledger-first**: Always record financial transactions in ledger first

## Getting Started

1. Add domain logic in `/core/{domain}/`
2. Create UI components in `/ui/`
3. Wire together in `/app` routes and server actions
4. Use `/lib` utilities for common operations
5. Define shared types in `/types`
