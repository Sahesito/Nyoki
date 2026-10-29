import { createHash, randomBytes } from "node:crypto";

export const DURACION_SESION_MS = 1000 * 60 * 60 * 8; // 8 horas

export function generarToken(): string {
    return randomBytes(32).toString("base64url");
}

export function hashearToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}

export function calcularExpiracion(ahora: Date = new Date()): Date {
    return new Date(ahora.getTime() + DURACION_SESION_MS);
}

export function estaExpirada(
    expiraEn: Date,
    ahora: Date = new Date(),
): boolean {
    return expiraEn.getTime() <= ahora.getTime();
}