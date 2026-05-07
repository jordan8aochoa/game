// Database client stub — replace with actual Prisma client once database is configured
// Run: npx prisma generate && npx prisma db push

export function getPrisma(): never {
  throw new Error(
    "Database not configured. Set DATABASE_URL in .env.local and run: npx prisma generate && npx prisma db push"
  );
}

// To use Prisma in production, replace this file with:
//
// import { PrismaClient } from "@prisma/client";
// const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
// export const prisma = globalForPrisma.prisma ?? new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
