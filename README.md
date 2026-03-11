# Accounting ERP

A multi-tenant ERP SaaS built with Next.js 15+, Prisma, and Tailwind CSS 4.

## Architecture

### Multi-Tenancy
- **Model**: Shared database with `organizationId` discriminator column
- **Isolation**: All queries automatically scoped by tenant context
- **Security**: Row-level isolation enforced at application layer

### Database Schema

#### Core Models
- **Organization**: Root tenant entity, all data scoped to an organization
- **User**: Global user identity, can belong to multiple organizations via Membership
- **Member**: Junction table linking users to organizations with roles

#### RBAC (Role-Based Access Control)
- **Role**: Can be global (isSystem=true, organizationId=null) or organization-specific
- **Permission**: Granular action+resource permissions (e.g., "POST_JOURNAL" on "LEDGER")
- Many-to-many relationship between Roles and Permissions

#### Fiscal Infrastructure
- **Account**: Hierarchical Chart of Accounts (COA)
  - Supports parent-child relationships for account grouping
  - Types: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  - Unique code per organization
- **FiscalYear**: Defines accounting periods
  - Supports locked years (preventing edits)
  - Tracks current fiscal year
- **JournalEntry**: Double-entry bookkeeping transactions
  - Status: DRAFT, POSTED, VOID
  - Entry number unique per organization
- **JournalLine**: Individual debit/credit lines
  - Decimal precision: 15 digits, 2 decimal places
  - Enforced balance validation (Sum(Debits) = Sum(Credits))

#### Audit & Compliance
- **AuditLog**: Immutable record of all mutations
  - Captures old/new data snapshots
  - Links to user and organization
  - Tracks IP address and user agent

### Technology Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS 4 (CSS-first configuration)
- **ORM**: Prisma with PostgreSQL
- **Validation**: Zod

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── globals.css        # Tailwind 4 entry
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   └── lib/
│       └── prisma.ts          # Prisma client & tenant utilities
├── .env                       # Environment variables
├── next.config.ts             # Next.js config
├── package.json               # Dependencies
└── postcss.config.mjs         # PostCSS config (Tailwind 4)
```

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/accounting_erp"
```

3. Generate Prisma client:
```bash
npm run db:generate
```

4. Push schema to database:
```bash
npm run db:push
```

5. Run development server:
```bash
npm run dev
```

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes (development)
- `npm run db:migrate` - Create and apply migrations
- `npm run db:studio` - Open Prisma Studio

## Multi-Tenant Query Patterns

### Basic Tenant Scoping
```typescript
import { prisma, withTenant } from '@/lib/prisma';

// Manual scoping
const accounts = await prisma.account.findMany({
  where: withTenant({ type: 'ASSET' }, { organizationId: 'org_123' })
});
```

### Using Extended Client
```typescript
import { getPrismaWithTenant } from '@/lib/prisma';

const prismaWithTenant = getPrismaWithTenant({ organizationId: 'org_123' });

// Automatically scoped queries
const accounts = await prismaWithTenant.account.findManyWithTenant({
  where: { type: 'ASSET' }
});
```

## Security Considerations

1. **Data Isolation**: Always verify `organizationId` matches user's membership
2. **Audit Logging**: All mutations should create AuditLog entries
3. **Journal Integrity**: Validate debits equal credits before posting
4. **Fiscal Year Locking**: Prevent edits to locked fiscal years
