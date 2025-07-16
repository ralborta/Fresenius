# 🔍 Guía de Diagnóstico - Variables Dinámicas ElevenLabs

## 🚨 Problema Identificado
Las variables dinámicas no llegan correctamente a ElevenLabs en las batch calls.

## 📋 Pasos de Diagnóstico

### Paso 1: Verificar Configuración Básica
```bash
# 1. Verificar que tienes la API key configurada
echo $ELEVENLABS_API_KEY

# 2. Verificar que el servidor está corriendo
npm run dev
```

### Paso 2: Usar el Endpoint de Test Mejorado
1. Ve a `http://localhost:3000/test-variables`
2. Llena todos los campos con datos de prueba:
   - **Número de teléfono**: `+5491123456789`
   - **Nombre del paciente**: `Juan Pérez`
   - **Stock previsto**: `150 unidades`
   - **Fecha de envío**: `15 de enero`
   - **Producto**: `Medicamento X`
3. Haz clic en "Probar Variables"
4. Revisa la consola del servidor para ver los logs detallados

### Paso 3: Revisar los Logs del Servidor
Busca estos logs en la consola:

```bash
=== TEST VARIABLES ENDPOINT MEJORADO ===
Request body completo: {...}
Variables extraídas: {...}
Variables normalizadas: {...}
Payload que se enviará a ElevenLabs: {...}
=== INICIANDO LLAMADA REAL A ELEVENLABS ===
✅ Respuesta exitosa de ElevenLabs: {...}
```

### Paso 4: Verificar la Respuesta de ElevenLabs
En la respuesta del endpoint `/api/test-variables`, verifica:

```json
{
  "success": true,
  "variables_recibidas": {...},
  "variables_normalizadas": {...},
  "payload_enviado": {...},
  "respuesta_elevenlabs": {...},
  "error_elevenlabs": null,
  "debug_info": {
    "batch_call_id": "batch_..."
  }
}
```

### Paso 5: Crear un Agente de Prueba
1. Haz una petición PUT a `/api/test-call`:
```bash
curl -X PUT http://localhost:3000/api/test-call
```

2. Esto creará un agente con configuración correcta para variables dinámicas.

### Paso 6: Probar con el Agente Nuevo
1. Usa el `agent_id` del agente creado en el paso anterior
2. Haz una llamada de prueba con `/api/test-call`
3. Verifica que las variables se usen correctamente

## 🔧 Posibles Problemas y Soluciones

### ❌ Problema 1: Variables Vacías
**Síntomas**: Las variables aparecen como `""` o `null`
**Solución**: Verificar que los campos del formulario no estén vacíos

### ❌ Problema 2: Variables No Se Filtran
**Síntomas**: Variables no permitidas se envían o variables permitidas no se envían
**Solución**: Verificar que las claves coincidan exactamente con las permitidas

### ❌ Problema 3: Error de ElevenLabs
**Síntomas**: Error 400, 401, o 500 de ElevenLabs
**Solución**: 
- Verificar API key
- Verificar formato del payload
- Verificar que el agente existe

### ❌ Problema 4: Variables No Se Sustituyen
**Síntomas**: El agente dice literalmente `{nombre_paciente}` en lugar del valor
**Solución**: 
- Verificar que el agente esté configurado para usar variables dinámicas
- Verificar que las variables se envíen en `dynamic_variables`

## 📊 Verificación del Agente

### Verificar Configuración del Agente
```bash
curl -H "xi-api-key: TU_API_KEY" \
  https://api.elevenlabs.io/v1/convai/agents/agent_01jyqdepnrf1x9wfrt9kkyy84t
```

### Configuración Correcta del Agente
```json
{
  "conversation_config": {
    "name": "AgentePruebaVariables",
    "first_message": "Hola {nombre_paciente}, tu {producto} con stock {stock_teorico} se enviará el {fecha_envio}.",
    "system_prompt": "Usa las variables dinámicas: {nombre_paciente}, {producto}, {stock_teorico}, {fecha_envio}"
  }
}
```

## 🧪 Casos de Prueba

### Caso 1: Variables Básicas
```json
{
  "nombre_paciente": "Juan Pérez",
  "producto": "Medicamento X",
  "stock_teorico": "150 unidades",
  "fecha_envio": "15 de enero"
}
```

### Caso 2: Variables con Caracteres Especiales
```json
{
  "nombre_paciente": "María González",
  "producto": "Medicamento Y (especial)",
  "stock_teorico": "200+ unidades",
  "fecha_envio": "20/01/2024"
}
```

## 📞 Verificar la Llamada

### 1. Obtener Batch Call ID
De la respuesta de `/api/test-call` o `/api/test-variables`

### 2. Verificar Estado
```bash
curl "http://localhost:3000/api/test-call?batch_call_id=TU_BATCH_ID"
```

### 3. Escuchar la Llamada
- Ve al dashboard de ElevenLabs
- Busca la conversación por el `conversation_id`
- Verifica que las variables se sustituyan correctamente

## 🆘 Si el Problema Persiste

### 1. Recopilar Información
- Logs completos del servidor
- Respuesta de ElevenLabs
- Configuración del agente
- Payload enviado

### 2. Verificar
- API key válida y con permisos correctos
- Agente configurado para usar variables dinámicas
- Variables definidas en el `first_message` y `system_prompt`

### 3. Contactar Soporte
Si todo lo anterior está correcto, contacta al soporte de ElevenLabs con:
- Batch Call ID
- Conversation ID
- Logs de error
- Configuración del agente

## 🎯 Resultado Esperado

Después de seguir estos pasos, deberías ver:
1. ✅ Variables se envían correctamente a ElevenLabs
2. ✅ Batch call se crea exitosamente
3. ✅ El agente usa las variables dinámicas en la llamada
4. ✅ La conversación muestra los valores sustituidos

Si no ves estos resultados, el problema está en uno de los pasos anteriores y necesitamos investigar más a fondo. 