# Arquitectura del CRM — Fundación Senda Mujer

*Documento de arquitectura v1.0 · Mesa de trabajo de arquitectura (frontend, backend, datos, seguridad, DevOps, UX y dominio) · Octubre 2026*

## 1. Mesa de trabajo: roles y decisiones

Para este diseño se simuló una mesa técnica con seis perfiles. Cada uno aportó una decisión clave.

| Rol | Pregunta que defendió | Decisión resultante |
| --- | --- | --- |
| Arquitecto de solución | ¿Cómo evitamos construir algo que la fundación no pueda mantener? | Monolito modular (no microservicios), un solo despliegue, módulos con fronteras claras |
| Líder backend | ¿Cómo garantizamos integridad de donaciones y casos? | API REST + eventos de dominio, PostgreSQL transaccional, colas para tareas lentas |
| Líder frontend | ¿Cómo lo usa una persona sin perfil técnico, desde el celular? | Aplicación web responsiva y PWA, diseño por roles, accesibilidad WCAG 2.2 AA |
| Datos y analítica | ¿Cómo medimos impacto sin exponer datos sensibles? | Esquema relacional + vistas de analítica anonimizadas |
| Seguridad y privacidad | ¿Qué pasa si se filtra información de una participante? | Datos sensibles cifrados, acceso por necesidad (need-to-know), auditoría total |
| Producto y dominio | ¿Qué diferencia a una fundación de mujeres de un CRM comercial? | Separar el CRM de donantes del módulo de atención a participantes, con permisos distintos |

**Decisión central:** una fundación que trabaja con mujeres maneja dos tipos de relaciones muy distintas: *personas que apoyan* (donantes, voluntarias, aliados) y *personas que son atendidas* (participantes). Los datos de las segundas son altamente sensibles y deben vivir aislados, con reglas de acceso estrictas. Esta separación es el eje de toda la arquitectura.

## 2. Supuestos y alcance

No conozco aún los detalles operativos de la fundación, así que se asumió lo siguiente (confirmar en la sección 16):

- Organización pequeña o mediana: entre 5 y 40 usuarios internos, con miles (no millones) de contactos.
- Opera principalmente en Colombia, con moneda COP y posibles donaciones en USD.
- Tiene programas dirigidos a mujeres (formación, acompañamiento, emprendimiento, atención psicosocial o jurídica, entre otros).
- Recibe donaciones de personas naturales, empresas y cooperación/subvenciones.
- Presupuesto de tecnología limitado: se prioriza bajo costo operativo y herramientas de código abierto.

**Fuera de alcance de la versión 1:** contabilidad completa (se integra con el sistema contable existente), nómina, y app móvil nativa.

## 3. Principios de arquitectura

1. **Privacidad por diseño.** Menos datos, menos riesgo. Solo se recolecta lo necesario.
2. **Simplicidad operativa.** Pocas piezas móviles; que una persona de TI (o un proveedor externo) pueda operarlo.
3. **Una sola fuente de verdad.** Cada persona existe una sola vez, con múltiples roles (donante, voluntaria, participante).
4. **Auditable.** Toda lectura o cambio de datos sensibles queda registrado.
5. **Evolutivo.** Módulos desacoplados para poder crecer sin reescribir.
6. **Sin dependencia de un solo proveedor.** Contenedores y estándares abiertos.

## 4. Visión general del sistema

```
[Navegador / PWA]  →  [CDN + WAF]  →  [Frontend Next.js]
                                           │
                                           ▼
                                   [API Gateway / NestJS]
   ┌──────────────┬────────────────┬──────────────┬──────────────┐
   │ Identidad    │ Personas (CRM) │ Donaciones   │ Programas /  │
   │ y permisos   │ y organizaciones│ y campañas  │ participantes│
   ├──────────────┼────────────────┼──────────────┼──────────────┤
   │ Voluntariado │ Eventos        │ Subvenciones │ Comunicación │
   ├──────────────┴────────────────┴──────────────┴──────────────┤
   │ Reportes · Auditoría · Notificaciones · Integraciones         │
   └────────┬───────────────┬───────────────┬───────────────┬─────┘
            ▼               ▼               ▼               ▼
      PostgreSQL         Redis          Almacenamiento    Cola de trabajos
   (datos + RLS)   (caché, sesiones)   de archivos (S3)    (BullMQ)
```

**Estilo:** monolito modular con una API, una base de datos principal y workers asíncronos. Cada módulo expone una interfaz interna y se comunica con los demás mediante eventos de dominio (por ejemplo, `DonacionRegistrada`), lo que permite extraer un módulo como servicio más adelante si fuera necesario.

## 5. Stack tecnológico recomendado

| Capa | Tecnología | Por qué |
| --- | --- | --- |
| Frontend | Next.js + React + TypeScript | Ecosistema grande, SSR, PWA, fácil de contratar talento |
| UI | Tailwind CSS + shadcn/ui + Radix | Componentes accesibles y personalizables |
| Estado y datos | TanStack Query, React Hook Form + Zod | Caché de servidor y validación compartida |
| Gráficas | Recharts o ECharts | Dashboards de impacto |
| Backend | Node.js + NestJS + TypeScript | Estructura modular, inyección de dependencias, mismo lenguaje que el frontend |
| ORM | Prisma o TypeORM + migraciones versionadas | Esquema controlado |
| Base de datos | PostgreSQL 16 | Transaccional, JSONB, Row-Level Security, cifrado por columna |
| Caché y colas | Redis + BullMQ | Envíos masivos, recordatorios, importaciones |
| Archivos | S3 compatible (AWS S3, Cloudflare R2 o MinIO) | Documentos, certificados, adjuntos cifrados |
| Búsqueda | PostgreSQL full-text (v1); OpenSearch si crece | Evita infraestructura extra al inicio |
| Autenticación | Keycloak (autoalojado) o Auth0/Clerk | OIDC, MFA, SSO |
| Correo | Amazon SES, Postmark o SendGrid | Entregabilidad y plantillas |
| Mensajería | WhatsApp Business API (proveedor oficial) | Canal principal en Colombia |
| Pagos | Wompi, PayU o Mercado Pago (COP); Stripe/PayPal (exterior) | Cobertura local y recurrentes |
| Infraestructura | Docker, Terraform, GitHub Actions | Reproducible y portable |
| Observabilidad | OpenTelemetry, Grafana, Loki, Sentry | Monitoreo y errores |

## 6. Módulos funcionales

### 6.1 Identidad, roles y permisos (IAM)

- Inicio de sesión con MFA obligatorio para roles con acceso a datos sensibles.
- RBAC (roles) + ABAC (atributos): por ejemplo, una psicóloga solo ve las participantes asignadas a ella.
- Roles base: Administradora, Dirección, Desarrollo/Recaudación, Comunicaciones, Coordinadora de programa, Profesional de atención (psicosocial/jurídica), Voluntaria coordinadora, Contabilidad (solo lectura financiera), Auditoría.
- Gestión de sesiones, dispositivos y cierre remoto.

### 6.2 Personas y organizaciones (núcleo CRM)

- Registro único de persona con **roles múltiples** (donante, voluntaria, aliada, participante, proveedor).
- Organizaciones (empresas, fundaciones, entidades públicas) con contactos asociados.
- Hogares/relaciones, etiquetas, segmentos dinámicos, línea de tiempo de interacciones.
- Detección y fusión de duplicados, importación desde Excel/CSV con validación.
- Preferencias de comunicación y **registro de consentimiento** por finalidad.

### 6.3 Donaciones y recaudación

- Donaciones únicas y recurrentes (suscripciones), en dinero y en especie.
- Pasarelas de pago, páginas y formularios públicos de donación embebibles.
- Campañas, fondos/destinos, metas y seguimiento de avance.
- Recibos y **certificados de donación** automáticos en PDF (validar formato y requisitos con la contadora y la normativa tributaria vigente).
- Gestión de pledges (compromisos), conciliación con extractos y reintentos de cobros fallidos.
- Donantes de nivel medio y mayor: pipeline de oportunidades, scoring de afinidad y capacidad.
- Recaudación entre pares (campañas de terceras personas).

### 6.4 Programas y participantes (módulo sensible)

- Catálogo de programas, cohortes, sesiones y asistencia.
- Ficha de participante con inscripción, consentimiento informado, plan de acompañamiento y seguimiento.
- Gestión de casos con notas confidenciales, derivaciones y alertas de riesgo.
- Indicadores de resultado e impacto (línea base, seguimiento, cierre).
- Datos sensibles **cifrados por columna**, accesibles solo por profesionales asignados y con registro de cada consulta.
- Opción de **modo de identidad protegida** (seudónimo en pantallas y reportes).

### 6.5 Voluntariado

- Perfiles, habilidades, disponibilidad, verificación de antecedentes cuando aplique.
- Turnos, asignación a actividades, registro y certificación de horas.
- Comunicación y reconocimiento.

### 6.6 Eventos

- Creación de eventos presenciales y virtuales, inscripciones, boletería, check-in con QR.
- Eventos de recaudación con mesas, patrocinadores y subastas.
- Encuestas posteriores y conversión de asistentes a donantes o voluntarias.

### 6.7 Subvenciones y cooperación

- Pipeline de convocatorias, fechas límite y responsables.
- Documentos de postulación, presupuesto, cronograma y entregables.
- Seguimiento de desembolsos, informes narrativos y financieros por donante institucional.
- Vinculación de gastos y actividades con indicadores comprometidos.

### 6.8 Comunicación

- Correo masivo con plantillas, segmentación y pruebas A/B.
- WhatsApp y SMS con plantillas aprobadas y consentimiento verificado.
- Journeys automáticos: bienvenida, agradecimiento, reactivación, renovación de recurrente.
- Historial unificado por persona y bandeja compartida.
- Cumplimiento de bajas inmediatas (opt-out) en todos los canales.

### 6.9 Reportes y analítica

- Tableros: recaudación, retención de donantes, LYBUNT/SYBUNT, valor de vida del donante, embudo de campañas.
- Tablero de impacto por programa, con datos agregados y anonimizados.
- Reportes exportables (PDF, Excel) para donantes institucionales y junta directiva.
- Constructor de reportes con filtros guardados.

### 6.10 Administración y configuración

- Campos personalizados, listas de valores, plantillas, flujos de aprobación.
- Parámetros de la fundación (NIT, logos, textos legales).
- Respaldo, exportación total de datos y panel de auditoría.

## 7. Modelo de datos (núcleo)

Entidades principales y relaciones clave:

| Entidad | Descripción | Relaciones |
| --- | --- | --- |
| `persona` | Identidad única (nombre, documento, contacto, fecha de nacimiento) | 1–N `rol_persona`, `consentimiento`, `interaccion` |
| `rol_persona` | Rol de la persona (donante, voluntaria, participante…) | N–1 `persona` |
| `organizacion` | Entidad jurídica | N–N `persona` mediante `contacto_organizacion` |
| `donacion` | Monto, moneda, fecha, medio, estado | N–1 `persona`/`organizacion`, N–1 `campana`, N–1 `fondo` |
| `suscripcion_donacion` | Donación recurrente | 1–N `donacion` |
| `campana` / `fondo` | Contexto y destino de recaudación | 1–N `donacion` |
| `oportunidad` | Pipeline de grandes donantes y subvenciones | N–1 `persona`/`organizacion` |
| `subvencion` | Convocatoria, monto, estado, entregables | 1–N `desembolso`, `informe` |
| `programa` / `cohorte` | Oferta de servicios | 1–N `inscripcion` |
| `participante` | Extensión sensible de `persona` (esquema aislado) | 1–N `caso`, `inscripcion` |
| `caso` / `nota_caso` | Acompañamiento y notas confidenciales (cifradas) | N–1 `participante`, N–1 `usuario` asignado |
| `voluntario_turno` | Participación y horas | N–1 `persona`, N–1 `actividad` |
| `evento` / `inscripcion_evento` | Gestión de eventos | N–1 `persona` |
| `comunicacion` | Mensajes enviados y recibidos por canal | N–1 `persona` |
| `consentimiento` | Finalidad, canal, fecha, evidencia, estado | N–1 `persona` |
| `usuario` / `rol` / `permiso` | Seguridad interna | N–N |
| `auditoria` | Quién, qué, cuándo, desde dónde, sobre qué registro | Inmutable (solo inserción) |
| `documento` | Archivo en almacenamiento externo con referencia y cifrado | Polimórfico |

**Decisiones de datos:**

- Claves primarias UUID v7 (ordenables y no adivinables).
- Borrado lógico más política de retención y anonimización definitiva.
- Esquemas separados en PostgreSQL: `crm`, `programas_sensibles`, `finanzas`, `auditoria`, con roles de base de datos distintos.
- **Row-Level Security** para que el acceso a participantes se aplique también a nivel de base de datos, no solo en la aplicación.
- Cifrado por columna para notas de caso, diagnósticos, documentos de identidad y datos de salud o violencia.

## 8. Arquitectura del backend

**Estructura por módulos (NestJS):**

```
src/
  modules/
    identidad/        personas/        donaciones/
    programas/        voluntariado/    eventos/
    subvenciones/     comunicacion/    reportes/
    auditoria/        integraciones/   administracion/
  shared/
    dominio/ (eventos, value objects)   seguridad/   infraestructura/
  workers/            (colas: correo, WhatsApp, importaciones, conciliaciones)
```

**Capas dentro de cada módulo:** controlador → caso de uso (servicio de aplicación) → dominio → repositorio. Las reglas de negocio viven en el dominio, no en los controladores.

**API:**

- REST documentada con OpenAPI 3.1 (versionada `/api/v1`), con generación automática de cliente TypeScript para el frontend.
- Paginación por cursor, filtros estandarizados, idempotencia con cabecera `Idempotency-Key` en pagos y envíos.
- Webhooks entrantes (pasarelas, WhatsApp, correo) con verificación de firma y reintentos.
- Webhooks salientes opcionales para integraciones futuras.

**Procesamiento asíncrono:** importaciones masivas, envíos de campañas, cobros recurrentes, generación de certificados, cálculo de segmentos y reportes pesados corren en workers con reintentos y *dead-letter queue*.

**Eventos de dominio (ejemplos):** `DonacionRegistrada` → genera recibo, agradece y actualiza métricas; `PersonaFusionada`; `ConsentimientoRevocado` → detiene envíos; `CasoEscalado` → notifica a la coordinación.

