import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const password = await bcrypt.hash("Admin@2026", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@quoosh.local" },
    update: { role: "ADMIN", password },
    create: {
      email: "admin@quoosh.local",
      name: "Super Admin",
      password,
      role: "ADMIN",
    },
  })

  console.log(`✅ Admin user ready:`)
  console.log(`   Email   : admin@quoosh.local`)
  console.log(`   Password: Admin@2026`)
  console.log(`   Role    : ${admin.role}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
