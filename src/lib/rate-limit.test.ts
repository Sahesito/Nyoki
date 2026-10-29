import { describe, expect, it } from "vitest";
import {
    MAX_FALLOS_CORREO,
    MAX_FALLOS_IP,
    estaBloqueado,
} from "./rate-limit";

describe("límite de intentos", () => {
    it("no bloquea con pocos fallos", () => {
        expect(estaBloqueado(0, 0)).toBe(false);
        expect(estaBloqueado(MAX_FALLOS_CORREO - 1, MAX_FALLOS_IP - 1)).toBe(false);
    });

    it("bloquea al llegar al límite por correo", () => {
        expect(estaBloqueado(MAX_FALLOS_CORREO, 0)).toBe(true);
    });

    it("bloquea al llegar al límite por IP", () => {
        expect(estaBloqueado(0, MAX_FALLOS_IP)).toBe(true);
    });

    it("sigue bloqueado por encima del límite", () => {
        expect(estaBloqueado(MAX_FALLOS_CORREO + 10, 0)).toBe(true);
    });
});