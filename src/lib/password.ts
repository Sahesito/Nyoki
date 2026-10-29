import { hash, verify } from "@node-rs/argon2";

// Parámetros mínimos recomendados por OWASP para Argon2id.
// El algoritmo no se indica porque Argon2id ya es el valor por defecto.
const OPCIONES = {
    memoryCost: 19456, // KiB (19 MiB)
    timeCost: 2,
    parallelism: 1,
};

export const LARGO_MINIMO = 12;
export const LARGO_MAXIMO = 128;

export function validarClave(clave: string): string | null {
    if (clave.length < LARGO_MINIMO) {
        return `La contraseña debe tener al menos ${LARGO_MINIMO} caracteres`;
    }
    if (clave.length > LARGO_MAXIMO) {
        return `La contraseña no puede superar ${LARGO_MAXIMO} caracteres`;
    }
    return null;
}

export async function hashearClave(clave: string): Promise<string> {
    const error = validarClave(clave);
    if (error) {
        throw new Error(error);
    }
    return hash(clave, OPCIONES);
}

export async function verificarClave(
    hashGuardado: string,
    clave: string,
): Promise<boolean> {
    if (clave.length > LARGO_MAXIMO) {
        return false;
    }
    try {
        return await verify(hashGuardado, clave);
    } catch {
        return false;
    }
}