## 9. Arquitectura del frontend

- **Aplicación única con áreas por rol:** el menú y las pantallas se adaptan a los permisos.
- **Estructura por funcionalidades** (feature-based): cada módulo con sus páginas, componentes, hooks y esquemas.
- **Sistema de diseño propio** con tokens (color, tipografía, espacio), modo claro/oscuro y componentes accesibles.
- **Pantallas clave:** panel inicial por rol, ficha 360° de persona, búsqueda global (Ctrl/Cmd+K), pipeline de donantes tipo kanban, constructor de segmentos, editor de plantillas de correo, calendario de eventos y turnos, tablero de impacto, centro de tareas.
- **PWA:** instalable, funciona con conexión inestable para registro de asistencia en terreno, con sincronización posterior.
- **Accesibilidad y localización:** español de Colombia por defecto, internacionalización preparada para inglés, WCAG 2.2 AA, navegación por teclado, contraste adecuado.
- **Seguridad en el cliente:** cookies httpOnly y SameSite, política de contenido (CSP), sin datos sensibles en almacenamiento local, ocultamiento de campos sensibles por defecto (se revelan con acción registrada).
- **Portales externos:** portal de la persona donante (historial, certificados, actualizar datos y preferencias) y portal de voluntarias (turnos y horas).

## 10. Seguridad y privacidad

Este es el componente más crítico por la naturaleza de la fundación.

**Marco normativo (Colombia, a validar con asesoría jurídica):**

- Ley 1581 de 2012 y Decreto 1377 de 2013 (protección de datos personales / habeas data), con política de tratamiento, autorizaciones y registro de bases de datos ante la SIC cuando aplique.
- Tratamiento de **datos sensibles y de personas en situación de vulnerabilidad**: autorización expresa, finalidad específica y medidas reforzadas.
- Si hay donantes o aliados en la Unión Europea u otros países, evaluar requisitos adicionales (por ejemplo, GDPR).

**Controles técnicos:**

| Área | Control |
| --- | --- |
| Autenticación | MFA obligatorio, contraseñas robustas, bloqueo por intentos, SSO opcional |
| Autorización | RBAC + ABAC + RLS en base de datos; principio de mínimo privilegio |
| Cifrado | TLS 1.3 en tránsito; cifrado en reposo (disco y almacenamiento); cifrado por columna con claves en KMS/Vault |
| Auditoría | Registro inmutable de accesos, consultas a fichas sensibles, exportaciones y cambios de permisos |
| Datos sensibles | Aislamiento de esquema, seudonimización, enmascarado en pantallas, marca de agua en exportaciones |
| Aplicación | Validación de entradas, protección OWASP Top 10, límites de tasa, CSRF, CSP, escaneo de dependencias |
| Pagos | No almacenar datos de tarjeta; tokenización por la pasarela (alcance PCI mínimo) |
| Respaldos | Diarios cifrados, copia en otra región, restauración probada cada trimestre |
| Continuidad | Objetivos propuestos: RPO ≤ 24 h (≤ 1 h con respaldo continuo), RTO ≤ 4 h |
| Derechos de las personas | Consulta, actualización, supresión y revocatoria desde el sistema, con trazabilidad |
| Personal | Acuerdos de confidencialidad, capacitación anual, revisión trimestral de accesos |

**Protección especial:** alertas ante exportaciones masivas, bloqueo de captura de datos de participantes en dispositivos no autorizados y procedimiento de respuesta a incidentes (detección, contención, notificación a afectadas y a la autoridad).

## 11. Integraciones

| Sistema | Tipo | Propósito |
| --- | --- | --- |
| Pasarelas de pago (Wompi/PayU/Mercado Pago/Stripe) | API + webhooks | Donaciones únicas y recurrentes |
| Contabilidad (Siigo, Alegra, World Office u otro) | API/exportación | Asientos contables y conciliación |
| Correo transaccional y masivo | API | Recibos, campañas |
| WhatsApp Business / SMS | API | Comunicación y recordatorios |
| Google Workspace / Microsoft 365 | OAuth | Calendario, contactos, documentos |
| Formularios web y redes sociales | Webhooks | Captura de leads y donantes |
| Videoconferencia (Meet/Zoom) | API | Sesiones virtuales de programas |
| Herramientas de analítica (Looker Studio/Metabase) | Conexión de solo lectura a réplica | Reportes avanzados |

Todas las integraciones viven detrás de una capa de adaptadores para poder cambiar de proveedor sin tocar el dominio.

## 12. Infraestructura y despliegue

**Opción recomendada (equilibrio costo/robustez):** nube pública con servicios gestionados.

- Contenedores Docker en un servicio gestionado (AWS ECS Fargate, Google Cloud Run o similar).
- PostgreSQL gestionado (RDS/Cloud SQL) con alta disponibilidad, respaldo continuo y réplica de lectura para reportes.
- Redis gestionado, almacenamiento de objetos con cifrado y versionado.
- Región cercana (por ejemplo, São Paulo) para baja latencia en Colombia.
- CDN y WAF delante de la aplicación.

**Entornos:** desarrollo, pruebas (staging con datos sintéticos, nunca reales) y producción.

**CI/CD (GitHub Actions):**

1. Lint, pruebas unitarias y de integración.
2. Análisis estático y de dependencias (SAST, SCA), escaneo de secretos y de contenedores.
3. Construcción de imágenes y migraciones de base de datos.
4. Despliegue automático a staging, aprobación manual y despliegue gradual a producción con *rollback* rápido.

**Infraestructura como código:** Terraform; secretos en un gestor (AWS Secrets Manager, Vault).

**Alternativa de bajo costo:** un servidor virtual con Docker Compose, PostgreSQL con respaldos automáticos externos y Caddy/Traefik como proxy. Viable para la fase inicial, con plan de migración a servicios gestionados.

## 13. Observabilidad y operación

- Registros estructurados, métricas y trazas con OpenTelemetry; tableros en Grafana.
- Sentry para errores de frontend y backend (sin enviar datos personales).
- Alertas de disponibilidad, tasa de errores, latencia, colas atascadas y cobros recurrentes fallidos.
- Objetivo de disponibilidad: 99,5 % mensual en la versión 1.
- Manual de operación (*runbooks*), ventanas de mantenimiento y registro de cambios.

## 14. Estrategia de calidad y pruebas

| Tipo | Herramienta sugerida | Qué cubre |
| --- | --- | --- |
| Unitarias | Vitest/Jest | Reglas de dominio |
| Integración | Testcontainers + PostgreSQL real | Repositorios, RLS, colas |
| Contrato | OpenAPI + Pact (opcional) | API y webhooks |
| End-to-end | Playwright | Flujos críticos (donar, inscribir, fusionar) |
| Accesibilidad | axe + pruebas manuales con lectores de pantalla | WCAG 2.2 AA |
| Seguridad | OWASP ZAP, pruebas de penetración externas anuales | Vulnerabilidades |
| Carga | k6 | Campañas masivas y picos de donación |
| Datos | Pruebas de restauración y de migración | Respaldos e importaciones |

**Definición de terminado:** cobertura mínima en dominio crítico, revisión de código obligatoria, documentación actualizada y revisión de impacto en privacidad para cualquier campo nuevo con datos personales.

## 15. Hoja de ruta por fases

| Fase | Duración estimada | Entregables |
| --- | --- | --- |
| **0. Descubrimiento** | 2–3 semanas | Talleres con el equipo, mapa de procesos, inventario de datos, definición de roles, política de datos, prototipos de baja fidelidad |
| **1. Fundaciones** | 4–6 semanas | Infraestructura, autenticación, roles, auditoría, núcleo de personas/organizaciones, importación de datos existentes, diseño de sistema |
| **2. Recaudación** | 6–8 semanas | Donaciones, pasarela, recurrentes, campañas, recibos y certificados, segmentación, correo, tablero de recaudación |
| **3. Programas y participantes** | 6–8 semanas | Módulo sensible, casos, asistencia, consentimientos, indicadores de impacto |
| **4. Voluntariado, eventos y subvenciones** | 6 semanas | Turnos, horas, eventos, check-in, pipeline de subvenciones e informes |
| **5. Automatización y analítica** | 4–6 semanas | Journeys, WhatsApp, constructor de reportes, portales de donante y voluntaria |
| **6. Endurecimiento y salida** | 3–4 semanas | Pentest, pruebas de carga, capacitación, migración final, plan de soporte |

Total aproximado: **7 a 9 meses** con un equipo pequeño. Se recomienda lanzar por fases para dar valor desde la fase 2.

**Equipo sugerido:** 1 líder técnica/o, 2 desarrolladores full-stack, 1 diseñador UX/UI, 1 QA (parcial), 1 DevOps/seguridad (parcial) y una persona de la fundación como dueña del producto.

## 16. Riesgos y preguntas abiertas

**Riesgos principales**

| Riesgo | Mitigación |
| --- | --- |
| Filtración de datos de participantes | Aislamiento, cifrado, auditoría, mínimo privilegio, pruebas de penetración |
| Baja adopción del equipo | Co-diseño, capacitación, versión mínima útil temprana |
| Sobrealcance (querer todo al inicio) | Fases con prioridades claras y criterios de aceptación |
| Migración de datos sucios | Limpieza previa, importación con validaciones y revisión humana |
| Dependencia de un proveedor o de una sola persona | Documentación, contenedores, código y datos propiedad de la fundación |
| Cumplimiento legal | Revisión jurídica de autorizaciones, políticas y certificados |

**Preguntas para cerrar el diseño**

1. ¿Qué programas y servicios ofrece hoy Senda Mujer y cuántas participantes atiende al año?
2. ¿Atienden casos de violencia, salud o situaciones legales que requieran confidencialidad reforzada?
3. ¿Cuántas personas usarán el sistema y con qué roles?
4. ¿De dónde vienen hoy los datos (Excel, Google Sheets, otro sistema) y cuántos registros hay?
5. ¿Qué pasarelas de pago y sistema contable usan o prefieren?
6. ¿Reciben donaciones del exterior o subvenciones internacionales?
7. ¿Cuentan con presupuesto aproximado y con apoyo técnico interno?
8. ¿Prefieren construir a medida o evaluar primero una plataforma existente (por ejemplo CiviCRM, Salesforce NPSP o Flowlu con descuento para ONG) y complementarla?

## 17. Recomendación final de la mesa

Si el presupuesto o el tiempo son limitados, la mesa propone una **ruta híbrida**: empezar con una plataforma existente para donantes y comunicaciones (por ejemplo, CiviCRM o una de las soluciones de la guía que compartiste), y construir a medida únicamente el **módulo de participantes y casos**, que es el que ningún CRM comercial resuelve bien y donde la privacidad es decisiva. Esta ruta reduce costo y tiempo, y concentra la inversión donde más valor y riesgo hay.

Si la fundación prefiere un producto propio y completo, la arquitectura de este documento lo soporta de principio a fin.

## 18. Volumen II: Senda CRM sobre Vercel y MongoDB Atlas

Desde esta sección el CRM se diseña sobre Next.js, MongoDB Atlas y Vercel, con un alcance mayor que el del Volumen I: además de donantes y participantes, cubre hogares, proyectos, operaciones, finanzas operativas, activos, ayudas e impacto. Este volumen reemplaza la base PostgreSQL y el despliegue con contenedores de las secciones 5, 7 y 12. Se mantienen los principios de privacidad por diseño, la separación entre quienes apoyan y quienes son atendidas, y la auditoría total.

### 18.1 Qué cambia respecto al Volumen I

| Área | Volumen I | Volumen II | Consecuencia |
| --- | --- | --- | --- |
| Base de datos | PostgreSQL 16 | MongoDB Atlas | No hay seguridad por fila ni uniones fuertes; el aislamiento se aplica en la capa de acceso a datos |
| Despliegue | Contenedores | Vercel (web y API) más un worker opcional | Funciones sin estado; no hay procesos permanentes dentro de Vercel |
| Tareas en segundo plano | BullMQ en un worker | Cola gestionada y Vercel Cron; BullMQ solo con worker externo | Los trabajos se diseñan como lotes cortos y reintentables |
| Aislamiento de datos sensibles | Esquemas separados y RLS | Clasificación por colección, cifrado de campos y repositorios con alcance obligatorio | La seguridad pasa de la base a la aplicación y se prueba con tests |
| Acceso a datos | Prisma o TypeORM | Mongoose con repositorios (o driver nativo) | Esquemas validados en la aplicación y en Atlas |
| Identidad | Keycloak | Auth.js con proveedor de identidad que ofrezca MFA | Menos infraestructura propia |
| Alcance funcional | Donantes y participantes | Plataforma institucional completa | Más módulos; se entrega por fases (sección 41) |

### 18.2 Revisión crítica del documento base

El documento base es una buena columna vertebral funcional. Estos son los puntos que un despliegue real en Vercel y Atlas obliga a corregir o precisar.

| Punto del documento base | Riesgo | Decisión en este volumen |
| --- | --- | --- |
| Prisma para MongoDB | Soporte más limitado que con bases relacionales (sin migraciones de esquema); su estado debe verificarse en la versión vigente | Mongoose con Zod compartido; Prisma solo si el equipo ya lo domina y se valida su soporte |
| BullMQ y Redis dentro del backend en Vercel | Vercel ejecuta funciones efímeras; un worker de BullMQ necesita un proceso permanente | Cola HTTP gestionada y Vercel Cron; worker externo solo para cargas largas |
| Auth.js con MFA obligatorio | Auth.js no entrega MFA completo por sí solo | Proveedor de identidad con MFA (Clerk, WorkOS, Auth0) o TOTP propio con códigos de recuperación |
| Control de acceso solo por rol | MongoDB no tiene seguridad por fila; un filtro olvidado expone datos | Política de autorización central y repositorios que exigen organizationId y alcance en cada consulta |
| Datos de víctimas y menores en una nube de terceros | Riesgo legal y de exposición, incluida la transferencia internacional de datos | Cifrado de campos, acuerdos de tratamiento con cada proveedor y concepto jurídico previo (Ley 1581 de 2012) |
| Cualquier clúster Atlas | Los niveles gratuitos y compartidos no ofrecen respaldo continuo | Clúster dedicado (M10 o superior) con respaldo continuo y retención definida |
| Dashboard con cifras de ejemplo | Las cifras del documento base son maquetas, no datos | Se tratan como diseño de pantalla; los valores salen de agregaciones reales |
| Prisma o Mongoose «según el código actual» | Si ya existe código, cambiar de herramienta tiene costo | Se mantiene lo existente; el dominio se aísla en repositorios para poder cambiarlo después |

