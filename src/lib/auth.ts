import "server-only";
import { prisma } from "@/lib/prisma";
import { hashearClave, verificarClave } from "@/lib/password";

let hashFalso: string | null = null;

async function obtenerHashFalso(): Promise<string> {
    if (!hashFalso) {
        hashFalso = await hashearClave("clave-falsa-para-igualar-tiempos");
    }
    return hashFalso;
}

export async function verificarCredenciales(
    email: string,
    clave: string,
): Promise<{ id: string } | null> {
    const usuario = await prisma.user.findUnique({ where: { email } });

    if (!usuario || !usuario.active) {
        // Se hace el mismo trabajo para que el tiempo de respuesta no
        // revele si el correo existe.
        await verificarClave(await obtenerHashFalso(), clave);
        return null;
    }

    const correcta = await verificarClave(usuario.passwordHash, clave);
    return correcta ? { id: usuario.id } : null;
}