/**
 * blob-token.ts
 *
 * Resolución del token de Vercel Blob Storage.
 *
 * Vercel inyecta el token automáticamente con el nombre:
 *   BLOB_READ_WRITE_TOKEN
 *
 * Cuando se conecta una tienda Blob a un proyecto en Vercel Storage,
 * el token se inyecta en el runtime serverless con ese nombre exacto.
 *
 * Este helper lo expone de forma confiable y también busca variantes
 * en caso de que el proyecto use un nombre de prefijo de tienda.
 */

export function getVercelBlobToken(): string | undefined {
  // Prioridad 1 — Nombre estándar que Vercel inyecta automáticamente
  const primary = process.env.BLOB_READ_WRITE_TOKEN;
  if (primary && primary.trim().length > 10) return primary.trim();

  // Prioridad 2 — Variante alternativa
  const alt = process.env.VERCEL_BLOB_READ_WRITE_TOKEN;
  if (alt && alt.trim().length > 10) return alt.trim();

  // Prioridad 3 — Nombre corto de conveniencia
  const short = process.env.BLOB_TOKEN;
  if (short && short.trim().length > 10) return short.trim();

  // Prioridad 4 — Búsqueda por patron: cualquier var que contenga un JWT Vercel Blob
  //               (empieza con "vercel_blob_rw_")
  for (const [, val] of Object.entries(process.env)) {
    if (typeof val === 'string' && val.trim().startsWith('vercel_blob_rw_')) {
      return val.trim();
    }
  }

  return undefined;
}
