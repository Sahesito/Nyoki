import { describe, expect, it } from "vitest";
import {
    DURACION_SESION_MS,
    calcularExpiracion,
    estaExpirada,
    generarToken,
    hashearToken,
} from "./session-token";

describe("tokens de sesión", () => {
    it("genera tokens largos y distintos entre sí", () => {
        const a = generarToken();
        const b = generarToken();
        expect(a).toHaveLength(43);
        expect(a).not.toBe(b);
    });

    it("el hash es estable, de 64 caracteres y distinto del token", () => {
        const token = generarToken();
        const hash = hashearToken(token);
        expect(hash).toMatch(/^[0-9a-f]{64}$/);
        expect(hashearToken(token)).toBe(hash);
        expect(hash).not.toContain(token);
    });

    it("calcula la expiración a 8 horas", () => {
        const ahora = new Date("2026-01-01T00:00:00.000Z");
        const expira = calcularExpiracion(ahora);
        expect(expira.getTime() - ahora.getTime()).toBe(DURACION_SESION_MS);
    });

    it("detecta sesiones vencidas y vigentes", () => {
        const ahora = new Date("2026-01-01T12:00:00.000Z");
        expect(estaExpirada(new Date("2026-01-01T11:59:59.000Z"), ahora)).toBe(true);
        expect(estaExpirada(new Date("2026-01-01T12:00:00.000Z"), ahora)).toBe(true);
        expect(estaExpirada(new Date("2026-01-01T12:00:01.000Z"), ahora)).toBe(false);
    });
});