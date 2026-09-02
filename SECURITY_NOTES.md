# SECURITY NOTES & AUDITORÍA DE PRIVACIDAD — CARIBE SEGURO

## Fundación Senda Mujer | Ecosistema SENDA

---

### 1. Marco Legal & Habeas Data (Ley 1581 de 2012 - Colombia)
- Todos los datos recolectados en el módulo IPSC y expedientes EHR se consideran **datos sensibles** bajo la Ley 1581 de 2012 y Decreto 1377 de 2013.
- La recolección de puntajes en las 10 dimensiones de protección requiere **consentimiento informado explícito previo**, el cual queda registrado en la colección `consent_records` con fecha, versión del texto legal y hash de dispositivo (sin IP cruda).
- Ningún dato del IPSC se muestra fuera del Portal Profesional autenticado.

---

### 2. Aislamiento del Portal Profesional (`/admin`)
- El Portal Profesional está desvinculado de la navegación pública del sitio web principal.
- La sesión se valida mediante token de sesión aislada y roles institucionales (`ADMIN_SISTEMA`, `MEDICO`, `JURIDICO`, `TRABAJO_SOCIAL`, `PSICOLOGO`, `COORDINADOR`).
- El inicio de sesión se exige exclusivamente con **Correo Electrónico Institucional** y contraseña.

---

### 3. Principio de No Predicción & Agregación Segura (k >= 5)
- El IPSC **nunca predice violencia ni feminicidio**. Todas las alertas (Amarilla/Roja) son basadas en reglas aritméticas deterministas y variación histórica de puntaje entre mediciones consecutivas.
- Los agregados territoriales y publicaciones del Observatorio garantizan una muestra mínima de **$k \ge 5$ mujeres por grupo**, previniendo cualquier riesgo de re-identificación o deducción indirecta.
- Los snapshots públicos nunca consultan colecciones de expedientes individuales.

---

### 4. Log de Auditoría (`access_audit_log`)
- Cada acceso de lectura, modificación o consulta a datos sensibles del IPSC genera una entrada inmutable de auditoría con `userId`, `beneficiaryCode`, `resource` y `timestamp`.
