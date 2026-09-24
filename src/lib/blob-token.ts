/**
 * Helper para resolver el token de Vercel Blob en cualquier entorno.
 * Detecta nombres estándar y cualquier variable que contenga un token vercel_blob_rw_*.
 */

export function getVercelBlobToken(): string | undefined {
  // 1. Nombres estándar directos
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return process.env.BLOB_READ_WRITE_TOKEN.trim();
  }
  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    return process.env.VERCEL_BLOB_READ_WRITE_TOKEN.trim();
  }
  if (process.env.BLOB_TOKEN) {
    return process.env.BLOB_TOKEN.trim();
  }

  // 2. Búsqueda por prefijo de tienda (ej: FUNDACIONSENDAMUJER_BLOB_READ_WRITE_TOKEN)
  const envKeys = Object.keys(process.env);
  for (const key of envKeys) {
    if (key.includes('BLOB') && (key.includes('TOKEN') || key.includes('READ_WRITE'))) {
      const val = process.env[key];
      if (val && typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }
  }

  // 3. Búsqueda profunda de cualquier valor que comience con vercel_blob_rw_
  for (const key of envKeys) {
    const val = process.env[key];
    if (typeof val === 'string' && val.trim().startsWith('vercel_blob_rw_')) {
      return val.trim();
    }
  }

  return undefined;
}

export function getAvailableEnvKeyNames(): string[] {
  return Object.keys(process.env).map((k) => {
    // Si contiene secretos, solo mostrar el nombre de la variable
    return k;
  });
}