### 18.3 Decisiones definitivas

| Área | Decisión | Motivo |
| --- | --- | --- |
| Arquitectura | Monolito modular | Un equipo pequeño, un despliegue, fronteras claras entre módulos |
| Frontend | Next.js (App Router) y TypeScript | Despliegue nativo en Vercel, renderizado en servidor |
| API | Núcleo de dominio en TypeScript puro y capa HTTP (NestJS o Route Handlers) | Portabilidad; la comparación está en la sección 21 |
| Base de datos | MongoDB Atlas, clúster dedicado en São Paulo | Réplica de tres nodos, transacciones y respaldo continuo |
| Validación | Zod en un paquete compartido más JSON Schema en Atlas | Dos barreras: aplicación y base de datos |
| Dinero | Decimal128 con decimal.js en la aplicación | Evita errores de punto flotante |
| Fechas | UTC en la base, America/Bogota en la interfaz | Vencimientos y recordatorios consistentes |
| Autenticación | Auth.js con proveedor de identidad y MFA | Cumple el requisito de MFA para roles críticos |
| Tareas | Cola gestionada y Vercel Cron | Compatible con funciones sin estado |
| Archivos | S3 compatible o R2 con URL firmada | Evita el límite de tamaño de las peticiones en Vercel |
| Observabilidad | Sentry, registros de Vercel y alertas de Atlas | Cobertura sin infraestructura propia |
| CI/CD | GitHub Actions y entornos Preview de Vercel | Cada cambio se prueba antes de producción |
| Multi-organización | organizationId en todas las colecciones de negocio | Preparado para crecer sin rehacer la base |

## 19. Topología de despliegue

&#91;embedded content: arquitectura de despliegue · Vercel, Atlas y servicios\]

La web y la API corren como funciones sin estado en Vercel. Todo lo que necesita guardar algo, esperar o ejecutarse mucho tiempo sale hacia Atlas, la cola o el worker.

### 19.1 Entornos

| Entorno | Vercel | MongoDB Atlas | Datos | Quién accede |
| --- | --- | --- | --- | --- |
| Desarrollo local | Next.js y API en la máquina | MongoDB local con réplica de un nodo (las transacciones lo exigen) | Sintéticos | Equipo técnico |
| Staging | Entorno Preview con dominio fijo | Clúster propio y pequeño | Sintéticos o anonimizados | Equipo técnico y dueña del producto |
| Producción | Entorno Production con el dominio de la fundación | Clúster dedicado con respaldo continuo | Reales | Usuarias autorizadas con MFA |

### 19.2 Reglas de despliegue

- Las funciones y el clúster comparten región (São Paulo) para reducir la latencia de cada consulta.
- Cada entorno tiene sus propias variables y su propio clúster; un Preview jamás apunta a la base de producción.
- Los secretos viven en las variables de entorno de Vercel y de los proveedores, nunca en el repositorio.
- Los despliegues Preview se protegen con autenticación de Vercel para que no sean públicos.
- Vercel no ofrece una IP de salida fija en todos los planes. Opciones: permitir el acceso desde cualquier IP en Atlas con un usuario de mínimo privilegio y TLS, o una conexión privada si el plan de Vercel la incluye (verificar al contratar).
- Los datos de producción nunca se copian a desarrollo; staging usa datos sintéticos o anonimizados.
- El dominio y el DNS quedan a nombre de la fundación, no de un contratista.

## 20. Límites de Vercel y cómo se resuelven

Vercel resuelve la web y la API sin servidores, pero impone siete límites que condicionan el diseño; cada uno tiene una salida concreta. Los valores exactos dependen del plan y cambian con el tiempo, por eso conviene confirmarlos en la documentación vigente antes de contratar.

| # | Límite | Efecto en el CRM | Solución |
| --- | --- | --- | --- |
| 1 | Las funciones tienen una duración máxima según el plan | Importaciones, informes pesados y envíos masivos no caben en una petición | La petición solo registra el trabajo y responde; el trabajo se procesa en lotes cortos desde la cola |
| 2 | No hay procesos permanentes | BullMQ no puede ejecutarse dentro de Vercel | Cola gestionada (QStash o Inngest) o un worker externo pequeño |
| 3 | Cada instancia de función abre su propio grupo de conexiones | Muchas instancias pueden agotar las conexiones de Atlas | Cliente MongoDB creado una sola vez por módulo, grupo pequeño y alerta de conexiones en Atlas |
| 4 | El cuerpo de una petición tiene un tamaño máximo (cercano a 4,5 MB; verificar) | Subir documentos por la API falla | Subida directa al almacenamiento con URL firmada de vida corta |
| 5 | Vercel Cron tiene límites de frecuencia y cantidad según el plan | No se puede revisar cada minuto en todos los planes | Un cron cada pocos minutos que despacha lotes; las alertas se calculan por fecha, no por reloj exacto |
| 6 | El plan Hobby es para uso personal y no comercial | Una fundación en producción necesita un plan de pago | Contratar el plan adecuado antes de producción y consultar si hay condiciones para organizaciones sin ánimo de lucro |
| 7 | La latencia entre la función y la base se suma a cada consulta | Una región lejana vuelve lenta cada pantalla | Función en São Paulo (gru1) y clúster Atlas en São Paulo |

Regla práctica: **ninguna petición HTTP hace trabajo largo**. Si una operación tarda, se divide en un registro inmediato y un trabajo en segundo plano con estado visible para la usuaria («Importando 1.200 de 5.000 filas»).

## 21. Decisión: dónde vive la API

El documento base propone NestJS. En Vercel hay dos caminos válidos, y la mesa recomienda decidir con una prueba de concepto de dos días antes de comprometerse.

| Criterio | Opción A: NestJS como proyecto aparte en Vercel | Opción B: Route Handlers de Next.js con dominio en paquetes |
| --- | --- | --- |
| Despliegues | Dos proyectos (web y API) | Un solo proyecto |
| Estructura | Módulos, inyección de dependencias, guards y pipes listos | Funciones de caso de uso explícitas; menos convenciones impuestas |
| Arranque en frío | Mayor, porque el framework inicializa módulos | Menor |
| OpenAPI y cliente tipado | Generación nativa | Se logra con Zod más un generador |
| Curva de aprendizaje | Alta si el equipo no conoce NestJS | Baja si ya usa Next.js |
| Portabilidad | Alta | Alta, si el dominio queda en paquetes puros |

**Recomendación:** empezar con la opción B y mantener el dominio en paquetes de TypeScript sin dependencias de framework. Si el equipo ya domina NestJS o la API crece mucho, se despliega como proyecto aparte reutilizando los mismos casos de uso. El resto de este volumen se escribe para que sirva con cualquiera de las dos.

## 22. Estructura del código

Monorepo con pnpm y Turborepo. La regla central: **el dominio no depende de nada**; las aplicaciones dependen de los paquetes, nunca al revés.

```text
senda-crm/
  apps/
    web/                 Next.js (interfaz, Route Handlers, Server Actions)
    api/                 (opcional) NestJS si se elige la opción A
    worker/              (opcional) proceso permanente para cargas largas
  packages/
    domain/              entidades, reglas, eventos y casos de uso (TypeScript puro)
      src/cases/ people/ households/ projects/ donations/ finance/ ...
    db/                  conexión, esquemas Mongoose, repositorios, migraciones
    validation/          esquemas Zod compartidos (cliente y servidor)
    permissions/         roles, permisos, política de alcance
    jobs/                definición de tareas y handlers de eventos
    integrations/        WhatsApp, correo, pasarelas, contabilidad (adaptadores)
    ui/                  sistema de diseño y componentes
    config/              tsconfig, eslint, variables tipadas
  infrastructure/        scripts de Atlas, plantillas de entorno
  docs/                  architecture/ api/ database/ security/ runbooks/
```

### 22.1 Reglas de dependencia

1. `domain` no importa de ningún otro paquete ni de librerías de framework.
2. `db` implementa los puertos (interfaces de repositorio) que define `domain`.
3. Un módulo solo usa a otro a través de su archivo público (`index.ts`) o de eventos de dominio.
4. Las aplicaciones (`web`, `api`, `worker`) solo orquestan: validan entrada, llaman un caso de uso y dan formato a la salida.
5. Estas reglas se hacen cumplir con ESLint (eslint-plugin-boundaries o dependency-cruiser) en la integración continua.

### 22.2 Capas dentro de un módulo

| Capa | Contiene | Ejemplo en casos |
| --- | --- | --- |
| Entrada (HTTP) | Validación, autenticación, formato de respuesta | `POST /api/v1/cases/:id/close` |
| Caso de uso | Orquesta: permisos, transacción, evento, auditoría | `closeCase` |
| Dominio | Reglas puras y estados válidos | Un caso cerrado exige motivo y resultado |
| Puerto | Interfaz de repositorio | `CaseRepository` |
| Infraestructura | Implementación con MongoDB | `MongoCaseRepository` |

Ejemplo de caso de uso (TypeScript, sin dependencias de framework):

```ts
// packages/domain/src/cases/use-cases/close-case.ts
export async function closeCase(deps: Deps, ctx: Ctx, input: CloseCaseInput) {
  deps.policy.assert(ctx.user, 'cases.close', { caseId: input.caseId });

  return deps.tx.run(async (session) => {
    const current = await deps.cases.getById(ctx, input.caseId, { session });
    const closed = current.close({
      reason: input.reason,
      outcome: input.outcome,
      at: deps.clock.now(),
    }); // lanza error si el estado no permite cerrar

    await deps.cases.save(ctx, closed, { session });
    await deps.outbox.add(ctx, 'CaseClosed', { caseId: closed.id }, { session });
    await deps.audit.record(ctx, 'cases.close', closed.id, current, closed, { session });
    return closed;
  });
}
```

Conexión a MongoDB pensada para funciones sin estado: el cliente se crea una vez por instancia y se reutiliza.

```ts
// packages/db/src/connect.ts
import mongoose from 'mongoose';

type Cache = { conn?: typeof mongoose; promise?: Promise<typeof mongoose> };
const g = globalThis as unknown as { __mongo?: Cache };
const cache: Cache = (g.__mongo ??= {});

export async function connect() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
    bufferCommands: false,
  });
  cache.conn = await cache.promise;
  return cache.conn;
}
```

## 23. Mapa de dominios y relaciones

&#91;embedded content: mapa de dominios y colecciones · 6 dominios\]

Social, Recursos y Administración apuntan a la operación; el impacto se calcula leyendo de ella y de los casos. La identidad atraviesa todo el sistema.

### 23.1 Responsabilidad de cada dominio

| Dominio | Responsabilidad | Usuarias principales | Nivel de sensibilidad |
| --- | --- | --- | --- |
| Identidad y seguridad | Usuarios, roles, permisos, consentimientos y auditoría | Administración y auditoría | Alto |
| Social | Personas, hogares, casos, seguimientos, remisiones, THEMIS y CAM | Trabajo social, psicología, derecho, coordinación | Restringido (casos y notas) |
| Operación | Programas, proyectos, operaciones, eventos, voluntariado y tareas | Coordinación y gestión de programas | Interno |
| Recursos | Donantes, donaciones, campañas, subvenciones y fuentes de financiación | Gestión de donantes y dirección | Confidencial |
| Administración | Proveedores, servicios, presupuestos, gastos, cuentas por pagar, pagos y activos | Gestión financiera y dirección | Confidencial |
| Impacto | Indicadores, evidencias y reportes | Dirección, aliados y donantes institucionales | Interno (solo agregados) |

### 23.2 Relaciones principales

| Origen | Campos de referencia | Destino | Cardinalidad |
| --- | --- | --- | --- |
| cases | personId, householdId | people, households | N a 1 |
| cases | programId, projectId | programs, projects | N a 1 |
| program\_enrollments | personId, programId | people, programs | Resuelve N a N |
| operations | projectId | projects | N a 1 |
| attendance | operationId o eventId, personId | operations o events, people | N a 1 |
| donations | donorId, campaignId, projectId, fundingSourceId | donors, campaigns, projects, funding\_sources | N a 1 |
| expenses | providerId, projectId, operationId, budgetItemId, fundingSourceId | providers, projects, operations, budget\_items, funding\_sources | N a 1 |
| accounts\_payable | providerId, serviceId, contractId, expenseId | providers, services, contracts, expenses | N a 1 |
| payments | accountPayableId, financialAccountId | accounts\_payable, financial\_accounts | N a 1 |
| assets | donationId, projectId | donations, projects | N a 1 |
| aid\_deliveries | personId, householdId, assetId, projectId | people, households, assets, projects | N a 1 |
| indicators | programId, projectId | programs, projects | N a 1 |

## 24. Modelo físico de MongoDB: convenciones

Todas las colecciones comparten los mismos campos base y las mismas reglas de modelado; esto evita decisiones distintas en cada módulo.

### 24.1 Campos base

| Campo | Tipo | Regla |
| --- | --- | --- |
| `_id` | ObjectId | Generado por MongoDB |
| `organizationId` | ObjectId | Obligatorio en toda colección de negocio; primer campo de casi todos los índices |
| `createdAt`, `updatedAt` | Date (UTC) | Los llena la capa de datos, nunca el cliente |
| `createdBy`, `updatedBy` | ObjectId | Usuaria autenticada, o `system` para procesos |
| `deletedAt` | Date o null | Borrado lógico en datos de negocio; no aplica a registros financieros |
| `version` | entero | Control de concurrencia: la actualización exige la versión leída |
| `classification` | enum | PUBLIC, INTERNAL, CONFIDENTIAL o RESTRICTED (sección 35) |

### 24.2 Reglas de modelado

