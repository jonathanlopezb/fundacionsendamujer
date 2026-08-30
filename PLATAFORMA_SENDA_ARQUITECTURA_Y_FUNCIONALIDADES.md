# 📚 Catálogo Integral de Arquitectura, Componentes y Funcionalidades — Plataforma Fundación Senda Mujer (Senda Universal)

> **Versión de Producción 2026** | **Stack**: Next.js 14.2.5 (App Router) + TypeScript + Tailwind CSS + Groq AI LLM (`groq/compound` & `openai/gpt-oss-120b`) + MongoDB Atlas + Vercel Storage.

---

## 🏛️ 1. Filosofía y Marco Normativo de Estado
La plataforma **Senda Universal** no funciona como un portal web tradicional de trámites estáticos; es un **Sistema Operativo Institucional de Derechos de las Mujeres**, diseñado bajo la premisa:

> *"Una mujer entra a Senda y la tecnología descubre qué derechos, servicios, ayudas, oportunidades y rutas le corresponden legalmente, sin que ella tenga que conocer la burocracia del Estado."*

### Políticas Públicas y Leyes Nacionales Integradas
1. **CONPES 4080 de 2022 (Política Pública Nacional de Equidad de Género al 2030)**:
   - **Eje 1:** Autonomía Económica y Emprendimiento Semilla.
   - **Eje 2:** Participación y Liderazgo Político/Comunal.
   - **Eje 3:** Salud Integral y Derechos Sexuales y Reproductivos.
   - **Eje 4:** Vida Libre de Violencias.
   - **Eje 5:** Paz, Seguridad y Resolución 1325.
   - **Eje 6:** Institucionalidad y Transversalización de Género.
2. **CONPES 4143 de 2025 (Política Nacional de Cuidado) & Ley 2281 de 2023**:
   - Reconocimiento y redistribución de la carga de cuidado no remunerado.
   - Articulación con el Sistema Nacional de Cuidado (CDI, Red ICBF Cartagena, apoyo a madres cuidadoras).
3. **Ley 1257 de 2008 (Vida Libre de Violencias para las Mujeres)**:
   - Identificación de 5 tipos de violencia: Física, Psicológica, Sexual, Económica y Patrimonial.
   - Medidas de protección inmediata (Arts. 16-19) y remisión a Casas de Justicia y Comisarías de Familia.
4. **Sentencia C-055 de 2022 & Sentencia C-355 de 2006 (Corte Constitucional)**:
   - Garantía de autonomía reproductiva sin juzgamiento ni barreras institucionales.
5. **Ley 2244 de 2022 (Parto Digno y Humanizado)**:
   - Eliminación de la violencia obstétrica en la atención en salud.
6. **Resolución 1350 de 2026 (Política Nacional de Derechos Sexuales y Reproductivos 2026–2035)**:
   - Red de atención ginecológica y médica prioritaria.
7. **Ley 1581 de 2012 (Habeas Data & Protección de Datos Sensibles)**:
   - Aislamiento de sesiones en `sessionStorage` para destrucción automática al cerrar pestañas.

---

## 💻 2. Catálogo de Páginas y Módulos de la Plataforma (`src/app/`)

| Ruta URL | Módulo / Aplicación | Descripción y Funcionalidad |
|---|---|---|
| `/` | **Home Page (Portada)** | Portada de alta velocidad con Banner de Síntesis Ejecutiva de Senda Universal, Video "Charla del Día", Triage Rápido SendaEval, Grilla de 7 Programas y Cinta de 5 Especialidades. |
| `/senda-universal` | **SendaWizard (Diagnóstico Paso a Paso Élite)** | Sistema Operativo de 12 pasos guiados. Evalúa necesidades, asigna un **Código Protegido Temporal** (ej: `SENDA-A3F1C2`) y genera un Informe Élite de Derechos con Inteligencia Artificial. |
| `/portal-beneficiaria` | **Portal de Usuarias (Beneficiary Portal)** | Tab-scoped dashboard (`sessionStorage`). Permite a la usuaria gestionar citas médicas/jurídicas y acceder a la **SendaAcademia** con certificación. |
| `/admin` | **Portal Profesional & Ejecutivo** | Dashboard administrativo tab-scoped (`sessionStorage`). Gestión de expedientes, asignación de citas, métricas del Observatorio de Brechas y control de profesionales. |
| `/academia` | **SendaAcademia** | Portal educativo con cursos asignados (Salud Ginecología, Patronaje, Emprendimiento, Finanzas, Liderazgo). Génesis de certificados con validación por código QR. |
| `/triaje-psicologico` | **SendaEval (Triage Psicológico & Vulnerabilidad)** | Test diagnóstico en 4 áreas para asignación directa de cita prioritaria con la profesional graduada en Cartagena. |
| `/agendar-cita` | **Sistema de Citas Multidisciplinarias** | Agendamiento en 5 especialidades: Psicología, Odontología Integral, Medicina General, Asesoría Jurídica y Trabajo Social. |
| `/directorio-cartagena` | **Directorio Institucional de Emergencia** | Mapa y directorio de rutas en Cartagena: Comisarías de Familia, Casa Violeta, Casa de Justicia Chiquinquirá, ESE Hospital Local, Línea Púrpura 155 y Fiscalía 122. |
| `/donaciones` | **Hub de Donaciones 1 a 1** | Calculadora transparente de impacto social para patrocinar Kits de Maternidad, Consultas Odontológicas o Sesiones Psicológicas. |

---

## 🧩 3. Catálogo Completo de Componentes UI (`src/components/`)

