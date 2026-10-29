export const VENTANA_MS = 1000 * 60 * 15; // 15 minutos
export const MAX_FALLOS_CORREO = 5;
export const MAX_FALLOS_IP = 20;

export function estaBloqueado(fallosCorreo: number, fallosIp: number): boolean {
    return fallosCorreo >= MAX_FALLOS_CORREO || fallosIp >= MAX_FALLOS_IP;
}