| Tema | Regla |
| --- | --- |
| Nombres | Colecciones en inglés, snake\_case y plural; campos en camelCase; la interfaz se muestra en español |
| Códigos legibles | `CAS-2026-00041`, `EXP-2026-00112`; los genera un contador atómico (`counters`) por organización, tipo y año |
| Enums | Cadenas en mayúsculas definidas una sola vez en `packages/domain` y validadas por Zod y por JSON Schema |
| Dinero | `Decimal128` más `currency` (ISO 4217); cálculos con decimal.js; nunca convertir a `number` |
| Instantes | `Date` en UTC (`createdAt`, `paidAt`); la interfaz convierte a America/Bogota |
| Fechas civiles | Fechas sin hora (`birthDate`, `dueDate`) se guardan a las 00:00 UTC y se muestran sin conversión de zona, para evitar corrimientos de un día |
| Teléfonos | Formato E.164 (`+573001234567`) |
| Documento de identidad | Valor cifrado a nivel de campo más un hash HMAC para búsquedas exactas |
| Arreglos | Nunca crecen sin límite: una lista que puede superar unas decenas de elementos va en otra colección |
| Tamaño | Un documento nunca debe acercarse al límite de 16 MB; los archivos viven en almacenamiento de objetos |
| Orden de texto | Índices de nombres con collation `es` y fuerza 2 (ignora mayúsculas y tildes) |

### 24.3 Embebido o referencia

| Se embebe cuando | Se referencia cuando |
| --- | --- |
| Es pequeño y se lee siempre junto al padre (`objectives[]` de un proyecto, `address` de una persona) | Crece sin límite (`donations` de un donante) |
| No se consulta por sí solo | Se busca de forma independiente |
| Comparte el ciclo de vida y los permisos del padre | Tiene permisos, auditoría o ciclo de vida propios (`case_notes`) |
| Se escribe en la misma operación | Lo usan varias colecciones (`providers`, `documents`) |

## 25. Colecciones de identidad y soporte

| Colección | Propósito | Campos principales | Notas |
| --- | --- | --- | --- |
| `users` | Cuentas internas | email, status, roleIds, scope (programIds, projectIds), mfaEnabled, lastLoginAt | Email único por organización; contraseña (Argon2id) solo si no se delega al proveedor de identidad |
| `roles` | Roles y sus permisos | name, permissions\[\] (`módulo.acción`), scopeRules | El catálogo de permisos vive en el código; la base guarda qué rol tiene cuáles |
| `sessions` | Sesiones del adaptador de Auth.js | sessionToken, userId, expires | Índice TTL sobre `expires` |
| `consents` | Autorizaciones de tratamiento de datos | personId, purpose, channel, textVersion, grantedAt, revokedAt, evidenceDocumentId | Una revocación detiene los envíos de inmediato |
| `audit_logs` | Rastro de auditoría | userId, action, entity, entityId, timestamp, oldValues, newValues, ip, userAgent | Solo inserción; sin permisos de actualización ni borrado |
| `idempotency_keys` | Evita operaciones duplicadas | key, route, requestHash, response, expiresAt | Índice TTL; clave única por organización |
| `outbox_events` | Eventos pendientes de despacho | eventType, aggregateId, payload, status, attempts, availableAt | Ver sección 32 |
| `counters` | Numeración legible | organizationId, type, year, seq | Se incrementa con `findOneAndUpdate` y `$inc` |

## 26. Colecciones sociales

Es el dominio más sensible. La regla es simple: lo que identifica a una persona vive en `people`; lo que describe su situación vive en `cases` y `case_notes`, con acceso más estricto.

| Colección | Campos principales | Reglas y notas |
| --- | --- | --- |
| `people` | nombres y apellidos, documentType, documentNumberEnc, documentNumberHash, birthDate, gender, phone, email, address{}, occupation, educationLevel, roles\[\], protectedIdentity, status | `roles` solo admite BENEFICIARY, DONOR, VOLUNTEER, STAFF, PARTNER, PROFESSIONAL e INSTITUTIONAL\_CONTACT. La participación en CAM o THEMIS no es un rol: vive en `program_enrollments` |
| `households` | code, address{}, city, locality, neighborhood, housing{}, services\[\], socioeconomic{}, needs\[\], risks\[\] | Datos de caracterización embebidos; las intervenciones se consultan desde `cases` |
| `household_members` | householdId, personId, relationship, isHead, startDate, endDate | Una persona puede cambiar de hogar; se conserva el historial con fechas |
| `cases` | caseNumber, personId, householdId, programId, projectId, type, priority, status, openingReason, assessmentSummary, responsibleUserId, openedAt, closedAt, closureReason, outcome | Sin texto clínico ni jurídico detallado; ese contenido va en `case_notes`. Clasificación RESTRICTED |
| `case_notes` | caseId, authorId, kind, bodyEnc, visibility{roles, userIds}, attachments\[\] | Cuerpo cifrado a nivel de campo; cada lectura se audita; no se editan, se corrigen con una nota nueva |
| `follow_ups` | caseId, dueDate, doneAt, userId, channel, summaryEnc, nextFollowUpDate | Alimenta las alertas de casos sin seguimiento |
| `referrals` | caseId, institutionName, routeType, referredAt, status, responseAt, outcome | THEMIS y las rutas institucionales usan esta colección |
| `program_enrollments` | personId, programId, cohortId, productiveLine, status, enrolledAt, completedAt | Para CAM, `productiveLine` toma valores como SEWING, BAKING, SUBLIMATION, GARDENING, FISH\_FARMING, CRAFTS, POULTRY |
| `aid_deliveries` | personId, householdId, projectId, assetId, type, quantity, value (Decimal128), deliveryDate, evidenceDocumentIds\[\], followUp{}, status | Cada entrega genera una tarea de seguimiento |

### 26.1 Ejemplo: persona

```js
db.people.insertOne({
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  firstName: 'María',
  lastName: 'López',
  documentType: 'CC',
  documentNumberEnc: BinData(6, '...'),      // cifrado a nivel de campo
  documentNumberHash: 'hmac-sha256-hex...',   // búsqueda exacta sin descifrar
  birthDate: ISODate('1988-04-12T00:00:00Z'),
  gender: 'FEMALE',
  phone: '+573001234567',
  email: 'maria@example.org',
  address: { line1: 'Calle 10 # 5-20', city: 'Bogotá', locality: 'Kennedy', neighborhood: 'Patio Bonito' },
  roles: ['BENEFICIARY'],
  protectedIdentity: false,
  classification: 'CONFIDENTIAL',
  status: 'ACTIVE',
  createdAt: ISODate('2026-10-07T15:04:00Z'),
  updatedAt: ISODate('2026-10-07T15:04:00Z'),
  deletedAt: null,
  version: 1
})
```

### 26.2 Ejemplo: caso y nota

```js
db.cases.insertOne({
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  caseNumber: 'CAS-2026-00041',
  personId: ObjectId('66f1a2b3c4d5e6f708192a3b'),
  householdId: ObjectId('66f1a2b3c4d5e6f708192a40'),
  programId: ObjectId('66f1a2b3c4d5e6f708192a10'),   // THEMIS
  type: 'LEGAL',
  priority: 'HIGH',
  status: 'ASSESSMENT',
  responsibleUserId: ObjectId('66f1a2b3c4d5e6f708192a55'),
  openedAt: ISODate('2026-10-07T15:10:00Z'),
  closedAt: null,
  classification: 'RESTRICTED',
  version: 1
})

db.case_notes.insertOne({
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  caseId: ObjectId('66f1a2b3c4d5e6f708192a60'),
  authorId: ObjectId('66f1a2b3c4d5e6f708192a55'),
  kind: 'ASSESSMENT',
  bodyEnc: BinData(6, '...'),
  visibility: { roles: ['ABOGADO'], userIds: [] },
  classification: 'RESTRICTED',
  createdAt: ISODate('2026-10-07T15:20:00Z')
})
```

## 27. Colecciones de operación

La operación es la unidad donde se cruzan personas, dinero y resultados. Por eso sus recursos, gastos y voluntarias **no se guardan como arreglos dentro de `operations`**: se consultan por referencia desde `expenses`, `attendance` y `volunteer_shifts`, y así hay una sola fuente de verdad.

| Colección | Campos principales | Reglas y notas |
| --- | --- | --- |
| `programs` | code (único), name, description, objectives\[\], targetPopulation, status, responsibleUserId | Los indicadores se referencian desde `indicators`, no se embeben: tienen metas, períodos y mediciones propias |
| `projects` | projectCode, name, description, programId, startDate, endDate, location, objectives\[\], targetPopulation, partners\[\], fundingSourceIds\[\], responsibleUserId, status | El presupuesto vive en `budgets` (uno aprobado por proyecto) |
| `operations` | operationNumber, name, type, projectId, programId, responsibleUserId, date, startTime, endTime, location, expectedParticipants, plannedBudget, status, results | `type` admite WORKSHOP, TRAINING, HOME\_VISIT, MEDICAL\_DAY, LEGAL\_DAY, MEETING, CAMPAIGN, AID\_DELIVERY, EVENT, COMMUNITY y ADMINISTRATIVE. Participantes reales y costo real se calculan por agregación |
| `events` | operationId (opcional), name, description, projectId, programId, date, location, capacity, registrationEnabled, responsibleUserId, status | Un evento es una operación con inscripción y asistencia; si nace de una operación, la referencia evita duplicar datos |
| `attendance` | operationId o eventId, personId, status, checkInAt, method (QR o MANUAL), recordedBy | Índice único (evento o operación, persona); estados REGISTERED, CONFIRMED, ATTENDED y ABSENT |
| `volunteers` | personId, profession, skills\[\], specialties\[\], availability{}, programIds\[\], verification{}, hoursTotal, status | `hoursTotal` es un valor derivado que se recalcula desde `volunteer_shifts` |
| `volunteer_shifts` | volunteerId, operationId o eventId, date, hours, activity, evaluation | Colección adicional al documento base: evita un arreglo que crece sin límite dentro de `volunteers` |
| `tasks` | title, description, assignedTo, createdBy, priority, dueDate, relatedEntity{type, id}, status, completedAt | Estados TODO, IN\_PROGRESS, COMPLETED y CANCELLED; el estado «atrasada» se calcula por fecha, no se guarda |
| `notifications` | userId, type, entity{type, id}, message, readAt, createdAt | Índice TTL para borrar las leídas tras un período definido |

## 28. Colecciones de recursos

| Colección | Campos principales | Reglas y notas |
| --- | --- | --- |
| `donors` | personId o legalEntity{name, nit}, donorType, segment, preferences{}, totalDonated, lastDonationAt, status | `donorType`: INDIVIDUAL, COMPANY, FOUNDATION o PUBLIC\_ENTITY. `totalDonated` y `lastDonationAt` son derivados; el consentimiento se consulta en `consents` |
| `donations` | donorId, type, amount, currency, paymentMethod, campaignId, projectId, fundingSourceId, restriction{restricted, note}, receiptNumber, gatewayRef, status, receivedAt, documentIds\[\] | Estados PENDING, CONFIRMED, FAILED, REFUNDED y VOID; nunca se borran. Las donaciones en especie pueden originar un registro en `assets` |
| `campaigns` | name, goalAmount, startDate, endDate, status | El monto recaudado se calcula por agregación o se mantiene con un manejador de eventos idempotente |
| `funding_sources` | type, name, restricted, grantApplicationId | `type`: DONATION, GRANT, CORPORATE, INSTITUTIONAL, OWN\_FUNDS, CAMPAIGN u OTHER. Cada gasto apunta a una fuente |
| `grant_opportunities` | name, funder, country, deadline, amountRange{min, max, currency}, eligibility, requirements\[\], url, status | Alimenta la alerta de convocatorias próximas a cerrar |
| `grant_applications` | opportunityId, projectId, status, requestedAmount, approvedAmount, submissionDate, responsibleUserId, milestones\[\], reports\[\], documentIds\[\] | Estados: IDENTIFIED, EVALUATING, ELIGIBLE, IN\_PREPARATION, SUBMITTED, UNDER\_REVIEW, APPROVED, REJECTED, IN\_EXECUTION, REPORTING y CLOSED. Hitos e informes son listas cortas embebidas |

Los campos derivados (`totalDonated`, `lastDonationAt`, monto recaudado) se actualizan con un manejador de eventos idempotente y se recalculan cada noche; así una falla puntual no deja cifras desviadas.

```js
db.donations.insertOne({
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  donorId: ObjectId('66f1a2b3c4d5e6f708192b01'),
  type: 'MONEY',
  amount: NumberDecimal('250000.00'),
  currency: 'COP',
  paymentMethod: 'PSE',
  campaignId: ObjectId('66f1a2b3c4d5e6f708192b10'),
  projectId: null,
  fundingSourceId: ObjectId('66f1a2b3c4d5e6f708192b20'),
  restriction: { restricted: true, note: 'Para el programa CAM' },
  receiptNumber: 'REC-2026-00087',
  gatewayRef: 'gw_9f2c41...',
  status: 'CONFIRMED',
  receivedAt: ISODate('2026-10-07T16:30:00Z'),
  createdAt: ISODate('2026-10-07T16:30:02Z'),
  version: 1
})
```

## 29. Colecciones de administración

La gestión financiera es **operativa**: controla presupuesto, gasto, obligaciones y pagos, pero no reemplaza la contabilidad formal (sección 34).

| Colección | Campos principales | Reglas y notas |
| --- | --- | --- |
| `providers` | name, documentType, documentNumber, contact{}, category, bankInfoEnc, status, documentIds\[\] | Datos bancarios cifrados y solo si son necesarios |
| `services` | providerId, name, category, billingFrequency, amount, currency, startDate, endDate, nextPaymentDate, paymentMethod, projectId, responsibleUserId, autoRenew, status | `billingFrequency`: MONTHLY, QUARTERLY, ANNUAL u ONE\_TIME. Alimenta las alertas de pagos próximos |
| `contracts` | providerId, serviceId, number, object, startDate, endDate, amount, status, documentIds\[\] | El contrato firmado se adjunta como documento |
| `budgets` | projectId, name, totalAmount, period{start, end}, status, approvedVersion | Un presupuesto aprobado por proyecto |
| `budget_items` | budgetId, category, description, plannedAmount, committedAmount, executedAmount | Disponible = planeado − comprometido − ejecutado; se calcula al leer, no se guarda |
| `expenses` | expenseNumber, date, category, concept, providerId, amount, paymentMethod, projectId, operationId, programId, fundingSourceId, budgetItemId, responsibleUserId, status, approvals\[\], documentIds\[\] | Estados DRAFT, IN\_REVIEW, APPROVED, REJECTED, PAYABLE, PAID y VOID. Las aprobaciones se embeben porque son pocas y se leen con el gasto |
| `accounts_payable` | providerId, serviceId, contractId, expenseId, concept, invoiceNumber, issueDate, dueDate, totalAmount, remainingAmount, status, projectId, operationId, documentIds\[\] | Estados PENDING, SCHEDULED, PARTIAL, PAID, OVERDUE y CANCELLED; un trabajo diario marca OVERDUE |
| `payments` | paymentNumber, accountPayableId, expenseId, providerId, date, amount, paymentMethod, financialAccountId, reference, receiptDocumentId, status, reversalOfPaymentId | Estados REGISTERED, REVERSED y VOID. Un pago se revierte con otro registro; nunca se borra |
| `financial_accounts` | name, type, currency, maskedNumber, status, openingBalance | Solo los últimos cuatro dígitos; jamás el número completo |
| `assets` | assetNumber, name, category, serialNumber, purchaseDate, value, source, donationId, expenseId, projectId, location, assignedTo, status, condition, documentIds\[\] | Estados AVAILABLE, ASSIGNED, DELIVERED, IN\_REPAIR y DISPOSED |

