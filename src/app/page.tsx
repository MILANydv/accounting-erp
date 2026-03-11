export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Accounting ERP
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Multi-tenant SaaS platform for financial management
          </p>
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Multi-Tenancy"
            description="Shared database with organization-scoped data isolation"
          />
          <FeatureCard
            title="RBAC"
            description="Role-based access control with granular permissions"
          />
          <FeatureCard
            title="Chart of Accounts"
            description="Hierarchical account structure with parent-child relationships"
          />
          <FeatureCard
            title="Journal Entries"
            description="Double-entry bookkeeping with debit/credit validation"
          />
          <FeatureCard
            title="Fiscal Years"
            description="Accounting period management with year-end locking"
          />
          <FeatureCard
            title="Audit Logs"
            description="Immutable mutation tracking for compliance"
          />
        </div>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Technology Stack
          </h2>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400 sm:grid-cols-2">
            <li>• Next.js 15 (App Router)</li>
            <li>• React 19</li>
            <li>• Tailwind CSS 4</li>
            <li>• Prisma ORM</li>
            <li>• PostgreSQL</li>
            <li>• Zod Validation</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
