import { describe, expect, it } from "vitest";
import { loginSchema } from "./validaciones";

describe("validación de login", () => {
    it("normaliza el correo", () => {
        const r = loginSchema.safeParse({
            email: "  Admin@Demo.Nyoki.Test ",
            password: "cualquiera",
        });
        expect(r.success).toBe(true);
        if (r.success) {
            expect(r.data.email).toBe("admin@demo.nyoki.test");
        }
    });

    it("rechaza un correo inválido", () => {
        const r = loginSchema.safeParse({ email: "no-es-correo", password: "x" });
        expect(r.success).toBe(false);
    });

    it("rechaza contraseña vacía", () => {
        const r = loginSchema.safeParse({ email: "a@b.test", password: "" });
        expect(r.success).toBe(false);
    });

    it("rechaza contraseñas excesivamente largas", () => {
        const r = loginSchema.safeParse({
            email: "a@b.test",
            password: "x".repeat(129),
        });
        expect(r.success).toBe(false);
    });
});