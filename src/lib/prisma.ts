import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

/**
 * Context for multi-tenant queries
 * All queries should be scoped by organizationId to ensure data isolation
 */
export interface TenantContext {
  organizationId: string;
}

/**
 * Creates a type-safe where clause that includes the organizationId
 * for multi-tenant data isolation
 */
export function withTenant<T extends Record<string, unknown>>(
  where: T,
  tenant: TenantContext
): T & { organizationId: string } {
  return {
    ...where,
    organizationId: tenant.organizationId,
  };
}

/**
 * Prisma extension for automatic tenant scoping
 * Usage: prisma.$extends(withTenantContext({ organizationId: '...' }))
 */
export function withTenantContext(tenant: TenantContext) {
  return Prisma.defineExtension({
    name: 'tenantContext',
    model: {
      $allModels: {
        async findManyWithTenant<T>(
          this: T,
          args: Prisma.Args<T, 'findMany'>
        ): Promise<Prisma.Result<T, Prisma.Args<T, 'findMany'>, 'findMany'>> {
          const context = Prisma.getExtensionContext(this);
          return (context as unknown as Record<string, (args: unknown) => Promise<unknown>>).findMany({
            ...args,
            where: {
              ...(args.where || {}),
              organizationId: tenant.organizationId,
            },
          }) as Promise<Prisma.Result<T, Prisma.Args<T, 'findMany'>, 'findMany'>>;
        },
        async findFirstWithTenant<T>(
          this: T,
          args: Prisma.Args<T, 'findFirst'>
        ): Promise<Prisma.Result<T, Prisma.Args<T, 'findFirst'>, 'findFirst'>> {
          const context = Prisma.getExtensionContext(this);
          return (context as unknown as Record<string, (args: unknown) => Promise<unknown>>).findFirst({
            ...args,
            where: {
              ...(args.where || {}),
              organizationId: tenant.organizationId,
            },
          }) as Promise<Prisma.Result<T, Prisma.Args<T, 'findFirst'>, 'findFirst'>>;
        },
        async findUniqueWithTenant<T>(
          this: T,
          args: Prisma.Args<T, 'findUnique'>
        ): Promise<Prisma.Result<T, Prisma.Args<T, 'findUnique'>, 'findUnique'>> {
          const context = Prisma.getExtensionContext(this);
          return (context as unknown as Record<string, (args: unknown) => Promise<unknown>>).findUnique({
            ...args,
            where: {
              ...args.where,
              organizationId: tenant.organizationId,
            },
          }) as Promise<Prisma.Result<T, Prisma.Args<T, 'findUnique'>, 'findUnique'>>;
        },
      },
    },
  });
}

/**
 * Get extended Prisma client with tenant context
 */
export function getPrismaWithTenant(tenant: TenantContext) {
  return prisma.$extends(withTenantContext(tenant));
}

export default prisma;