### 1. `SendaWizard.tsx` (Sistema Operativo Paso a Paso)
- **Propósito:** Software interactivo de 12 pasos guiados.
- **Funcionalidad:**
  - Diagnostica: Edad, Urgencia, Cuidado, Economía, Vivienda, Violencia, Salud SSR, Educación, Red de Apoyo, Instituciones, Meta a 3 Meses y Geolocalización.
  - Genera algoritmo de **Código Protegido Temporal** (`SENDA-XXXXXX`).
  - Conecta en tiempo real con `/api/senda-elite-engine` (Groq LLM `openai/gpt-oss-120b`).
  - Muestra tarjetas de riesgo (0-100) en 7 dimensiones de vida, alerta de protección si hay violencia, y hoja de ruta gradual (1 semana, 1 mes, 3 meses).

2. `Navbar.tsx` (Barra de Navegación Profesional)
- **Propósito:** Navegación superior ejecutiva y móvil.
- **Funcionalidad:**
  - Badges destacados en colores corporativos para accesos directos: `SendaAcademia`, `Portal Usuarias ↗` (`target="_blank"`), `Portal Profesional ↗` (`target="_blank"`), y `🌍 SENDA Universal`.
  - Botón discreto de Emergencia Salida Rápida.

3. `CharlaDelDia.tsx` (Sección de Video y Contenido Diario)
- **Propósito:** Capacitación audiovisual continua en la portada.
- **Funcionalidad:** Reproductor de video interactivo con transcripción, recursos descargables y botón para agendar consulta relacionada.

4. `SendaBotChat.tsx` (Asistente Virtual Inteligente 24/7)
- **Propósito:** Contención emocional inicial y orientación en derechos.
- **Funcionalidad:**
  - Modal flotante animado.
  - Conexión directa a `/api/chat` alimentada por el modelo Groq LLM `groq/compound`.
  - Respuestas empáticas adaptadas al contexto de Cartagena y las Sentencias C-055/C-355 y Ley 1257.

5. `BeneficiaryPortal.tsx` (Portal de Usuarias)
- **Propósito:** Gestión integral de la beneficiaria post-login.
- **Funcionalidad:**
  - Autenticación segura tab-isolated (`sessionStorage`).
  - Módulo dual: (1) Citas Médicas / Gestiones Administrativas, (2) SendaAcademia y Recursos Asignados.

6. `AdminManagementPanel.tsx` (Panel Ejecutivo Profesional)
- **Propósito:** Consola de administración para psicólogas, médicas, abogadas y trabajadoras sociales.
- **Funcionalidad:**
  - Autenticación con expiración automática por inactividad y destrucción de sesión al cerrar la pestaña (`sessionStorage`).
  - Tablas de usuarias, aprobación de citas, observatorio de brechas de género y registro de atenciones.

7. `HeroSection.tsx`, `ProgramsGrid.tsx`, `CartagenaDirectory.tsx`, `DonationCalculator.tsx`
- **Propósito:** Módulos de sensibilización, presentación de los 7 programas de la fundación, rutas locales en Cartagena y financiamiento transparente.

---

## ⚡ 4. Rutas API de Inteligencia Artificial y Datos (`src/app/api/`)

1. **`/api/senda-elite-engine` (POST)**:
   - Recibe las respuestas del wizard de 12 pasos y el código temporal.
   - Ejecuta prompt especializado en **Groq LLM (`openai/gpt-oss-120b`)** configurado en modo `json_object`.
   - Devuelve: `nivelCrisis`, `scoreDimensiones`, `accionesInmediatas` (con artículos de ley y contactos reales en Cartagena), `rutaIntegral` (semana 1, mes 1, mes 3) y `derechosGarantizados`.

2. **`/api/chat` (POST)**:
   - Chatbot conversacional empático alimentado por **Groq LLM (`groq/compound`)**.
   - Proporciona orientación 24/7 sobre violencia, salud sexual/reproductiva, agendamiento y donaciones.

3. **`/api/senda-policy-engine` (POST)**:
   - Procesa historias libres expresadas por usuarias en lenguaje natural y las traduce a vectores de vulnerabilidad.

4. **`/api/triage`, `/api/appointments`, `/api/donations`**:
   - Integración con base de datos MongoDB para persistencia de agendamientos y evaluaciones psicosociales.

---

## 🛡️ 5. Fortalezas Tecnológicas y de Seguridad Élite

1. **Seguridad de Sesión Tab-Scoped (`sessionStorage`)**:
   - Cumplimiento de la Ley 1581/2012 de Habeas Data. Las credenciales de usuarias y profesionales no persisten en el disco (`localStorage`), sino que **se borran automáticamente al cerrar la pestaña del navegador**, impidiendo fugas de información en computadores compartidos o públicos.

2. **Aislamiento en Pestañas Independientes (`target="_blank"`)**:
   - Los accesos a los portales administrativos y de usuarias se abren en ventanas aisladas, garantizando que cada sesión viva exclusivamente dentro de su pestaña activa.

3. **Rendimiento de Carga Extraordinario**:
   - Portada liviana con síntesis ejecutiva, evitando sobrecargar el DOM inicial.
   - Carga diferida de módulos pesados mediante App Router de Next.js 14.

4. **Arquitectura con Fallbacks Inteligentes**:
   - Si la API Key de IA experimenta latencia o caída temporal, los engines poseen **algoritmos matemáticos de respaldo local**, garantizando que la mujer NUNCA se quede sin su hoja de ruta ni sin su código de expediente.

---

## 🌟 6. Impacto Social y Escala de Aplicación
- **Enfoque Cartagena & Caribe:** Integración nativa con la Patrulla Púrpura, Casa Violeta, Comisarías de Familia locales y la red pública de salud de Cartagena.
- **Enfoque Nacional:** Escalable a cualquier municipio de Colombia mediante la parametrización del CONPES 4080 y la Ley 1257.
