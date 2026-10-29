import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashearClave } from "../src/lib/password";

async function main() {
    if (process.env.NODE_ENV === "production") {
        throw new Error("El seed de desarrollo no puede ejecutarse en producción");
    }

    const connectionString = process.env.DATABASE_URL;
    const clave = process.env.SEED_ADMIN_PASSWORD;

    if (!connectionString) {
        throw new Error("DATABASE_URL no está definida");
    }
    if (!clave) {
        throw new Error("Define SEED_ADMIN_PASSWORD antes de ejecutar el seed");
    }

    const prisma = new PrismaClient({
        adapter: new PrismaPg({ connectionString }),
    });

    try {
        const organizacion = await prisma.organization.upsert({
            where: { slug: "restaurante-demo" },
            update: {},
            create: { name: "Restaurante Demo", slug: "restaurante-demo" },
        });

        const passwordHash = await hashearClave(clave);

        await prisma.user.upsert({
            where: { email: "admin@demo.nyoki.test" },
            update: {},
            create: {
                organizationId: organizacion.id,
                email: "admin@demo.nyoki.test",
                name: "Administrador Demo",
                passwordHash,
                role: "ADMIN",
            },
        });

        console.log("Seed completado: restaurante-demo y admin@demo.nyoki.test");
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});