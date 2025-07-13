# Troubleshooting Variables Dinámicas - ElevenLabs

## 🔍 **Diagnóstico de Problemas**

### 1. **Verificar que las Variables se Envían Correctamente**

**Paso 1: Usar la página de test**
- Ve a `/test-variables` en tu aplicación
- Llena todos los campos con datos de prueba
- Ejecuta el test y revisa los logs

**Paso 2: Revisar los logs del servidor**
```bash
# En la consola del servidor, busca estos logs:
=== DEBUG VARIABLES DINÁMICAS ===
Variables recibidas del frontend: {...}
Variables normalizadas: {...}
=== PAYLOAD COMPLETO ENVIADO A ELEVENLABS ===
```

### 2. **Problemas Comunes y Soluciones**

#### ❌ **Problema: Variables vacías o undefined**
**Síntomas:**
- Las variables no aparecen en ElevenLabs
- Logs muestran `{}` o `undefined`

**Solución:**
```typescript
// Verificar que los campos del formulario no estén vacíos
if (!nombrePaciente || !stockPrevisto || !fechaEnvio || !producto) {
  console.error('Campos requeridos vacíos');
  return;
}
```

#### ❌ **Problema: Variables no se filtran correctamente**
**Síntomas:**
- Variables no permitidas se envían
- Variables permitidas no se envían

**Solución:**
```typescript
// Verificar que las claves coincidan exactamente
const permitidas = ['nombre_paciente', 'stock_teorico', 'fecha_envio', 'producto'];
// Asegúrate de que las claves en el frontend coincidan
```

#### ❌ **Problema: Formato incorrecto del payload**
**Síntomas:**
- Error 400 de ElevenLabs
- Variables no se procesan

**Solución:**
```typescript
// Verificar estructura del payload
const payload = {
  call_name: 'Test Call',
  agent_id: agentId,
  agent_phone_number_id: agentPhoneNumberId,
  recipients: [
    {
      phone_number: phoneNumber,
      dynamic_variables: {
        nombre_paciente: nombrePaciente,
        stock_teorico: stockPrevisto,
        fecha_envio: fechaEnvio,
        producto: producto
      }
    }
  ]
};
```

### 3. **Verificación del Agente en ElevenLabs**

#### ✅ **Verificar configuración del agente:**
1. Ve al dashboard de ElevenLabs
2. Busca tu agente por ID: `agent_01jyqdepnrf1x9wfrt9kkyy84t`
3. Verifica que el `first_message` use las variables correctas:

```typescript
// Ejemplo de first_message correcto
"Hola {nombre_paciente}, tu {producto} con stock {stock_teorico} será enviado el {fecha_envio}"
```

#### ❌ **Problema: Variables no definidas en el agente**
**Síntomas:**
- El agente no reconoce las variables
- Mensaje literal en lugar de variable

**Solución:**
1. Actualizar el `first_message` del agente
2. Usar la sintaxis correcta: `{nombre_variable}`
3. Asegurar que las variables coincidan exactamente

### 4. **Testing Step by Step**

#### **Paso 1: Test Local**
```bash
# 1. Llena el formulario en /test-variables
# 2. Ejecuta el test
# 3. Revisa los logs del servidor
# 4. Verifica que las variables se normalicen correctamente
```

#### **Paso 2: Test con ElevenLabs**
```bash
# 1. Usa /test-call con datos reales
# 2. Revisa la respuesta de ElevenLabs
# 3. Verifica el batch_call_id
# 4. Monitorea el estado de la llamada
```

#### **Paso 3: Verificar la Llamada**
```bash
# 1. Revisa los logs de la conversación en ElevenLabs
# 2. Verifica que las variables se sustituyan correctamente
# 3. Escucha la llamada para confirmar
```

### 5. **Logs de Debug Mejorados**

#### **En el API:**
```typescript
console.log('=== DEBUG COMPLETO ===');
console.log('Request body:', JSON.stringify(requestBody, null, 2));
console.log('Variables extraídas:', variables);
console.log('Variables normalizadas:', dynamicVariablesNormalizadas);
console.log('Payload final:', JSON.stringify(payload, null, 2));
console.log('Respuesta ElevenLabs:', response);
```

#### **En el Frontend:**
```typescript
console.log('Datos del formulario:', {
  nombrePaciente,
  stockPrevisto,
  fechaEnvio,
  producto
});
console.log('Payload enviado:', payload);
```

### 6. **Casos de Prueba**

#### **Caso 1: Variables básicas**
```json
{
  "nombre_paciente": "Juan Pérez",
  "stock_teorico": "150 unidades",
  "fecha_envio": "15 de enero",
  "producto": "Medicamento X"
}
```

#### **Caso 2: Variables con caracteres especiales**
```json
{
  "nombre_paciente": "María González",
  "stock_teorico": "200+ unidades",
  "fecha_envio": "20/01/2024",
  "producto": "Medicamento Y (especial)"
}
```

#### **Caso 3: Variables vacías**
```json
{
  "nombre_paciente": "",
  "stock_teorico": "0",
  "fecha_envio": "Pendiente",
  "producto": "N/A"
}
```

### 7. **Comandos de Verificación**

#### **Verificar variables de entorno:**
```bash
echo $ELEVENLABS_API_KEY
```

#### **Verificar logs del servidor:**
```bash
# En desarrollo
npm run dev
# Buscar logs de debug en la consola
```

#### **Verificar respuesta de ElevenLabs:**
```bash
# Usar el endpoint GET para verificar estado
curl "http://localhost:3000/api/test-call?batch_call_id=TU_BATCH_ID"
```

### 8. **Contacto con Soporte**

Si los problemas persisten:

1. **Recopila información:**
   - Logs completos del servidor
   - Respuesta de ElevenLabs
   - Configuración del agente
   - Payload enviado

2. **Verifica:**
   - API key válida
   - Agente configurado correctamente
   - Variables definidas en el agente

3. **Documenta:**
   - Pasos para reproducir el problema
   - Comportamiento esperado vs actual
   - Configuración del entorno 