```js
db.expenses.insertOne({
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  expenseNumber: 'EXP-2026-00041',
  date: ISODate('2026-10-07T00:00:00Z'),
  category: 'MATERIALS',
  concept: 'Telas y accesorios para taller de modistería',
  providerId: ObjectId('66f1a2b3c4d5e6f708192c01'),
  amount: NumberDecimal('600000.00'),
  currency: 'COP',
  projectId: ObjectId('66f1a2b3c4d5e6f708192c10'),
  operationId: ObjectId('66f1a2b3c4d5e6f708192c20'),
  budgetItemId: ObjectId('66f1a2b3c4d5e6f708192c30'),
  fundingSourceId: ObjectId('66f1a2b3c4d5e6f708192b20'),
  status: 'IN_REVIEW',
  approvals: [],
  version: 1
})
```

## 30. Colecciones transversales

| Colección | Campos principales | Reglas y notas |
| --- | --- | --- |
| `documents` | fileName, mimeType, size, checksum, storageKey, entityType, entityId, uploadedBy, classification, scanStatus | El archivo vive en el almacenamiento; la base guarda solo metadatos. `scanStatus` (PENDING, CLEAN o INFECTED) bloquea la descarga hasta revisar el archivo |
| `communications` | personId, channel, direction, subject, bodyRef, relatedCaseId, relatedProjectId, relatedDonationId, userId, date, status, providerMessageId | Canales: EMAIL, WHATSAPP, SMS, CALL, MEETING, VISIT y NOTE. El cuerpo de mensajes sensibles se cifra |
| `indicators` | name, code, type, programId, projectId, unit, target, period, source, status | `type`: OUTPUT, OUTCOME, IMPACT, FINANCIAL u OPERATIONAL |
| `impact_records` | indicatorId, period, value, method (MANUAL o AUTO), evidenceDocumentIds\[\], computedAt | Separa la meta (en `indicators`) de cada medición, lo que permite ver la evolución en el tiempo |

## 31. Validación, evolución del esquema e índices

MongoDB no obliga a un esquema, así que la disciplina se construye en tres capas: validación en la aplicación (Zod), validación en la base (JSON Schema) e índices diseñados desde las consultas reales.

### 31.1 Doble validación

El dinero viaja como texto decimal en la API para evitar errores de punto flotante, y se convierte a `Decimal128` en la capa de datos.

```ts
// packages/validation/src/donations.ts
import { z } from 'zod';
import { DonationType, DonationStatus } from '@senda/domain';

const objectId = z.string().regex(/^[a-f0-9]{24}$/);
const money = z.string().regex(/^\d{1,12}(\.\d{1,2})?$/);

export const CreateDonation = z.object({
  donorId: objectId,
  type: z.enum(DonationType),
  amount: money,
  currency: z.enum(['COP', 'USD', 'EUR']),
  campaignId: objectId.optional(),
  projectId: objectId.optional(),
  fundingSourceId: objectId,
  paymentMethod: z.string().min(2).max(40),
});
```

La misma regla se aplica en Atlas como segunda barrera, de modo que un script o un error de código no pueda guardar datos inválidos:

```js
db.createCollection('donations', {
  validator: { $jsonSchema: {
    bsonType: 'object',
    required: ['organizationId', 'donorId', 'type', 'amount', 'currency', 'status', 'createdAt'],
    properties: {
      organizationId: { bsonType: 'objectId' },
      donorId: { bsonType: 'objectId' },
      type: { enum: ['MONEY', 'IN_KIND', 'EQUIPMENT', 'SERVICE', 'FOOD', 'MEDICINE', 'MATERIAL', 'OTHER'] },
      amount: { bsonType: 'decimal' },
      currency: { enum: ['COP', 'USD', 'EUR'] },
      status: { enum: ['PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'VOID'] }
    }
  } },
  validationLevel: 'strict',
  validationAction: 'error'
})
```

### 31.2 Evolución del esquema

MongoDB no tiene migraciones automáticas; se gestionan con scripts versionados (por ejemplo migrate-mongo) que se ejecutan desde la integración continua.

1. Cada documento cuyo formato cambie lleva un campo `schemaVersion`.
2. Se aplica el patrón de **expandir y contraer**: primero se agrega el campo nuevo y el código escribe ambos formatos; luego se migran los datos; al final se retira el campo viejo.
3. Toda migración corre primero en staging con datos sintéticos y se prueba su reversa.
4. Antes de migrar producción se toma una instantánea de respaldo.
5. Las migraciones son idempotentes: si se interrumpen, se pueden volver a ejecutar.

### 31.3 Índices

Los índices se diseñan desde las consultas de pantallas, alertas e informes, con la regla ESR (igualdad, orden, rango) y `organizationId` al frente. Cada índice agrega costo a las escrituras, por eso no se indexan todos los campos.

| Colección | Índice | Consulta que sirve |
| --- | --- | --- |
| `users` | `{organizationId, email}` único | Inicio de sesión |
| `people` | `{organizationId, documentNumberHash}` único y parcial (solo si existe el hash) | Búsqueda por documento y detección de duplicados |
| `people` | `{organizationId, phone}`, `{organizationId, email}` | Detección de duplicados y búsqueda |
| `people` | `{organizationId, lastName, firstName}` con collation `es` | Listados ordenados por nombre |
| `cases` | `{organizationId, caseNumber}` único | Búsqueda por número |
| `cases` | `{organizationId, status, priority}` | Tablero de casos |
| `cases` | `{organizationId, responsibleUserId, status}` | «Mis casos» |
| `cases` | `{organizationId, personId}` | Ficha 360° de la persona |
| `cases` | `{organizationId, status, lastFollowUpAt}` | Alerta de casos sin seguimiento (campo derivado que se actualiza al registrar un seguimiento) |
| `follow_ups` | `{organizationId, caseId, dueDate}` | Seguimientos de un caso |
| `projects` | `{organizationId, status, endDate}` | Proyectos próximos a vencer |
| `operations` | `{organizationId, projectId, date}` | Operaciones de un proyecto |
| `attendance` | `{organizationId, eventId, personId}` único y parcial | Evita doble registro en un evento |
| `donations` | `{organizationId, donorId, receivedAt: -1}` | Historial del donante |
| `donations` | `{organizationId, campaignId, status}` | Avance de campaña |
| `donations` | `{organizationId, receiptNumber}` único | Búsqueda de recibos |
| `expenses` | `{organizationId, projectId, date: -1}` | Gastos por proyecto |
| `expenses` | `{organizationId, status}` | Bandeja de aprobación |
| `accounts_payable` | `{organizationId, status, dueDate}` | Vencimientos y alertas |
| `payments` | `{organizationId, accountPayableId}` | Pagos de una obligación |
| `services` | `{organizationId, nextPaymentDate}` | Servicios próximos a pagar |
| `grant_opportunities` | `{organizationId, status, deadline}` | Convocatorias que cierran pronto |
| `tasks` | `{organizationId, assignedTo, status, dueDate}` | «Mis tareas» |
| `audit_logs` | `{organizationId, entity, entityId, timestamp: -1}` | Historial de un registro |
| `outbox_events` | `{status, availableAt}` | Despacho de eventos pendientes |
| `idempotency_keys` | `{organizationId, key}` único, más TTL sobre `expiresAt` | Evita duplicados y limpia claves vencidas |
| `sessions`, `notifications` | TTL sobre la fecha de vencimiento | Limpieza automática |

