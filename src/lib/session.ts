import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
    calcularExpiracion,
    estaExpirada,
    generarToken,
    hashearToken,
} from "@/lib/session-token";

const esProduccion = process.env.NODE_ENV === "production";

export const NOMBRE_COOKIE = esProduccion
    ? "__Host-nyoki_session"
    : "nyoki_session";

export async function crearSesion(userId: string): Promise<void> {
    const token = generarToken();
    const expiresAt = calcularExpiracion();

    await prisma.session.create({
        data: { id: hashearToken(token), userId, expiresAt },
    });

    const almacen = await cookies();
    almacen.set(NOMBRE_COOKIE, token, {
        httpOnly: true,
        secure: esProduccion,
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

export async function obtenerSesion() {
    const almacen = await cookies();
    const token = almacen.get(NOMBRE_COOKIE)?.value;
    if (!token) {
        return null;
    }

    const sesion = await prisma.session.findUnique({
        where: { id: hashearToken(token) },
        include: {
            user: {
                select: {
                    id: true,
                    organizationId: true,
                    email: true,
                    name: true,
                    role: true,
                    active: true,
                },
            },
        },
    });

    if (!sesion) {
        return null;
    }

    if (estaExpirada(sesion.expiresAt) || !sesion.user.active) {
        await prisma.session.deleteMany({ where: { id: sesion.id } });
        return null;
    }

    return { sessionId: sesion.id, user: sesion.user };
}

export async function cerrarSesion(): Promise<void> {
    const almacen = await cookies();
    const token = almacen.get(NOMBRE_COOKIE)?.value;

    if (token) {
        await prisma.session.deleteMany({ where: { id: hashearToken(token) } });
    }

    almacen.delete(NOMBRE_COOKIE);
}