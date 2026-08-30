# 📖 MANUAL OFICIAL DE USUARIO Y FUNCIONALIDADES
## Ecosistema Digital Integral — Fundación Senda Mujer (Cartagena, Colombia)

**Dirección Ejecutiva:** Dra. Sorelvis Murillo  
**Contacto Oficial:** +57 301 469 2095  
**Plataforma Web:** [fundacionsendamujer.vercel.app](https://fundacionsendamujer.vercel.app)  

---

## 📌 CONTENIDO GENERAL DEL MANUAL

1. [Visión General del Ecosistema](#1-visión-general-del-ecosistema)
2. [Sitio Web Institucional Principal (`/`)](#2-sitio-web-institucional-principal-)
3. [Plataforma Senda Universal — Sistema Operativo de Derechos (`/senda-universal`)](#3-plataforma-senda-universal--sistema-operativo-de-derechos-senda-universal)
4. [Plataforma EdTech SendaAcademia (`/academia`)](#4-plataforma-edtech-sendaacademia-academia)
5. [Portal Seguro de Beneficiarias (`/portal-beneficiaria`)](#5-portal-seguro-de-beneficiarias-portal-beneficiaria)
6. [Portal de Gestión Administrativa y Profesionales (`/admin`)](#6-portal-de-gestión-administrativa-y-profesionales-admin)
7. [Sistema de Seguridad, Camuflaje y Emergencias (SENDA SOS)](#7-sistema-de-seguridad-camuflaje-y-emergencias-senda-sos)
8. [Cumplimiento Normativo y Habeas Data (Ley 1581 de 2012)](#8-cumplimiento-normativo-y-habeas-data-ley-1581-de-2012)

---

## 1. VISIÓN GENERAL DEL ECOSISTEMA

El **Ecosistema Digital de la Fundación Senda Mujer** es una arquitectura web integral de última generación diseñada para promover la autonomía económica, la salud integral, el acceso a la justicia y el empoderamiento social de las mujeres en Cartagena y el departamento de Bolívar.

El ecosistema integra cinco grandes módulos independientes pero interconectados bajo la liderazgo institucional de la **Dra. Sorelvis Murillo**:

```
 ┌──────────────────────────────────────────────────────────────────────────┐
 │                     FUNDACIÓN SENDA MUJER (CARTAGENA)                     │
 └────────────────────────────────────┬─────────────────────────────────────┘
                                      │
       ┌──────────────────────────────┼──────────────────────────────┐
       ▼                              ▼                              ▼
┌──────────────┐             ┌─────────────────┐            ┌────────────────┐
│ SITIO WEB    │             │ SENDA ACADEMIA  │            │ PORTAL USUARIAS│
│ PRINCIPAL    │             │   (MICROSITIO   │            │  BENEFICIARIAS │
│      (/)     │             │    EDTECH)      │            │   (DASHBOARD)  │
└──────┬───────┘             └────────┬────────┘            └───────┬────────┘
       │                              │                             │
       ▼                              ▼                             ▼
┌──────────────┐             ┌─────────────────┐            ┌────────────────┐
│ SENDA SOS    │             │ AULA VIRTUAL    │            │ SEGUIMIENTO DE │
│ Y CAMUFLAJE  │             │ & CERTIFICADOS  │            │ METAS & CITAS  │
└──────────────┘             └─────────────────┘            └────────────────┘
```

---

## 2. SITIO WEB INSTITUCIONAL PRINCIPAL (`/`)

El sitio web principal sirve como puerta de entrada institucional, ofreciendo información pública, triaje interactivo y asistencia en tiempo real.

### Funcionalidades Clave:
- **Navbar Inteligente Responsiva**:
  - Enlaces de acceso directo a *SendaAcademia ↗*, *Portal de Usuarias*, *SENDA Universal* y *Portal de Profesionales*.
  - Menú hamburguesa optimizado para dispositivos móviles (iOS y Android).
- **Hero Section Dinámico**:
  - Presentación institucional con acceso prioritario a orientación psicológica, citas y donaciones.
  - Renderizado responsivo garantizado para pantallas móviles.
- **SendaBot — Asistente de Inteligencia Artificial 24/7 (`SendaBotChat.tsx`)**:
  - Impulsado por el motor de IA Groq Llama 3 70B con lógica de contingencia.
  - Ofrece respuestas empáticas sobre las rutas de atención en violencia basada en género (VBG), derechos reproductivos y programas de la fundación.
  - Contacto telefónico integrado con la Dra. Sorelvis Murillo (+57 301 469 2095).
- **Catálogo de los 7 Programas Integrales**:
  - *Programa 1*: Autonomía Económica & Emprendimiento Femenino.
  - *Programa 2*: Salud Sexual & Reproductiva.
  - *Programa 3*: Atención Psicosocial & Salud Mental.
  - *Programa 4*: Asesoría Jurídica & Defensa de Derechos (Ley 1257).
  - *Programa 5*: Prevención de Violencias Basadas en Género.
  - *Programa 6*: Formación Digital & Alfabetización Tecnológica.
  - *Programa 7*: Liderazgo Comunitario & Redes de Apoyo en Cartagena.
- **Test Psicológico SENDA EVAL (`PsychologicalTest.tsx`)**:
  - Cuestionario confidencial de 18 preguntas evaluando 4 áreas psicosociales.
  - Generación de informe con **SENDA Index** e indicación de nivel de riesgo.
- **Sección de Aliados Estratégicos**:
  - Reconocimiento institucional a la Defensoría del Pueblo, Gobernación de Bolívar y secretarías locales.

---

## 3. PLATAFORMA SENDA UNIVERSAL — SISTEMA OPERATIVO DE DERECHOS (`/senda-universal`)

Un avanzado motor de diagnóstico y mapeo normativo que traduce la legislación colombiana (CONPES 4080/4143, Ley 1257 de 2008, Sentencia C-055) a respuestas concretas para la beneficiaria.

### Funcionalidades Clave:
- **SendaWizard (Asistente Diagnóstico)**:
  - Formulario dinámico para identificar vulnerabilidades jurídicas, de salud o económicas.
- **Score Multidimensional de Riesgo**:
  - Semáforo de priorización para el equipo psicosocial.
- **Enrutamiento Institucional en Cartagena**:
  - Mapeo de Comisarías de Familia, Fiscalía, Defensoría y Centros de Salud en Bolívar.

---

## 4. PLATAFORMA EDTECH SENDAACADEMIA (`/academia`)

Standalone microsite de educación digital con experiencia **Platzi / Udemy**, diseñado con la paleta de colores oficial de la Fundación Senda Mujer (Púrpura Profundo `#3B0852`, Magenta `#E12880` y Dorado `#FBBF24`).

### Funcionalidades Clave:
- **Apertura en Pestaña Autónoma (`target="_blank"`)**:
  - Abre como un entorno independiente de aprendizaje sin interferir con la navegación principal.
- **Transmisión de Clases en Vivo (Senda LIVE 🔴)**:
  - Cuenta regresiva animada para las Masterclasses de la **Dra. Sorelvis Murillo** y el equipo docente.
  - Simulador de chat en vivo interactivo para realizar preguntas durante la clase.
- **Catálogo de Cursos por Rutas de Aprendizaje**:
  - *Autonomía Financiera*: "De la Idea al Negocio: Plan Financiero para Emprendedoras" y "Marketing en WhatsApp Business".
  - *Derechos & Liderazgo*: "Derechos Humanos y Ley 1257 en Colombia".
  - *Salud & Bienestar*: "Salud Sexual, Reproductiva y Sentencia C-055".
  - *Habilidades Digitales*: "Computación Básica e Inteligencia Artificial para la Vida".
- **Visualización Pública y Control de Acceso (*Auth-Gating*)**:
  - Las usuarias no registradas pueden explorar el temario, lecciones e instructores.
  - Para ingresar al aula virtual o chat en vivo, el sistema despliega el **Modal de Autenticación (`AuthModal.tsx`)**.
- **Aula Virtual e Interacción de Aprendizaje (`CoursePlayerModal.tsx`)**:
  - Reproducción de video en HD 1080p con controles de velocidad y pantalla completa.
  - Barra de progreso porcentual acumulado.
  - Pestaña de **Recursos Descargables** (PDFs, guías y plantillas en Excel).
  - Evaluaciones conceptuales tipo Quiz.
- **Certificados Digitales Verificables (`CertificateModal.tsx`)**:
  - Emisión de diploma al superar el 80% del curso.
  - Incluye la firma digital de la **Dra. Sorelvis Murillo**, código ID único y **Código QR de verificación**.
  - Botones de descarga directa en formato PDF y publicación en LinkedIn.

---

## 5. PORTAL SEGURO DE BENEFICIARIAS (`/portal-beneficiaria`)

Área privada donde cada usuaria autenticada gestiona su proceso de acompañamiento integral en Cartagena.

### Funcionalidades Clave:
- **Autorización de Habeas Data (Ley 1581 de 2012)**:
  - Casilla obligatoria de consentimiento informado previo al ingreso.
- **Seguridad y Control de Sesión**:
  - Expiración automática de sesión tras 2 horas de inactividad o cierre de la pestaña.
- **Dashboard Interactivo de Beneficiaria**:
  - **Tarjeta de Saludo Personalizado**: Con nombre de la beneficiaria, código de expediente (Ej. `SM-8842`) y especialista asignada.
  - **Métricas Globales**: Indicador SENDA Index, cursos completados y próximas citas.
- **Sección: Citas Médicas & Visitas Domiciliarias**:
  - Módulo de agendamiento y consulta de estado para:
    - *Ginecología & Salud Reproductiva*
    - *Odontología Integral*
    - *Medicina General Preventiva*
    - *Psicología & Salud Mental*
    - *Trabajo Social*
    - *Visitas Domiciliarias en Territorio* (Acompañamiento en la vivienda de la usuaria en barrios como Olaya Herrera, El Pozón, Nelson Mandela, etc.).
- **Sección: ¿Cómo Van Tus Metas? (`metas`)**:
  - Tablero gráfico interactivo con barras de progreso porcentual, categorías (Emprendimiento, Salud, Educación, Bienestar) y fechas límite de cumplimiento.
- **Sección: Proyectos Productivos & Capital Semilla (`capital_semilla`)**:
  - Mapeo del proyecto productivo asignado.
  - Estado del **Capital Semilla otorgado ($2.500.000 COP)**.
  - Registro de insumos y maquinaria adquirida (fileteadoras, telas, kits comercial).
  - Métricas de ventas mensuales y unidades producidas.
  - Hitos del proyecto con verificación de cumplimiento.
- **Bóveda Cifrada de Documentos**:
  - Carga segura y descarga de ecografías, cédula, certificados y reportes domiciliarios.

---

## 6. PORTAL DE GESTIÓN ADMINISTRATIVA Y PROFESIONALES (`/admin`)

Módulo diseñado exclusivamente para el equipo profesional y la **Dra. Sorelvis Murillo**.

### Funcionalidades Clave:
- **Tablero de Control de Usuarias**:
  - Listado general de expedientes activos y caracterización socioeconómica.
- **Gestión de Triajes Psicológicos**:
  - Recepción de resultados del test SENDA EVAL para asignación prioritaria de citas.
- **Control de Especialistas & Agenda**:
  - Coordinación de turnos médicos, psicólogas, abogadas y visitas en territorio.

---

## 7. SISTEMA DE SEGURIDAD, CAMUFLAJE Y EMERGENCIAS (SENDA SOS)

Diseñado para proteger la integridad de usuarias que puedan encontrarse en entornos de riesgo o bajo supervisión del agresor.

### Funcionalidades Clave:
- **Botón Flotante Pánico SOS**:
  - Presente en todas las pantallas principales. Acceso inmediato a la Línea Púrpura 155, 123 y contacto urgente con la Fundación Senda Mujer (+57 301 469 2095).
- **Modo Camuflaje / Salida Rápida [Tecla ESC]**:
  - Al presionar el botón de incógnito o la tecla `ESC`, la pantalla redirige inmediatamente a una web neutra de información general (clima o noticias), destruyendo temporalmente el estado visual sensible de la sesión.

---

## 8. CUMPLIMIENTO NORMATIVO Y HABEAS DATA (LEY 1581 DE 2012)

Todo el tratamiento de datos personales registrado en la plataforma (nombres, cédulas, diagnósticos, historial ginecológico y reportes de visitas domiciliarias) cumple estrictamente con el marco legal colombiano:

- **Confidencialidad Absoluta**: Los expedientes están cifrados de extremo a extremo.
- **Consentimiento Informado**: Registrado de forma digital antes de ingresar al Portal de Beneficiarias.
- **Derechos ARCO**: La usuaria puede solicitar en cualquier momento la actualización o rectificación de su información contactando a la Dirección Ejecutiva encabezada por la **Dra. Sorelvis Murillo**.

---

*Manual elaborado y actualizado para la versión oficial de producción de la Fundación Senda Mujer (Cartagena, Colombia).*