```js
db.people.createIndex(
  { organizationId: 1, documentNumberHash: 1 },
  { unique: true, partialFilterExpression: { documentNumberHash: { $type: 'string' } } }
)
db.people.createIndex(
  { organizationId: 1, lastName: 1, firstName: 1 },
  { collation: { locale: 'es', strength: 2 } }
)
db.idempotency_keys.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### 31.4 Consultas críticas con agregación

Costo real de cada operación de un proyecto (suma de Decimal128, sin pasar por `number`):

```js
db.expenses.aggregate([
  { $match: { organizationId, projectId, status: { $in: ['APPROVED', 'PAYABLE', 'PAID'] } } },
  { $group: { _id: '$operationId', total: { $sum: '$amount' }, gastos: { $sum: 1 } } },
  { $sort: { total: -1 } }
])
```

Disponible por partida presupuestal:

```js
db.budget_items.aggregate([
  { $match: { organizationId, budgetId } },
  { $addFields: { available: { $subtract: ['$plannedAmount', { $add: ['$committedAmount', '$executedAmount'] }] } } }
])
```

### 31.5 Búsqueda global

La búsqueda global usa Atlas Search (disponible en clústeres dedicados). Reglas: el filtro `organizationId` va en la consulta, nunca se indexan campos cifrados, y los resultados de colecciones RESTRICTED se devuelven solo si la usuaria tiene el permiso de lectura correspondiente; el resto se descarta antes de responder.

## 32. Transacciones, eventos de dominio e idempotencia

&#91;embedded content: flujo del patrón outbox · 4 pasos con reintento\]

El dato y el evento se confirman juntos o ninguno se confirma. Un despachador entrega los eventos después, con reintentos, de modo que una falla de correo o de WhatsApp nunca deja una donación sin registrar ni un registro sin su recibo.

### 32.1 Cuándo se usa una transacción

Las transacciones requieren un conjunto de réplicas (Atlas lo incluye) y deben ser cortas; tienen un tiempo máximo (60 segundos por defecto). Un documento individual ya es atómico.

| Operación | ¿Transacción? | Motivo |
| --- | --- | --- |
| Registrar donación, evento y auditoría | Sí | Tres escrituras que deben confirmarse juntas |
| Aprobar gasto y aumentar lo comprometido de la partida | Sí | Evita presupuestos desviados |
| Registrar pago, bajar el saldo de la obligación y subir lo ejecutado | Sí | Tres colecciones coherentes |
| Cerrar caso, evento y auditoría | Sí | El cierre debe quedar trazado |
| Crear o editar una persona | No | Un solo documento es atómico |
| Importación masiva | No | Se procesa por lotes con reintentos idempotentes |

### 32.2 Forma del evento

```js
{
  organizationId: ObjectId('66f0a1b2c3d4e5f607182930'),
  eventType: 'DonationReceived',
  aggregateType: 'donation',
  aggregateId: ObjectId('66f1a2b3c4d5e6f708192d01'),
  payload: { donationId: '66f1a2b3c4d5e6f708192d01', amount: '250000.00', currency: 'COP' },
  status: 'PENDING',          // PENDING, PROCESSING, PROCESSED, DEAD_LETTER
  attempts: 0,
  availableAt: ISODate('2026-10-07T16:30:02Z'),
  lockedUntil: null,
  lastError: null,
  createdAt: ISODate('2026-10-07T16:30:02Z')
}
```

### 32.3 Despacho en Vercel

Los Change Streams de MongoDB necesitan un proceso permanente, así que en Vercel el despacho se hace por sondeo programado.

1. Un cron cada pocos minutos llama a una ruta interna, protegida con un secreto compartido.
2. La ruta toma un lote de eventos `PENDING` con `availableAt` vencido y los marca `PROCESSING` con una reserva (`lockedUntil`) en una operación atómica.
3. Cada evento se entrega a su manejador, o a la cola gestionada si el trabajo es lento.
4. Si el manejador termina bien, el evento pasa a `PROCESSED`.
5. Si falla, se incrementa `attempts` y se reprograma `availableAt` con espera creciente; tras varios intentos pasa a `DEAD_LETTER` y se alerta al equipo técnico.
6. Si un proceso muere con eventos reservados, la reserva vence y otro despacho los retoma.

### 32.4 Idempotencia

Un evento puede entregarse más de una vez, y las pasarelas reintentan sus avisos. Por eso todo manejador debe poder repetirse sin efectos duplicados.

| Caso | Mecanismo |
| --- | --- |
| Donación creada desde un formulario público | Cabecera `Idempotency-Key` más índice único `(organizationId, key)` |
| Aviso de la pasarela de pagos | `gatewayRef` único; si ya existe, se ignora |
| Número de recibo | El contador solo avanza si la donación aún no tiene `receiptNumber` (condición dentro de la actualización) |
| Correo de agradecimiento | Registro en `communications` por (evento, plantilla); si existe, no se reenvía |
| Cobro recurrente | Clave por suscripción y período |
| Recalcular totales | Se recalcula desde los datos, no se suma sobre el valor anterior |

### 32.5 Catálogo de eventos

| Evento | Lo dispara | Manejadores |
| --- | --- | --- |
| `PersonCreated` | Alta de persona | Crea tarea de valoración y notifica a la responsable |
| `CaseCreated` | Apertura de caso | Asigna profesional, crea primera tarea y fecha de seguimiento, notifica |
| `CaseFollowUpDue` | Cron de alertas | Notifica a la responsable |
| `CaseClosed` | Cierre de caso | Cierra tareas abiertas y actualiza indicadores |
| `OperationCompleted` | Cierre de operación | Fija participantes reales y actualiza indicadores |
| `DonationReceived` | Donación confirmada | Actualiza historial, genera recibo, agradece, actualiza campaña y proyecto |
| `ExpenseApproved` | Aprobación de gasto | Crea la cuenta por pagar y aumenta lo comprometido |
| `PaymentRegistered` | Pago registrado | Actualiza saldo, ejecutado y estado de la obligación |
| `ServicePaymentDue` | Cron de servicios | Notifica y crea la cuenta por pagar del período |
| `GrantApproved` | Subvención aprobada | Crea la fuente de financiación y las tareas de hitos |
| `VolunteerAssigned` | Asignación a operación | Notifica y reserva horas |

## 33. Ciclo de vida del caso

&#91;embedded content: ciclo de vida del caso · 7 estados\]

El backend rechaza cualquier salto de estado que no esté en el diagrama. La reapertura exige un motivo y queda en la auditoría.

### 33.1 Reglas de cada transición

| Transición | Condición | Efecto automático |
| --- | --- | --- |
| NEW → ASSESSMENT | Responsable asignada | Tarea de valoración con fecha |
| ASSESSMENT → PLAN | Resumen de valoración y prioridad definidos | Se crea el plan con metas |
| PLAN → FOLLOW\_UP | Plan aprobado por la coordinación | Primera fecha de seguimiento |
| FOLLOW\_UP → REFERRAL | Institución y tipo de ruta indicados | Se crea la remisión y se notifica |
| REFERRAL → REFERRAL\_FOLLOW\_UP | Remisión registrada | Tarea para verificar la respuesta |
| FOLLOW\_UP o REFERRAL\_FOLLOW\_UP → CLOSED | `closureReason` y `outcome` obligatorios y permiso `cases.close` | Cierra tareas abiertas, actualiza indicadores y emite `CaseClosed` |
| CLOSED → ASSESSMENT | Motivo obligatorio y permiso `cases.reopen` | Auditoría y aviso a la dirección |

El umbral de alerta (15 días sin seguimiento) es configurable por tipo de caso. Un caso cerrado nunca se modifica en silencio: cualquier cambio posterior es una nota nueva o una reapertura.

## 34. Flujo financiero y contabilidad

&#91;embedded content: flujo financiero · 7 pasos con aprobación\]

Cada gasto sigue una cadena fija desde el registro hasta el comprobante. El CRM controla la ejecución y la trazabilidad; no reemplaza la contabilidad formal.

### 34.1 Estados por entidad

| Entidad | Estados | Cambia el estado |
| --- | --- | --- |
| `expenses` | DRAFT, IN\_REVIEW, APPROVED, REJECTED, PAYABLE, PAID, VOID | Registro, revisión y aprobación; los dos últimos los fija el sistema |
| `accounts_payable` | PENDING, SCHEDULED, PARTIAL, PAID, OVERDUE, CANCELLED | Programación, pagos y el trabajo diario de vencimientos |
| `payments` | REGISTERED, REVERSED, VOID | Gestión financiera; la reversión crea un registro nuevo |

### 34.2 Aprobación por monto

Los umbrales son configurables. Los valores de partida del documento base son 500.000 COP.

| Monto del gasto | Aprobación | Rol que aprueba |
| --- | --- | --- |
| Menor al umbral | Básica | GESTOR\_FINANCIERO o COORDINADOR |
| Mayor al umbral | Dirección | DIRECTORA |

**Segregación de funciones:** quien registra un gasto no lo aprueba, y quien lo aprueba no registra el pago. El sistema lo impide por regla, no por confianza.

### 34.3 Reglas que valida el backend

- Un pago no supera el saldo pendiente de la obligación, salvo autorización específica registrada.
- Un pago nunca se elimina: se anula o se revierte con un registro nuevo.
- Un proyecto no se cierra si tiene obligaciones críticas pendientes, según las reglas configuradas.
- Una cuenta por pagar no mezcla monedas.
- Un gasto sin documento de soporte no pasa a APPROVED (regla propuesta).
- Toda modificación de un registro financiero queda en `audit_logs` con valor anterior y nuevo.

### 34.4 Relación con la contabilidad

| Tema | Decisión |
| --- | --- |
| Propiedad | La contabilidad formal sigue en el sistema de la fundación o de su contador |
| Exportación | Gastos, pagos y donaciones se exportan por CSV o API hacia el sistema contable |
| Cuentas contables | Cada categoría puede llevar un código contable opcional para facilitar la conciliación |
| Conciliación | Cierre mensual: el total del CRM se compara con el contable y las diferencias se registran |
| Integración directa | Se agrega en la fase de integraciones, detrás de un adaptador |

## 35. Seguridad y privacidad

MongoDB no ofrece seguridad por fila, así que la protección se construye en capas: identidad fuerte, autorización central, alcance obligatorio en cada consulta, cifrado de campos y auditoría de lectura. Ninguna capa se confía a una sola persona o a una sola línea de código.

### 35.1 Modelo de amenazas

| Amenaza | Ejemplo | Control principal |
| --- | --- | --- |
| Filtración de datos de participantes | Un filtro olvidado en una consulta | Repositorios con alcance obligatorio, pruebas de aislamiento y cifrado de campos |
| Cuenta comprometida | Suplantación de una usuaria con acceso amplio | MFA, sesiones cortas y alertas de ingreso inusual |
| Abuso interno | Consulta de casos que no corresponden a la usuaria | Alcance por asignación y auditoría de cada lectura |
| Exportación masiva | Descarga de todos los casos | Permiso de exportación aparte, límites, marca de agua y alerta |
| Pérdida de datos | Borrado accidental o secuestro de datos | Respaldo continuo, restauración probada y borrado lógico |
| Fraude financiero | Pago a un proveedor falso | Segregación de funciones, aprobación por monto y verificación de cuentas |
| Ataque a formularios públicos | Spam o inyección de datos | CAPTCHA, límite de peticiones, validación y listas permitidas |
| Falla de un proveedor | Caída o acceso indebido en un servicio externo | Acuerdos de tratamiento, mínimo privilegio y adaptadores intercambiables |
| Dependencia vulnerable | Librería comprometida | Escaneo de dependencias, versiones fijadas y revisión de cada cambio |

### 35.2 Autenticación

- MFA obligatorio para SUPER\_ADMIN, DIRECTORA y GESTOR\_FINANCIERO, y también para todo rol que lea datos RESTRICTED (trabajo social, psicología y derecho).
- Proveedor de identidad con MFA (Clerk, WorkOS o Auth0) integrado con Auth.js, o TOTP propio con códigos de recuperación.
- Si hay contraseñas propias: Argon2id, bloqueo por intentos fallidos y lista de contraseñas comprometidas.
- Cookies `HttpOnly`, `Secure` y `SameSite`; rotación de sesión al iniciar y al cambiar privilegios; vencimiento por inactividad; cierre remoto de sesiones.
- Nunca se guardan tokens en `localStorage`.

### 35.3 Autorización: roles más alcance

Los permisos tienen la forma `módulo.acción` (`cases.read`, `expenses.approve`). Un rol agrupa permisos y, además, cada permiso se evalúa contra el **alcance** de la usuaria (programas, proyectos o casos asignados).

Legenda: L lee, E crea y edita, A aprueba, X exporta, «asig.» solo registros asignados, — sin acceso.

| Rol | Personas | Casos | Notas de caso | Operación | Donaciones | Finanzas | Reportes | Configuración |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SUPER\_ADMIN | L | — | — | L | — | — | — | L E |
| DIRECTORA | L E X | L | L (auditada) | L E A | L E A X | L E A X | L X | L E |
| COORDINADOR | L E | L E | — | L E A | L | L E A (básica) | L X | — |
| TRABAJADOR\_SOCIAL | L E | L E asig. | L E asig. | L | — | — | L (agregados) | — |
| PSICOLOGO | L | L E asig. | L E asig. | L | — | — | L (agregados) | — |
| ABOGADO | L | L E asig. | L E asig. | L | — | — | L (agregados) | — |
| GESTOR\_PROGRAMAS | L E | L (datos básicos) | — | L E | — | L (sus proyectos) | L X | — |
| GESTOR\_DONANTES | L (donantes) | — | — | L | L E X | — | L | — |
| GESTOR\_FINANCIERO | L (proveedores) | — | — | L | L | L E A X | L X | — |
| VOLUNTARIO | — | — | — | L asig. | — | — | — | — |
| CONSULTA | — | — | — | — | — | — | L (autorizados) | — |

Decisión de diseño: **el administrador técnico no lee notas de caso ni finanzas.** Puede crear usuarias y asignar roles, y cada uno de esos actos queda auditado, pero su cuenta no abre contenido sensible.

### 35.4 Alcance obligatorio en cada consulta

El riesgo mayor en MongoDB es una consulta sin filtro de organización o de alcance. Por eso no existe ningún método de repositorio que no reciba el contexto de la usuaria: el filtro se agrega siempre y no se puede sobrescribir desde fuera.

```ts
// packages/db/src/scoped-repository.ts
export abstract class ScopedRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  // Toda consulta pasa por aquí; organizationId se aplica al final y no se puede sobrescribir
  protected where(ctx: Ctx, filter: FilterQuery<T> = {}): FilterQuery<T> {
    return { ...this.scope(ctx, filter), organizationId: ctx.organizationId };
  }

  // Cada colección define su regla de alcance (por ejemplo, casos asignados)
  protected abstract scope(ctx: Ctx, filter: FilterQuery<T>): FilterQuery<T>;

  find(ctx: Ctx, filter: FilterQuery<T> = {}) {
    return this.model.find(this.where(ctx, filter));
  }
}
```

Pruebas automáticas obligatorias en la integración continua: una usuaria de otra organización, una de otro programa y una sin permiso intentan leer cada recurso, y todas deben recibir «no encontrado» o «prohibido».

### 35.5 Clasificación de la información

| Nivel | Ejemplos | Controles |
| --- | --- | --- |
| PUBLIC | Textos del sitio, convocatorias públicas | Sin restricción |
| INTERNAL | Operaciones, tareas, proyectos | Usuaria autenticada con permiso |
| CONFIDENTIAL | Datos de contacto, donaciones, finanzas | Permiso por módulo y auditoría de exportación |
| RESTRICTED | Casos, notas, menores, información jurídica y psicosocial, identidad protegida | Alcance por asignación, cifrado de campo, auditoría de cada lectura, MFA y exportación solo con autorización |

Una persona con `protectedIdentity` activa se muestra con un seudónimo en listados, búsquedas y reportes; el nombre real solo se revela con una acción registrada.

### 35.6 Cifrado

| Capa | Medida |
| --- | --- |
| En tránsito | TLS entre navegador, Vercel, Atlas y proveedores |
| En reposo | Cifrado de disco de Atlas y del almacenamiento de objetos |
| Por campo | Documento de identidad, cuerpo de notas, resumen de seguimientos, datos bancarios y mensajes sensibles |
| Llaves | Cifrado por sobre (envelope): una llave de datos protegida por un KMS (AWS KMS o Google Cloud KMS); rotación periódica |
| Búsqueda | Igualdad con hash HMAC; no hay búsquedas parciales sobre campos cifrados |

El cifrado de campos puede hacerse con el cifrado del lado del cliente de MongoDB o directamente en la aplicación. Qué modalidad está disponible depende del plan de Atlas, y debe verificarse antes de decidir. Ejemplo de cifrado en la aplicación:

```ts
// packages/db/src/crypto.ts
import { createCipheriv, randomBytes } from 'node:crypto';

