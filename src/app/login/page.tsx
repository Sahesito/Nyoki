"use client";

import { useActionState } from "react";
import { iniciarSesion, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = {};

export default function LoginPage() {
    const [estado, accion, pendiente] = useActionState(
        iniciarSesion,
        estadoInicial,
    );

    return (
        <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 p-6">
            <h1 className="text-2xl font-semibold">Iniciar sesión</h1>

            <form action={accion} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-sm">
                    Correo
                    <input
                        name="email"
                        type="email"
                        autoComplete="username"
                        required
                        className="rounded border px-3 py-2"
                    />
                </label>

                <label className="flex flex-col gap-1 text-sm">
                    Contraseña
                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="rounded border px-3 py-2"
                    />
                </label>

                {estado.error ? (
                    <p role="alert" className="text-sm text-red-600">
                        {estado.error}
                    </p>
                ) : null}

                <button
                    type="submit"
                    disabled={pendiente}
                    className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
                >
                    {pendiente ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
        </main>
    );
}