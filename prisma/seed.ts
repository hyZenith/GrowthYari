import "dotenv/config"
import bcrypt from "bcryptjs";
import {prisma} from "../lib/prisma";

    

async function main() {

    const adminMail = "akash@growthyari.com";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminMail },
    })

    if (existingAdmin) {
        console.log("Admin already exists. Skipping seeding.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Akash@123", 10);

    await prisma.user.create({
        data: {
            name: "Growthyari Admin",
            email: adminMail,
            phone: "1234567890",
            password: hashedPassword,
            role: "ADMIN",
        }
    })
    console.log("Admin user created successfully.");
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
})
.finally(async() => {
    await prisma.$disconnect();
})