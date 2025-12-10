/**
 * Admin Authentication Helper
 * Gerencia token de autenticação para operações administrativas
 * 
 * TODO: Implementar autenticação real com JWT após banco de dados estar pronto
 */

const STORAGE_KEY = "admin_token";

/**
 * Obter token armazenado localmente
 */
export function getAdminToken(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Armazenar token de admin
 */
export function setAdminToken(password: string): void {
  // Codificar senha em base64
  const token = btoa(password);
  localStorage.setItem(STORAGE_KEY, token);
}

/**
 * Remover token de admin
 */
export function clearAdminToken(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Verificar se há token armazenado
 */
export function hasAdminToken(): boolean {
  return getAdminToken() !== null;
}

/**
 * Obter headers com autenticação
 */
export function getAdminHeaders(): Record<string, string> {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

/**
 * Fazer requisição autenticada
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = getAdminHeaders();
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  });
}