export function encryptField(plain: string, dataKey: Buffer): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', dataKey, iv);
  const data = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]); // se guarda como BinData
}
```

La llave de datos nunca se guarda en el repositorio ni en una variable de entorno en texto plano: se obtiene descifrada desde el KMS al iniciar y se mantiene en memoria.

### 35.7 Auditoría

| Qué se registra | Detalle | Notas |
| --- | --- | --- |
| Cambios | Creación, edición, cambio de estado y anulación, con valor anterior y nuevo | Los valores sensibles se registran enmascarados o como hash |
| Lecturas de datos RESTRICTED | Quién abrió qué caso o nota, y cuándo | Permite detectar curiosidad indebida |
| Exportaciones | Quién, qué filtro, cuántos registros | Alerta si supera un umbral |
| Accesos | Inicios de sesión, fallos, cambios de MFA y de permisos | Alerta de ingresos inusuales |

`audit_logs` es de solo inserción: la cuenta de base de datos de la aplicación tiene permiso para insertar y consultar, pero no para actualizar ni borrar. Una copia se envía a un almacenamiento con escritura única (por ejemplo, S3 con Object Lock) para que ni siquiera un administrador pueda alterarla. El plazo de retención lo define la asesoría jurídica.

### 35.8 Protección de la API

Toda ruta pasa por la misma secuencia:

1. HTTPS con HSTS y CORS cerrado a los dominios propios.
2. Autenticación de la sesión.
3. Autorización con la política central (`módulo.acción` más alcance).
4. Validación de entrada con Zod; nunca se confía en el cliente.
5. Límite de peticiones por usuaria e IP (por ejemplo con Upstash Ratelimit).
6. Idempotencia en las operaciones críticas.
7. Caso de uso con transacción cuando corresponda.
8. Auditoría.
9. Respuesta con un DTO explícito; nunca se devuelve el documento crudo de la base.

Además: cabeceras de seguridad (CSP, X-Content-Type-Options, Referrer-Policy), webhooks verificados por firma, secretos en variables de entorno y escaneo de dependencias en cada cambio. Los formularios públicos usan CAPTCHA (Cloudflare Turnstile o hCaptcha), campo trampa, límite de peticiones y validación estricta, y solo escriben en una cola de solicitudes pendientes de revisión.

### 35.9 Privacidad y cumplimiento en Colombia

La siguiente tabla traduce las obligaciones habituales de la Ley 1581 de 2012 a funciones del sistema. Debe revisarla la asesoría jurídica de la fundación antes de salir a producción.

| Obligación | Cómo la cubre el sistema |
| --- | --- |
| Autorización previa, expresa e informada | `consents` con finalidad, canal, versión del texto, fecha y evidencia; sin autorización vigente no se envían comunicaciones |
| Política de tratamiento de datos | Enlace visible en todos los formularios y portales |
| Derechos de la persona titular (consulta, actualización, rectificación, supresión, revocatoria) | Módulo de solicitudes con responsable, plazo y trazabilidad |
| Datos sensibles y de niñas, niños y adolescentes | Autorización expresa, entrega voluntaria, interés superior del menor, clasificación RESTRICTED |
| Registro de bases de datos | Inventario de bases y de sus finalidades, para el registro ante la SIC cuando aplique |
| Transferencia internacional | Vercel, Atlas y otros proveedores pueden procesar datos fuera del país: validar con asesoría jurídica las condiciones y firmar los contratos de tratamiento correspondientes |
| Incidentes de seguridad | Procedimiento de respuesta: detección, contención, notificación a las personas afectadas y a la autoridad |
| Retención y anonimización | Plazos por tipo de dato; al vencer, anonimización irreversible. Los registros financieros se conservan según la normativa aplicable |

### 35.10 Datos en desarrollo

- Desarrollo y staging usan datos sintéticos generados por un script de semillas.
- Si alguna vez se necesita una copia de producción, pasa por un proceso de anonimización y se elimina al terminar.
- Ninguna captura de pantalla, ticket ni mensaje de soporte puede contener datos de participantes.

## 36. API: contratos y convenciones

La API es REST, versionada en `/api/v1` y documentada con OpenAPI 3.1 generado desde los esquemas Zod, de modo que el cliente tipado del frontend nunca se desfasa del servidor.

### 36.1 Convenciones

| Tema | Regla |
| --- | --- |
| Recursos | Plural en kebab-case (`/accounts-payable`); JSON en UTF-8 |
| Métodos | GET, POST y PATCH (actualización parcial); no se usa PUT |
| Acciones de dominio | POST sobre un subrecurso (`/cases/:id/close`), no estados editables a mano |
| Paginación | Por cursor: `?limit=25&cursor=...`; respuesta con `data` y `page` (`nextCursor`, `hasMore`) |
| Filtros y orden | `?status=ACTIVE&q=texto&sort=-createdAt` |
| Concurrencia | PATCH con la versión leída; si cambió, responde 409 |
| Idempotencia | Cabecera `Idempotency-Key` en los POST críticos (donaciones, pagos, formularios) |
| Dinero | Texto decimal (`250000.00`) y `currency` aparte; nunca números flotantes |
| Fechas | ISO 8601 en UTC para instantes; `YYYY-MM-DD` para fechas civiles |
| Respuestas | DTO explícito por recurso; nunca el documento crudo de MongoDB |
| Versionado | Los cambios compatibles no crean versión; un cambio que rompe crea `/v2` |

### 36.2 Formato de error

Se sigue el formato de detalles de problema (RFC 9457), con un identificador de petición para soporte y trazas.

```ts
type ApiError = {
  type: string;       // 'validation_error', 'forbidden', 'not_found', 'conflict', ...
  title: string;
  status: number;
  detail?: string;
  requestId: string;  // enlaza con registros y trazas
  errors?: { path: string; message: string }[];
};
```

| Código | Cuándo |
| --- | --- |
| 400 | Datos inválidos |
| 401 | Sin sesión |
| 403 | Sin permiso para la acción |
| 404 | No existe **o no está en el alcance de la usuaria** (no se distingue, para no revelar que existe) |
| 409 | Conflicto de versión o duplicado |
| 422 | Regla de negocio (por ejemplo, cerrar un caso sin resultado) |
| 429 | Límite de peticiones |
| 500 | Error interno; se registra con `requestId` |

### 36.3 Catálogo de endpoints

| Módulo | Endpoints | Notas |
| --- | --- | --- |
| Personas | `GET/POST /people`, `GET/PATCH /people/:id`, `POST /people/:id/merge`, `GET /people/:id/timeline` | La fusión conserva el historial y deja auditoría |
| Hogares | `/households`, `/households/:id/members` |  |
| Casos | `GET/POST /cases`, `GET/PATCH /cases/:id`, `POST /cases/:id/follow-ups`, `POST /cases/:id/referrals`, `GET/POST /cases/:id/notes`, `POST /cases/:id/close`, `POST /cases/:id/reopen` | Lectura de notas auditada |
| Programas | `/programs`, `/programs/:id/enrollments` | CAM y THEMIS son programas |
| Proyectos | `/projects`, `/projects/:id`, `/projects/:id/operations`, `/projects/:id/budget`, `/projects/:id/summary` | `summary` agrega costos, personas y avance |
| Operaciones y eventos | `/operations`, `/events`, `/events/:id/attendance`, `POST /events/:id/check-in` | Check-in por QR o manual |
| Donantes y donaciones | `/donors`, `/donations`, `POST /donations/:id/receipt` |  |
| Subvenciones | `/grants/opportunities`, `/grants/applications`, `POST /grants/applications/:id/transition` | La transición valida el pipeline |
| Voluntariado | `/volunteers`, `/volunteers/:id/shifts` |  |
| Finanzas | `/providers`, `/services`, `/contracts`, `/expenses`, `POST /expenses/:id/submit`, `/approve`, `/reject`, `/accounts-payable`, `/payments`, `POST /payments/:id/reverse`, `/financial-accounts`, `/budgets` | Sin DELETE en registros financieros |
| Activos y ayudas | `/assets`, `/aid-deliveries` |  |
| Comunicación | `/communications`, `/tasks`, `/notifications` |  |
| Reportes | `/reports/:type`, `/impact`, `POST /exports`, `GET /exports/:id` | La exportación es un trabajo en segundo plano con descarga firmada |
| Documentos | `POST /documents/upload-url`, `POST /documents`, `GET /documents/:id/download-url` | Ver 36.4 |
| Administración | `/users`, `/roles`, `/audit`, `/consents`, `/data-requests` |  |
| Internas | `/internal/outbox/dispatch`, `/internal/cron/alerts` | Solo con secreto compartido |
| Públicas | `/public/forms/contact`, `/volunteer`, `/donation`, `/cam`, `/event` | Ver 36.6 |

### 36.4 Subida de documentos

Vercel limita el tamaño del cuerpo de las peticiones, así que los archivos nunca pasan por la API.

1. El cliente pide una URL de subida indicando tipo, tamaño y entidad.
2. La API valida el permiso, el tipo y el tamaño, crea el documento en estado pendiente y devuelve una URL firmada de vida corta.
3. El navegador sube el archivo directamente al almacenamiento.
4. El cliente confirma; la API verifica que el archivo exista, su tamaño y su suma de verificación, y encola el análisis de malware (`scanStatus: PENDING`).
5. Cuando pasa a `CLEAN`, se habilita la descarga.
6. La descarga usa una URL firmada de vida corta; si el documento es RESTRICTED, queda auditada.

### 36.5 Ejemplo de ruta

Una función envolvente centraliza autenticación, autorización, validación, límite de peticiones, idempotencia, auditoría y traducción de errores. Cada ruta queda en pocas líneas y no puede olvidar un control.

```ts
// apps/web/app/api/v1/cases/[id]/close/route.ts
import { withApi } from '@/lib/with-api';
import { closeCase } from '@senda/domain/cases';
import { CloseCase } from '@senda/validation/cases';

