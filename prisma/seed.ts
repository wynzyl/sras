import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Seed SchoolYear (idempotent - find or create)
  console.log("📅 Seeding SchoolYear...");
  let schoolYear = await prisma.schoolYear.findFirst({
    where: { name: "2026-2027" },
  });

  if (schoolYear) {
    schoolYear = await prisma.schoolYear.update({
      where: { id: schoolYear.id },
      data: {
        isActive: true,
        startDate: new Date("2026-06-01"),
        endDate: new Date("2027-03-31"),
      },
    });
  } else {
    schoolYear = await prisma.schoolYear.create({
      data: {
        name: "2026-2027",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2027-03-31"),
        isActive: true,
      },
    });
  }
  console.log(`✓ SchoolYear: ${schoolYear.name}`);

  // Seed GradeLevels (K-12)
  console.log("📚 Seeding GradeLevels...");
  const gradeLevels = [
    { code: "K", name: "Kinder", sortOrder: 0 },
    { code: "G1", name: "Grade 1", sortOrder: 1 },
    { code: "G2", name: "Grade 2", sortOrder: 2 },
    { code: "G3", name: "Grade 3", sortOrder: 3 },
    { code: "G4", name: "Grade 4", sortOrder: 4 },
    { code: "G5", name: "Grade 5", sortOrder: 5 },
    { code: "G6", name: "Grade 6", sortOrder: 6 },
    { code: "G7", name: "Grade 7", sortOrder: 7 },
    { code: "G8", name: "Grade 8", sortOrder: 8 },
    { code: "G9", name: "Grade 9", sortOrder: 9 },
    { code: "G10", name: "Grade 10", sortOrder: 10 },
    { code: "G11", name: "Grade 11", sortOrder: 11 },
    { code: "G12", name: "Grade 12", sortOrder: 12 },
  ];

  for (const gradeLevel of gradeLevels) {
    await prisma.gradeLevel.upsert({
      where: { code: gradeLevel.code },
      update: {
        name: gradeLevel.name,
        sortOrder: gradeLevel.sortOrder,
      },
      create: gradeLevel,
    });
    console.log(`✓ GradeLevel: ${gradeLevel.code} - ${gradeLevel.name}`);
  }

  // Seed Accounts
  console.log("💰 Seeding Accounts...");
  const accounts = [
    {
      code: "CASH",
      name: "Cash",
      type: "ASSET" as const,
    },
    {
      code: "ACCOUNTS_RECEIVABLE",
      name: "Accounts Receivable",
      type: "ASSET" as const,
    },
    {
      code: "TUITION_REVENUE",
      name: "Tuition Revenue",
      type: "REVENUE" as const,
    },
    {
      code: "MISC_REVENUE",
      name: "Miscellaneous Revenue",
      type: "REVENUE" as const,
    },
    {
      code: "DISCOUNT_CONTRA",
      name: "Discounts and Allowances",
      type: "CONTRA_REVENUE" as const,
    },
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { code: account.code },
      update: {
        name: account.name,
        type: account.type,
        isActive: true,
      },
      create: {
        ...account,
        isActive: true,
      },
    });
    console.log(`✓ Account: ${account.code} - ${account.name}`);
  }

  console.log("\n✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
