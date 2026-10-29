"use server";

import { redirect } from "next/navigation";
import { verificarCredenciales } from "@/lib/auth";
import { crearSesion } from "@/lib/session";
import { loginSchema } from "@/lib/validaciones";

export type EstadoLogin = { error?: string };

export async function iniciarSesion(
    _estado: EstadoLogin,
    formData: FormData,
): Promise<EstadoLogin> {
    const datos = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!datos.success) {
        return { error: "Revisa el correo y la contraseña" };
    }

    const usuario = await verificarCredenciales(
        datos.data.email,
        datos.data.password,
    );

    if (!usuario) {
        return { error: "Credenciales incorrectas" };
    }

    await crearSesion(usuario.id);
    redirect("/panel");
}