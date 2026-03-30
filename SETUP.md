# 📅 Calendario 5°F - Guía de Configuración Final

## Estado Actual ✅

- ✅ Calendario deployed en Vercel: https://calendario-5f.vercel.app
- ✅ Firestore database creado
- ✅ Reglas de seguridad actualizadas
- ⏳ **PENDIENTE:** Desplegar reglas en Firebase
- ⏳ **PENDIENTE:** Agregar eventos de prueba
- ⏳ **PENDIENTE:** Configurar n8n para email→calendario

---

## 🚀 Pasos Siguientes

### 1. Desplegar Reglas de Firestore (PRIMERO)

Ejecuta en tu terminal:

```bash
cd ~/Desktop/calendario-5f
npx firebase login
```

Esto abre un navegador para autenticar con Google. Una vez autenticado:

```bash
npx firebase deploy --only firestore:rules --project calendario-5f
```

**Resultado esperado:**
```
✓ firestore:rules deployed successfully
```

---

### 2. Agregar Eventos de Prueba (SEGUNDO)

Una vez desplegadas las reglas, ejecuta:

```bash
cd ~/Desktop/calendario-5f
npm install
node add-test-events.js
```

Esto agregará 5 eventos de prueba (Prueba de Matemáticas, Tarea de Historia, Día del Libro, Prueba de Ciencias, Reunión de Apoderados).

**Luego abre:** https://calendario-5f.vercel.app

Deberías ver los eventos en el calendario en sus fechas correspondientes.

---

### 3. Configurar n8n para Email→Calendario (TERCERO)

#### 3.1 Importar Workflow en n8n

1. Abre https://javierabud.app.n8n.cloud/
2. Haz clic en "+ Crear > Desde archivo"
3. Sube: `~/Desktop/calendario-5f/n8n-workflow-calendario.json`
4. Haz clic en "Abrir"

#### 3.2 Configurar Credenciales

**Gmail OAuth2:**
1. En el nodo "Gmail Trigger", haz clic en "Credenciales"
2. Haz clic en "+ Crear > Gmail"
3. Autoriza con tu cuenta Google (abudjavier@gmail.com)
4. Configura filtro: `to:abudjavier+calendario5f@gmail.com`

**Claude API:**
1. En el nodo "HTTP Request", busca la sección "Headers"
2. Agrega header: `x-api-key` = `TU_ANTHROPIC_API_KEY`

**Firestore:**
1. En el nodo "Firestore (Google Cloud)", configura credenciales con tu Google Cloud

#### 3.3 Activar Workflow

1. Haz clic en el botón "Activar" (arriba a la derecha)
2. El workflow ahora escuchará en `abudjavier+calendario5f@gmail.com`

---

### 4. Probar el Flujo Email→Calendario

1. Envía un email a `abudjavier+calendario5f@gmail.com` con:
   - **Asunto:** "Prueba de Inglés - 2026-04-10"
   - **Body:** "Unidades 3 y 4. Traer diccionario."

2. En la pestaña "Pendientes" del admin (`/admin`), verás el evento como "pendiente"

3. Haz clic en "✓ Aprobar" para publicarlo

4. Recarga https://calendario-5f.vercel.app y verás el evento en el calendario

---

## 📝 Estructura de Email

El workflow de n8n parsea emails con este formato:

```
Asunto: [Titulo] - [Fecha YYYY-MM-DD]
Body: [Descripcion, materia, tipo, etc.]
```

Claude API extrae automáticamente:
- **titulo**: Del asunto
- **fecha**: Del asunto (formato YYYY-MM-DD)
- **tipo**: De las palabras clave (prueba, tarea, evento, etc.)
- **materia**: Del contenido (Matematicas, Historia, Lenguaje, etc.)
- **descripcion**: Del body del email

---

## 🔗 Enlaces Importantes

- **Calendario Público:** https://calendario-5f.vercel.app
- **Panel Admin:** https://calendario-5f.vercel.app/admin (sin contraseña por ahora)
- **Firebase Console:** https://console.firebase.google.com/u/0/project/calendario-5f
- **n8n Cloud:** https://javierabud.app.n8n.cloud

---

## ✨ Próximos Pasos (Cuando Esté Todo Funcionando)

1. **Habilitar autenticación** en el admin (`/admin`)
   - Editar `App.jsx`: uncomment `RutaProtegida`
   - Crear usuario en Firebase Auth para Miss Magdalena

2. **Customizar mensajes y errores**

3. **Agregar más tipos de eventos** (reuniones, feriados, etc.)

4. **Notificaciones** a apoderados vía email cuando hay cambios

---

**¿Preguntas?** Revisa el código en `src/hooks/useEventos.js` para entender cómo funcionan las queries de Firestore.
