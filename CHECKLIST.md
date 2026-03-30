# ✅ CHECKLIST - Calendario 5°F

## 🎯 ESTADO ACTUAL

```
┌─────────────────────────────────────────────────────────────┐
│                     CALENDARIO FUNCIONANDO ✅               │
│                  https://calendario-5f.vercel.app            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 TAREAS PENDIENTES (En Orden)

### TAREA 1: Deploy de Reglas Firestore ⏳
**Por hacer en tu terminal:**

```bash
# 1. Autenticar
cd ~/Desktop/calendario-5f
npx firebase login
→ Se abrirá navegador para Google Auth

# 2. Desplegar reglas
npx firebase deploy --only firestore:rules --project calendario-5f
→ Verás: "✓ firestore:rules deployed successfully"
```

**⏱ Tiempo estimado:** 2-3 minutos
**Bloqueante para:** Todo lo demás

---

### TAREA 2: Agregar Eventos de Prueba ⏳
**Por hacer en tu terminal (DESPUÉS del deploy de reglas):**

```bash
cd ~/Desktop/calendario-5f
npm install
node add-test-events.js
```

**Resultado esperado:**
```
📝 Agregando 5 eventos de prueba...
✅ Prueba de Matematicas (02-04-2026)
✅ Entrega Trabajo de Historia (07-04-2026)
✅ Dia del Libro (23-04-2026)
✅ Prueba de Ciencias Naturales (31-03-2026)
✅ Reunion de Apoderados (15-04-2026)

✨ Todos los eventos se agregaron exitosamente!
```

**Luego abre:** https://calendario-5f.vercel.app

Deberías ver los eventos en el calendario con sus colores por tipo.

**⏱ Tiempo estimado:** 1 minuto

---

### TAREA 3: Configurar n8n Workflow ⏳
**Por hacer en el navegador:**

#### 3.1 Importar Workflow
1. Abre https://javierabud.app.n8n.cloud/
2. Clic en "+ Crear > Desde archivo"
3. Sube `~/Desktop/calendario-5f/n8n-workflow-calendario.json`
4. Clic en "Abrir"

#### 3.2 Configurar Credenciales

**A. Gmail OAuth2:**
- En nodo "Gmail - Detectar Email"
- Clic en "Credenciales"
- Clic en "+ Crear > Gmail"
- Autoriza con abudjavier@gmail.com
- Se configurará automáticamente el filtro `to:abudjavier+calendario5f@gmail.com`

**B. Claude API:**
- En nodo "Claude - Parsear Email"
- En sección "Credenciales > httpHeaderAuth"
- Clic en "+ Crear"
- Agrega header `x-api-key` con tu clave Claude
- Valor: `sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`

#### 3.3 Activar
- Clic en botón "Activar" (arriba a la derecha)
- Verás: "Workflow is active"

**⏱ Tiempo estimado:** 5 minutos

---

### TAREA 4: Probar Flujo Email→Calendario ✅
**Manual:**

1. Envía email a `abudjavier+calendario5f@gmail.com`
   - **Asunto:** "Prueba de Inglés - 2026-04-10"
   - **Body:** "Unidades 3 y 4. Traer diccionario."

2. Espera 2-3 minutos (el trigger de n8n revisa cada 2 minutos)

3. En https://calendario-5f.vercel.app/admin
   - Verás el evento en pestaña "Pendientes"
   - Haz clic en "✓ Aprobar"

4. En https://calendario-5f.vercel.app
   - Recarga la página
   - El evento debería aparecer en el calendario

**⏱ Tiempo estimado:** 5 minutos

---

## 🎬 FLUJO COMPLETO (Visual)

```
┌──────────────────┐
│  Profesor envía  │
│  email a Gmail   │
│   (a+calendario  │
│ +5f@gmail.com)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  n8n Workflow    │
│  - Detecta email │
│  - Claude parsea │
│  - Extrae datos  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Firestore DB    │
│  (estado pendiente)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Admin verifica  │
│  /admin (pestaña │
│  Pendientes)     │
└────────┬─────────┘
         │
    Aprueba │
         │
         ▼
┌──────────────────┐
│  Firestore DB    │
│  (estado         │
│  publicado)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Calendario      │
│  público muestra │
│  el evento       │
└──────────────────┘
```

---

## 📊 RESUMEN DE CONFIGURACIÓN

| Componente | Estado | URL/Ubicación |
|-----------|--------|--------------|
| **Calendario (React + Vite)** | ✅ Deploying en Vercel | https://calendario-5f.vercel.app |
| **Firestore Database** | ✅ Creado (nam5) | Firebase Console |
| **Reglas de Seguridad** | ⏳ Esperando deploy | firestore.rules |
| **Índice Compuesto** | ✅ Creado (estado + fecha) | Firestore > Índices |
| **n8n Workflow** | ⏳ Esperando importar | n8n-workflow-calendario.json |
| **Gmail Alias** | ✅ Configurado | abudjavier+calendario5f@gmail.com |
| **Claude API** | ✅ Clave disponible | Será en n8n |
| **Admin Panel** | ✅ Sin contraseña (temporal) | https://calendario-5f.vercel.app/admin |

---

## 🚨 NOTAS IMPORTANTES

1. **El calendario YA FUNCIONA** - Puedes verlo en https://calendario-5f.vercel.app

2. **Sin eventos de prueba aún** - Está vacío, agrega los eventos con el script

3. **Firebase rules bloqueadas** - Por eso el script de eventos no funciona hasta desplegar

4. **Admin sin contraseña (TEMPORAL)** - Actualmente no hay login
   - Cuando funcione todo, descomentar `RutaProtegida` en App.jsx
   - Crear usuario en Firebase Auth para Miss Magdalena

5. **n8n workflow listo para importar** - Pero necesita configurar credenciales

---

## ✨ DESPUÉS QUE FUNCIONE TODO

**Tareas opcionales/futuras:**

- [ ] Habilitar autenticación en admin
- [ ] Crear credenciales para Miss Magdalena
- [ ] Agregar notificaciones por email a apoderados
- [ ] Agregar más tipos de eventos (feriados, reuniones)
- [ ] Mejorar diseño mobile (responsive)
- [ ] Agregar vista semanal/diaria
- [ ] Integrar con Google Calendar de los apoderados
- [ ] Soporte para otros idiomas

---

## 📞 CONTACTO CON CLAUDE

Si algo no funciona:
1. Revisa los logs en `npm run dev` (local)
2. Revisa los logs en Vercel (deployment)
3. Revisa la consola de Firestore
4. Pregúntame con detalles del error

---

**¿Listo para empezar? Ejecuta el paso 1 en tu terminal:**

```bash
cd ~/Desktop/calendario-5f
npx firebase login
```
