import { describe, expect, it } from "vitest";
import { hashearClave, validarClave, verificarClave } from "./password";

describe("contraseñas con Argon2id", () => {
    const clave = "ClaveDePrueba-123456";

    it("genera un hash Argon2id y no guarda la clave en texto plano", async () => {
        const hash = await hashearClave(clave);
        expect(hash.startsWith("$argon2id$")).toBe(true);
        expect(hash).not.toContain(clave);
    });

    it("acepta la clave correcta", async () => {
        const hash = await hashearClave(clave);
        expect(await verificarClave(hash, clave)).toBe(true);
    });

    it("rechaza una clave incorrecta", async () => {
        const hash = await hashearClave(clave);
        expect(await verificarClave(hash, "OtraClaveDistinta-999")).toBe(false);
    });

    it("genera hashes distintos para la misma clave (salt aleatoria)", async () => {
        const hash1 = await hashearClave(clave);
        const hash2 = await hashearClave(clave);
        expect(hash1).not.toBe(hash2);
    });

    it("rechaza claves demasiado cortas", async () => {
        expect(validarClave("corta")).not.toBeNull();
        await expect(hashearClave("corta")).rejects.toThrow();
    });

    it("devuelve false con un hash dañado", async () => {
        expect(await verificarClave("esto-no-es-un-hash", clave)).toBe(false);
    });
});