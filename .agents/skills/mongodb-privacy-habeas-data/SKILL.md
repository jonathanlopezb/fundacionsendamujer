---
name: mongodb-privacy-habeas-data
description: Instrucciones sobre privacidad por diseño, aislamiento de identidades y cumplimiento de Habeas Data Ley 1581 de 2012 en MongoDB.
---

# 🔒 Skill: MongoDB Privacy & Habeas Data Ley 1581

## Principios
1. **Identificadores Anónimos**: Las participantes se identifican externamente por `CSM-2026-XXXXXX` o `SM-XXXX`.
2. **Minimización de Datos**: No solicitar cédula ni dirección salvo en expedientes autorizados bajo consentimiento.
3. **Session Storage Isolation**: Las sesiones clínicas expiran automáticamente tras 120 minutos y no persisten en disco `localStorage`.