export const POST = withApi(
  { permission: 'cases.close', body: CloseCase, idempotent: true },
  async ({ ctx, body, params }) => {
    const closed = await closeCase(ctx.deps, ctx, { caseId: params.id, ...body });
    return { status: 200, data: toCaseDto(closed) };
  },
);
```

### 36.6 Formularios públicos

Los formularios del sitio web (contacto, voluntariado, donación, ayuda, inscripción a CAM y eventos) no escriben directamente en `people`. Se agrega la colección `intake_requests`, que no está en el documento base, para que una persona del equipo valide antes de crear o vincular registros.

1. El sitio envía el formulario a la API pública con el token del CAPTCHA.
2. La API valida el token, limita las peticiones y valida los datos con Zod.
3. Guarda una solicitud `PENDING` con el consentimiento aceptado, el origen y un hash de la IP.
4. Busca coincidencias por hash de documento, correo y teléfono para proponer una vinculación y evitar duplicados.
5. Crea una tarea para la persona responsable.
6. Al aceptar, la solicitud crea o vincula a la persona y puede abrir un caso o una inscripción; si es spam, se descarta.

## 37. Frontend: arquitectura detallada

### 37.1 Principios

- Componentes de servidor por defecto; componentes de cliente solo donde hay interactividad.
- Formularios con React Hook Form y los mismos esquemas Zod del servidor.
- Los permisos en la interfaz solo ocultan opciones; **la decisión real siempre la toma el backend**.
- Los filtros y el orden de las tablas viven en la URL para poder compartir y recargar una vista.
- Un solo sistema de diseño en `packages/ui`, con tokens de color, espacio y tipografía.
- Español de Colombia, formato de moneda COP y zona horaria America/Bogota.

### 37.2 Rutas principales

| Ruta | Pantalla | Roles principales |
| --- | --- | --- |
| `/dashboard` | Panel según el rol | Todos |
| `/personas`, `/personas/[id]` | Listado y ficha 360° | Trabajo social, coordinación, dirección |
| `/hogares`, `/hogares/[id]` | Hogares e integrantes | Trabajo social |
| `/casos`, `/casos/[id]` | Tablero, línea de tiempo, notas, seguimientos y remisiones | Profesionales asignadas |
| `/programas/[code]` | CAM y THEMIS: inscripciones, asistencia, entregas | Gestión de programas |
| `/proyectos`, `/proyectos/[id]` | Pestañas: Resumen, Participantes, Operaciones, Presupuesto, Gastos, Financiación, Equipo, Evidencias, Indicadores e Informes | Coordinación y dirección |
| `/operaciones`, `/eventos/[id]` | Operaciones; asistencia con QR | Coordinación y voluntariado |
| `/donantes`, `/donaciones` | Gestión de donantes y donaciones | Gestión de donantes |
| `/subvenciones` | Tablero tipo kanban del pipeline | Dirección |
| `/voluntarios` | Perfiles, turnos y horas | Coordinación |
| `/finanzas` | Resumen, gastos, cuentas por pagar, pagos y presupuestos | Gestión financiera |
| `/proveedores`, `/servicios`, `/activos` | Proveedores, servicios y activos | Gestión financiera |
| `/comunicaciones`, `/tareas` | Historial y bandeja de tareas | Todos |
| `/reportes`, `/impacto` | Reportes e indicadores | Dirección y consulta |
| `/configuracion` | Usuarios, roles, catálogos, consentimientos y solicitudes de datos | Administración |

### 37.3 Componentes compartidos

| Componente | Función |
| --- | --- |
| `DataTable` | Tabla con paginación por cursor, filtros guardados, orden y columnas según el rol |
| `FormKit` | Campos, validación en línea y guardado de borrador |
| `Drawer` y `Modal` | Edición rápida sin perder el contexto |
| `Timeline` | Línea de tiempo de interacciones de una persona, caso o proyecto |
| `StatusBadge` | Estado con color y texto (nunca solo color) |
| `FileUpload` | Subida directa con URL firmada y estado del análisis |
| `PermissionGate` | Muestra u oculta según permisos |
| `ProtectedField` | Campo enmascarado; revelarlo registra la acción en la auditoría |
| `GlobalSearch` | Búsqueda con Ctrl o Cmd más K |
| `KanbanBoard` | Pipeline de subvenciones y de oportunidades de donantes |
| `ChartCard` | Gráfico con datos agregados y fecha de actualización |

### 37.4 Datos y estado

| Tipo | Herramienta | Regla |
| --- | --- | --- |
| Datos del servidor | TanStack Query (cliente) y `fetch` en componentes de servidor | Claves de caché por entidad; las mutaciones invalidan lo afectado |
| Formularios | React Hook Form y Zod | El esquema se comparte con la API |
| Filtros y paginación | Parámetros de la URL | Vistas compartibles |
| Estado de interfaz | `useState`, o un almacén pequeño solo si hace falta | Sin almacén global para datos del servidor |
| Actualización optimista | Solo en tareas y notificaciones | En finanzas y casos se espera la confirmación del servidor |

### 37.5 Ficha 360° de una persona

Es la pantalla central del sistema. El encabezado muestra el nombre (o el seudónimo si la identidad está protegida), los roles y la clasificación. Las pestañas, visibles según permisos, son: Resumen, Hogar, Casos, Programas, Actividades, Ayudas, Seguimientos, Comunicaciones, Documentos e Historial. Los campos sensibles aparecen enmascarados y se revelan con una acción que queda registrada.

### 37.6 Panel de dirección

Las cifras del panel salen de agregaciones reales, no de valores fijos. Para que cargue rápido, un trabajo programado calcula periódicamente las métricas y las guarda en una colección `metrics_snapshots` (adición a la lista del documento base), con la hora del cálculo visible en pantalla.

| Bloque | Indicadores | Fuente |
| --- | --- | --- |
| Impacto | Personas acompañadas, casos activos y cerrados, seguimientos, participantes CAM, atenciones THEMIS, ayudas entregadas | `cases`, `program_enrollments`, `aid_deliveries` |
| Recursos | Donaciones del mes, subvenciones en proceso, donantes activos | `donations`, `grant_applications`, `donors` |
| Finanzas | Gastos del mes, cuentas por pagar, ejecución presupuestal, saldo | `expenses`, `accounts_payable`, `budget_items` |
| Operación | Actividades próximas, tareas atrasadas, proyectos por vencer, servicios por pagar | `operations`, `tasks`, `projects`, `services` |

### 37.7 Experiencia de uso

- Lenguaje sencillo y formularios por pasos con guardado de borrador.
- Validación en línea, estados vacíos que explican qué hacer y confirmación en acciones irreversibles.
- Confirmaciones de asistencia y visitas desde el celular mediante PWA.
- **Sin datos de casos sin conexión:** un teléfono perdido sería una fuga. El modo sin conexión se limita a registrar asistencia y se sincroniza al volver la red.
- Modo claro y oscuro, tamaño de letra ajustable y navegación completa por teclado.

### 37.8 Accesibilidad y rendimiento

Cumplimiento de WCAG 2.2 AA verificado con axe en la integración continua y con pruebas manuales usando lector de pantalla. Lighthouse CI vigila los Core Web Vitals en rango «bueno». Imágenes optimizadas, carga diferida de gráficos y tablas con paginación en servidor.

## 38. Automatización, trabajos programados y alertas

En Vercel no hay procesos que vigilen la base de datos de forma permanente. Todo lo automático se apoya en dos piezas: trabajos programados con Vercel Cron, que llaman a rutas internas protegidas con un secreto, y una cola gestionada para el trabajo lento.

### 38.1 Trabajos programados

Las frecuencias son una propuesta; los límites de Vercel Cron dependen del plan.

| Trabajo | Frecuencia propuesta | Qué hace | Ejecución |
| --- | --- | --- | --- |
| Despacho del outbox | Cada pocos minutos | Entrega los eventos pendientes | Cron llama a `/internal/outbox/dispatch` |
| Motor de alertas | Cada hora | Evalúa las reglas por fecha | Cron llama a `/internal/cron/alerts` |
| Vencimientos financieros | Diario | Marca cuentas OVERDUE y crea la cuenta por pagar del período de cada servicio recurrente | Cron |
| Recalcular derivados | Nocturno | Rehace `totalDonated`, `hoursTotal`, recaudado por campaña | Cola |
| Métricas del panel | Cada hora | Actualiza `metrics_snapshots` | Cola |
| Archivos huérfanos | Diario | Elimina documentos pendientes que nunca se confirmaron | Cola |
| Copia de auditoría | Diario | Envía el registro de auditoría al almacenamiento de escritura única | Cola |

Las rutas de cron rechazan cualquier petición que no traiga el secreto configurado para el cron.

### 38.2 Motor de alertas

Las alertas se calculan por fecha y no por reloj exacto, y se clasifican en tramos: vence hoy, en 3 días, en 7 días y vencido.

| Regla | Condición | Destinataria | Canal |
| --- | --- | --- | --- |
| Caso sin seguimiento | Caso abierto con 15 días sin seguimiento (configurable) | Responsable y coordinación | Notificación y correo |
| Servicio por pagar | `nextPaymentDate` en 7 días o menos | Gestión financiera | Notificación |
| Cuenta por pagar vencida | `dueDate` pasada y sin pago completo | Gestión financiera y dirección | Notificación y correo |
| Proyecto por terminar | `endDate` en 30 días o menos | Responsable del proyecto | Notificación |
| Convocatoria por cerrar | `deadline` en 10 días o menos | Gestión de donantes y dirección | Notificación y correo |
| Tarea atrasada | `dueDate` pasada y sin completar | Persona asignada | Notificación |
| Donación registrada | Evento `DonationReceived` | Gestión de donantes | Notificación |

Para que una alerta no se repita cada hora, cada notificación lleva una clave de deduplicación (`dedupeKey`: entidad, regla, tramo y fecha) con índice único.

### 38.3 Reglas para toda automatización

- Es idempotente: ejecutarla dos veces produce el mismo resultado.
- Es corta y por lotes; si no cabe, se divide.
- Registra su resultado (éxito, fallo y motivo) y alimenta las alertas técnicas.
- Nunca envía una comunicación sin consentimiento vigente.
- Se puede pausar desde la configuración sin desplegar código.

## 39. Observabilidad, respaldo y recuperación

### 39.1 Observabilidad

| Señal | Herramienta | Qué vigila |
| --- | --- | --- |
| Registros estructurados | Registros de Vercel enviados a un servicio externo | `requestId`, identificador de usuaria, ruta y duración; nunca datos personales |
| Errores | Sentry | Frontend y backend, con filtrado de datos personales antes de enviar |
| Base de datos | Alertas y Performance Advisor de Atlas | Consultas lentas, conexiones, CPU, disco y retraso de réplica |
| Disponibilidad | `/api/health`, `/api/ready` y un monitor externo | Web, API, MongoDB, Redis y cola |
| Trabajos | Tablero del outbox y de la cola | Eventos pendientes antiguos, `DEAD_LETTER` y fallos de cron |
| Negocio | Alertas propias | Donaciones fallidas, webhooks rechazados y exportaciones masivas |

`/health` responde si el proceso vive; `/ready` verifica MongoDB y Redis. Ninguno expone detalles internos.

Alertas críticas que avisan de inmediato al equipo técnico: API caída, MongoDB o Redis desconectados, correo o WhatsApp fallando, webhooks fallando, eventos en `DEAD_LETTER`, conexiones de Atlas cerca del límite y picos de respuestas 401 o 403.

Objetivos iniciales, por validar con datos reales: disponibilidad mensual de 99,5 % y lecturas comunes por debajo de 800 ms en el percentil 95.

### 39.2 Respaldo y recuperación

| Elemento | Mecanismo | Verificación |
| --- | --- | --- |
| MongoDB | Respaldo continuo con restauración a un punto en el tiempo, más instantáneas programadas | Restauración en un clúster temporal cada trimestre |
| Archivos | Versionado del almacenamiento y réplica en otra región | Restauración de objetos de muestra |
| Auditoría | Copia con escritura única | Verificación de integridad |
| Código e infraestructura | GitHub y scripts versionados | Reconstrucción de un entorno desde cero |
| Llaves de cifrado (KMS) | Política de recuperación y copia protegida | Prueba de descifrado tras restaurar |

Si se pierde una llave de cifrado, los campos cifrados no se pueden recuperar ni con el mejor respaldo. Por eso las llaves tienen su propio plan de copia y recuperación.

Objetivos propuestos: pérdida máxima de datos de 1 hora y recuperación del servicio en 4 horas.

Procedimiento ante una pérdida de datos:

1. Declarar el incidente y activar el modo de mantenimiento (solo lectura).
2. Restaurar a un punto anterior al daño en un clúster nuevo.
3. Validar la integridad: conteos por colección, muestras y consistencia de la auditoría.
4. Apuntar las variables de entorno al clúster restaurado y reabrir el servicio.
5. Notificar a las personas afectadas si hubo exposición de datos.
6. Hacer un análisis posterior sin culpas y registrar las acciones correctivas.

Un respaldo que nunca se ha restaurado no es un respaldo.

### 39.3 Mantenimiento recurrente

- Actualización semanal de dependencias con revisión (Renovate o Dependabot).
- Revisión mensual de índices y consultas lentas con Performance Advisor.
- Revisión trimestral de accesos, roles y usuarias inactivas.
- Rotación periódica de secretos y llaves.
- Prueba trimestral de restauración y simulacro de incidente.

## 40. CI/CD, pruebas y calidad

### 40.1 Pipeline

1. Cada cambio entra por una solicitud de cambio (pull request) y nunca directamente a la rama principal.
2. Lint y verificación de tipos.
3. Pruebas unitarias del dominio.
4. Pruebas de integración con MongoDB real en réplica de un nodo, para cubrir transacciones y restricciones únicas.
5. Pruebas de aislamiento y permisos (la matriz de roles contra recursos y alcances).
6. Escaneo de dependencias, de secretos y análisis estático de seguridad.
7. Vercel despliega un entorno Preview conectado a la base de staging.
8. Pruebas de extremo a extremo con Playwright contra ese Preview.
9. Revisión humana obligatoria; los cambios en seguridad y finanzas exigen a una revisora designada (CODEOWNERS).
10. Al fusionar, se despliega a staging; tras aprobación manual, a producción. Las migraciones de datos van antes del despliegue, con el patrón de expandir y contraer, y el retroceso se hace promoviendo el despliegue anterior en Vercel.

### 40.2 Pruebas

| Tipo | Herramienta | Qué cubre |
| --- | --- | --- |
| Unitarias | Vitest | Reglas de dominio: estados de caso, aprobaciones, cálculo de presupuesto |
| Integración | Vitest y MongoDB en réplica | Repositorios, transacciones, outbox e índices únicos |
| Aislamiento y permisos | Vitest | Rol por recurso por alcance, incluida otra organización |
| Contrato | OpenAPI | Esquemas de la API y de webhooks |
| Extremo a extremo | Playwright | Flujos críticos (40.3) |
| Accesibilidad | axe y revisión manual | WCAG 2.2 AA |
| Carga | k6 | Picos de donación, exportaciones y búsquedas |
| Seguridad | OWASP ZAP y prueba de penetración externa anual | Vulnerabilidades |
| Restauración | Manual, trimestral | Respaldos y llaves |

### 40.3 Flujos de extremo a extremo obligatorios

1. Crear persona, abrir caso, registrar seguimiento y cerrar el caso.
2. Crear proyecto, presupuesto, gasto, aprobarlo, generar la cuenta por pagar y registrar el pago.
3. Registrar una donación, ver actualizado al donante, generar el recibo y crear la notificación.
4. Enviar un formulario público, recibir la solicitud, aceptarla y obtener la persona creada.
5. Un rol sin permiso intenta leer notas de caso y recibe «no encontrado».

### 40.4 Definición de terminado

- Pruebas pasan y las reglas nuevas tienen pruebas propias.
- Revisión de código aprobada.
- Contrato OpenAPI actualizado.
- Revisión de privacidad si hay campos personales nuevos, con su clasificación.
- Migración reversible y probada en staging.
- Registros, métricas y alertas considerados.
- Accesibilidad verificada en las pantallas nuevas.

## 41. Hoja de ruta, equipo y costos

&#91;embedded content: hoja de ruta · 7 fases con compuertas\]

No se construyen los veinte módulos a la vez: cada fase termina en una compuerta que debe cumplirse antes de pasar a la siguiente. La suma estimada es de 34 a 46 semanas (8 a 11 meses) con un equipo pequeño; es mayor que la de la sección 15 porque este alcance incluye finanzas operativas, activos e impacto.

### 41.1 Equipo sugerido

| Rol | Dedicación | Responsabilidad |
| --- | --- | --- |
| Líder técnica o técnico | Completa | Arquitectura, revisión de código y seguridad del diseño |
| Desarrolladoras o desarrolladores full-stack (2) | Completa | Backend y frontend |
| Diseño UX/UI | Parcial | Sistema de diseño y flujos |
| QA | Parcial | Pruebas y accesibilidad |
| DevOps y seguridad | Parcial | CI/CD, Atlas, Vercel y coordinación de la prueba de penetración |
| Dueña del producto (fundación) | Parcial y constante | Prioridades y validación; sin ella el proyecto se desvía |
| Asesoría jurídica | Puntual | Autorizaciones, política de datos, transferencia internacional y contratos |
| Contabilidad | Puntual | Reglas financieras y formato de exportación |

### 41.2 Costos de operación

Los precios cambian con frecuencia y no se verificaron contra las páginas vigentes de cada proveedor, así que esta tabla indica cómo se cobra cada pieza y no cifras. Se debe cotizar antes de aprobar el presupuesto.

| Componente | Cómo se cobra | Nota |
| --- | --- | --- |
| Vercel | Por integrante del equipo y por uso | Plan de pago para producción comercial; consultar condiciones para organizaciones sin ánimo de lucro |
| MongoDB Atlas | Por nivel de clúster, almacenamiento y respaldo | Clúster dedicado (M10 o superior) con respaldo continuo |
| Redis (Upstash) | Por comandos o por plan | Crece con el uso |
| Cola (QStash o Inngest) | Por mensajes o ejecuciones | Bajo al inicio |
| Almacenamiento (S3 o R2) | Por GB almacenado y transferido | Comparar el costo de transferencia de salida entre proveedores |
| Identidad con MFA | Por usuaria activa | Pocas usuarias internas |
| Correo y WhatsApp | Por mensaje | Depende del volumen de campañas |
| Sentry y registros | Por eventos | Un plan inicial suele bastar |
| KMS | Por llave y por solicitud | Costo bajo |

## 42. Riesgos, decisiones pendientes y arranque

### 42.1 Riesgos de este enfoque

| Riesgo | Mitigación |
| --- | --- |
| Una consulta sin filtro de alcance expone datos | `ScopedRepository`, pruebas de aislamiento y revisión obligatoria |
| Se agotan las conexiones de Atlas | Cliente por módulo, grupo pequeño, alertas y nivel de clúster adecuado |
| Funciones que superan el tiempo máximo | Trabajo en cola y procesamiento por lotes |
| Pérdida de la llave de cifrado | KMS con copia y recuperación probada |
| Costos que crecen sin control | Alertas de gasto y revisión mensual |
| Sobrealcance por veinte módulos | Fases con compuertas y dueña del producto |
| Dependencia de un proveedor | Adaptadores, exportación completa y dominio en paquetes puros |
| Modelo de datos desordenado | Convenciones de la sección 24, revisión de esquema en cada cambio y validación en Atlas |
| Incumplimiento legal | Revisión jurídica antes de producción |
| Baja adopción | Co-diseño, capacitación y pilotos por fase |

### 42.2 Decisiones pendientes

| # | Decisión | Opciones | Quién decide | Antes de |
| --- | --- | --- | --- | --- |
| 1 | Dónde vive la API | Route Handlers o NestJS, con prueba de concepto de dos días | Líder técnica | Fase 0 |
| 2 | Proveedor de identidad con MFA | Clerk, WorkOS, Auth0 o TOTP propio | Líder técnica y dirección | Fase 0 |
| 3 | Planes de Vercel y Atlas | Cotización con cada proveedor | Dirección | Fase 0 |
| 4 | Mongoose o Prisma | Según el código existente y el soporte vigente | Líder técnica | Fase 0 |
| 5 | Cifrado de campos | Del cliente de MongoDB o en la aplicación, según el plan de Atlas | Líder técnica | Fase 1 |
| 6 | Alcance del modo sin conexión | Solo asistencia, o más | Coordinación | Fase 2 |
| 7 | Pasarela de pagos | Wompi, PayU, Mercado Pago o Stripe | Dirección y contabilidad | Fase 3 |
| 8 | Sistema contable y formato de exportación | Según el que use la fundación | Contabilidad | Fase 4 |
| 9 | Umbral de aprobación y plazos de retención | Valores de partida y revisión jurídica | Dirección y asesoría jurídica | Fase 4 |
| 10 | Proveedor oficial de WhatsApp | Proveedores autorizados de la API de WhatsApp Business | Comunicaciones | Fase 6 |

### 42.3 Primeros diez días

- [ ] Confirmar con la dirección las preguntas abiertas de la sección 16.
- [ ] Crear las cuentas de GitHub, Vercel, Atlas e identidad a nombre de la fundación.
- [ ] Crear el clúster de staging en Atlas (São Paulo) y el proyecto en Vercel con entorno Preview.
- [ ] Montar el monorepo con lint, tipos y un pipeline mínimo.
- [ ] Definir con la dirección los roles y la matriz de permisos.
- [ ] Hacer la prueba de concepto de la API (decisión de la sección 21).
- [ ] Redactar con asesoría jurídica el texto de autorización y la política de tratamiento de datos.
- [ ] Inventariar las fuentes de datos actuales (Excel y hojas de cálculo) para planear la migración.
- [ ] Escribir el script de datos sintéticos.
- [ ] Programar el primer taller de co-diseño con el equipo social.

## 43. Siguientes entregables

- Esquemas Mongoose y Zod por colección, con enums y índices, listos para copiar al paquete `db`.
- Esqueleto del monorepo (pnpm, Turborepo, ESLint con reglas de dependencia y pipeline de GitHub Actions).
- Matriz completa de permisos `módulo.acción` por rol y las pruebas de aislamiento asociadas.
- Prototipos de las pantallas clave: ficha 360°, tablero de casos, proyecto y panel de dirección.
