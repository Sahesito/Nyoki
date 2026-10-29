import { redirect } from "next/navigation";
import { obtenerSesion } from "@/lib/session";
import { cerrarSesionAccion } from "./actions";

export default async function PanelPage() {
    const sesion = await obtenerSesion();

    if (!sesion) {
        redirect("/login");
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
            <h1 className="text-2xl font-semibold">Panel</h1>
            <p>
                Sesión iniciada como {sesion.user.name} ({sesion.user.role})
            </p>
            <form action={cerrarSesionAccion}>
                <button type="submit" className="rounded border px-3 py-2">
                    Cerrar sesión
                </button>
            </form>
        </main>
    );
}