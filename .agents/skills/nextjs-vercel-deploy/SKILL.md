---
name: nextjs-vercel-deploy
description: Procedimientos recomendados y patrones de compilación para Next.js 14 App Router y Vercel en la plataforma Fundación Senda Mujer.
---

# 🚀 Skill: Next.js & Vercel Deployment Guidance

## Reglas de Compilación
1. **Tipado Estricto**: Todo componente o API route debe verificar `npx tsc --noEmit` antes de ser enviado a producción.
2. **Resiliencia en Serverless**:
   - Toda API route debe incluir try/catch con fallback a simulación mock garantizada si la base de datos no está disponible.
   - Jamás retornar `status 500` crudo al cliente sin fallback visual comprensible.
3. **Optimización de Assets**:
   - Reutilizar Tailwind CSS 3.4.7 y Lucide React sin dependencias externas pesadas.
