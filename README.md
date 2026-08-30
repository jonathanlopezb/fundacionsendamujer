# 🌸 Fundación Senda Mujer — Plataforma Senda Universal

> **Sistema Operativo Institucional de Derechos de las Mujeres en Colombia**  
> Plataforma de Inteligencia Social, Descubrimiento de Derechos, Agendamiento Multidisciplinario, SendaAcademia y Atención Integral.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-groq%2Fcompound-orange?style=for-the-badge)](https://groq.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 📌 Visión del Proyecto

**Fundación Senda Mujer** opera en Cartagena y Colombia bajo un principio transformador:

> *"No le preguntes a una mujer qué trámite burocrático necesita; pídele que te cuente qué está viviendo y utiliza la tecnología para descubrir qué derechos, leyes, servicios, subsidios y rutas le corresponden legalmente."*

La plataforma combina **Inteligencia Artificial (Groq LLM)**, **Modelos de Sesión Tab-Scoped de Alta Seguridad (`sessionStorage`)** y la normativa de género de Colombia (**CONPES 4080**, **CONPES 4143**, **Ley 1257 de 2008**, **Sentencias C-055/C-355**, **Ley 2244 de Parto Digno** y la **Política SSR 2026–2035**).

---

## 🚀 Funcionalidades Principales

### 🌍 1. SendaUniversal & SendaWizard (`/senda-universal`)
- **Software Diagnóstico de 12 Pasos:** Evalúa edad, vulnerabilidad, carga de cuidado, situación económica, vivienda, violencia, salud SSR, educación, red de apoyo, barreras institucionales, metas y geolocalización.
- **Código Protegido Temporal:** Asigna una clave única de expediente (ej. `SENDA-A3F1C2`) válida por 48 horas sin almacenar datos personales.
- **Motor de Inteligencia Artificial Élite (`/api/senda-elite-engine`):** Alimentado por el modelo `openai/gpt-oss-120b` de Groq. Genera un diagnóstico con puntajes de riesgo (0-100) en 7 dimensiones de vida, artículos legales exactos, lugares físicos de atención en Cartagena (Comisarías, Casa Violeta, Casa de Justicia Chiquinquirá) y hoja de ruta a 1 semana, 1 mes y 3 meses.

### 🌷 2. SendaBot Chatbot 24/7 (`SendaBotChat.tsx`)
- Asistente virtual confidencial impulsado por el modelo flagship **`groq/compound`**.
- Brinda contención emocional, información sobre la Ley 1257, rutas de la Línea Púrpura (155) y guía para agendamiento de citas.

### 👩‍⚕️ 3. Agendamiento en 5 Especialidades Multidisciplinarias (`/agendar-cita`)
- Atención gratuita en Cartagena con profesionales graduadas y aliadas:
  1. 🧠 **Psicología & Mente**
  2. 🦷 **Odontología Integral**
  3. 🩺 **Medicina General**
  4. ⚖️ **Asesoría Jurídica**
  5. 💖 **Trabajo Social**

### 🎓 4. Portal Beneficiaria & SendaAcademia (`/portal-beneficiaria` & `/academia`)
- Dashboard personalizado con **sesión aislada por pestaña (`sessionStorage`)**.
- Acceso dual a gestiones administrativas/citas y a la academia virtual de formación técnica y emprendimiento con certificación por código QR.

### 🔒 5. Portal Profesional Ejecutivo (`/admin`)
- Panel de control para el equipo interdisciplinario.
- Permite aprobar citas, monitorear el Observatorio de Brechas de Género y revisar expedientes anónimos con cierre automático de sesión al cerrar la pestaña del navegador.

### 📹 6. Charla del Día (`CharlaDelDia.tsx`)
- Espacio audiovisual destacado en la portada principal para capacitación diaria de usuarias y profesionales.

---

## 🛠️ Requisitos e Instalación

### Prerrequisitos
- Node.js >= 18.x
- npm / yarn / pnpm

### Clonar e Instalar
```bash
git clone https://github.com/jonathanlopezb/fundacionsendamujer.git
cd fundacionsendamujer
npm install
```

### Variables de Entorno (`.env.local`)
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/fundacion_senda_mujer?retryWrites=true&w=majority

# Groq AI API Key (Para SendaBot y SendaWizard Engine)
GROQ_API_KEY=gsk_...

# Vercel Blob Storage Token
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Ejecutar en Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del Proyecto

```
fundacionsendamujer/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts                # SendaBot Groq AI (groq/compound)
│   │   │   ├── senda-elite-engine/route.ts  # Engine Élite de Derechos (openai/gpt-oss-120b)
│   │   │   ├── senda-policy-engine/route.ts # Evaluador analítico CONPES
│   │   │   ├── appointments/route.ts        # API de citas
│   │   │   └── triage/route.ts              # API de evaluador SendaEval
│   │   ├── senda-universal/page.tsx          # Página del Diagnóstico Paso a Paso
│   │   ├── portal-beneficiaria/page.tsx     # Portal de Usuarias
│   │   ├── admin/page.tsx                   # Portal Profesional
│   │   ├── agendar-cita/page.tsx            # Agendamiento de citas
│   │   ├── academia/page.tsx                # SendaAcademia
│   │   └── page.tsx                         # Homepage principal optimizada
│   └── components/
│       ├── SendaWizard.tsx                  # Software Diagnóstico Paso a Paso
│       ├── SendaBotChat.tsx                 # Chatbot Inteligente Flotante
│       ├── BeneficiaryPortal.tsx            # Dashboard Usuarias (sessionStorage)
│       ├── AdminManagementPanel.tsx         # Dashboard Profesional (sessionStorage)
│       ├── Navbar.tsx                       # Barra superior ejecutiva
│       ├── CharlaDelDia.tsx                 # Módulo de Video Destacado
│       ├── HeroSection.tsx                  # Banner principal
│       └── CartagenaDirectory.tsx           # Directorio de emergencias Cartagena
├── PLATAFORMA_SENDA_ARQUITECTURA_Y_FUNCIONALIDADES.md # Catálogo exhaustivo de componentes
└── README.md                                # Guía general del proyecto
```

---

## ⚖️ Marco Legal Integrado
- **CONPES 4080 (2022)** — Política Pública Nacional de Equidad de Género para las Mujeres al 2030.
- **CONPES 4143 (2025)** — Política Nacional de Cuidado y Sistema Nacional de Cuidado (Ley 2281/2023).
- **Ley 1257 de 2008** — Normas de sensibilización, prevención y sanción de formas de violencia contra las mujeres.
- **Sentencias C-055/2022 & C-355/2006** — Garantía de autonomía reproductiva.
- **Ley 2244 de 2022** — Parto Digno y erradicación de violencia obstétrica.
- **Resolución 1350 de 2026** — Política Nacional de Derechos Sexuales y Reproductivos 2026–2035.
- **Ley 1581 de 2012** — Protección de Datos Personales y Habeas Data.

---

## 🔐 Seguridad y Privacidad
- **SessionStorage Isolation:** Las credenciales y sesiones activas están restringidas al ciclo de vida de la pestaña activa. Al cerrar la ventana, la sesión se inactiva automáticamente.
- **Código Protegido Anónimo:** Las evaluaciones generan tokens hashes (`SENDA-XXXXXX`), permitiendo consultar hojas de ruta sin exponer datos de identidad en el navegador.

---

## 📄 Licencia
Este proyecto es desarrollado para la **Fundación Senda Mujer** en Cartagena, Colombia. Todos los derechos reservados.
