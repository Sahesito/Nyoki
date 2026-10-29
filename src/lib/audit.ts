import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { VENTANA_MS } from "@/lib/rate-limit";

export type AccionAuditoria =
    | "LOGIN_OK"
    | "LOGIN_FAILED"
    | "LOGIN_BLOCKED"
    | "LOGOUT";

export function hashearCorreo(email: string): string {
    return createHash("sha256").update(email).digest("hex");
}

export async function obtenerIp(): Promise<string> {
    const cabeceras = await headers();
    const reenviada = cabeceras.get("x-forwarded-for");
    const ip =
        reenviada?.split(",")[0]?.trim() ||
        cabeceras.get("x-real-ip") ||
        "desconocida";
    return ip.slice(0, 45);
}

export async function registrarEvento(datos: {
    action: AccionAuditoria;
    userId?: string;
    organizationId?: string;
    ip?: string;
    emailHash?: string;
}): Promise<void> {
    await prisma.auditLog.create({ data: datos });
}

export async function contarFallos(emailHash: string, ip: string) {
    const desde = new Date(Date.now() - VENTANA_MS);

    const [porCorreo, porIp] = await Promise.all([
        prisma.auditLog.count({
            where: { action: "LOGIN_FAILED", emailHash, createdAt: { gte: desde } },
        }),
        prisma.auditLog.count({
            where: { action: "LOGIN_FAILED", ip, createdAt: { gte: desde } },
        }),
    ]);

    return { porCorreo, porIp };
}