# API de Batch Calling - ElevenLabs

## Descripción General

Este API permite realizar llamadas de prueba usando el servicio de batch calling de ElevenLabs. Incluye funcionalidades para iniciar llamadas, verificar su estado y crear agentes de prueba.

## Endpoints

### POST `/api/test-call`
Inicia una llamada de prueba usando el batch calling de ElevenLabs.

#### Parámetros de Entrada
```json
{
  "phoneNumber": "+5491123456789",
  "agentId": "agent_01jyqdepnrf1x9wfrt9kkyy84t",
  "agentPhoneNumberId": "phnum_01jzmyvs1sf49rvgy1vcdrfnd3",
  "variables": {
    "nombre_paciente": "Juan Pérez",
    "stock_teorico": "150 unidades",
    "fecha_envio": "15 de enero",
    "producto": "Medicamento X"
  }
}
```

#### Validaciones
- **phoneNumber**: Formato internacional requerido (+[código país][código área][número])
- **agentId**: ID del agente de ElevenLabs (requerido)
- **agentPhoneNumberId**: ID del número de teléfono del agente (requerido)
- **variables**: Objeto opcional con variables dinámicas permitidas

#### Variables Dinámicas Permitidas
- `nombre_paciente`
- `stock_teorico`
- `fecha_envio`
- `producto`

#### Respuesta Exitosa
```json
{
  "success": true,
  "batch_call_id": "batch_123456789",
  "status": "initiated",
  "message": "Llamada de prueba iniciada exitosamente",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Códigos de Error
- `400`: Parámetros inválidos o faltantes
- `408`: Timeout en la conexión con ElevenLabs
- `500`: Error interno del servidor
- Otros códigos HTTP según la respuesta de ElevenLabs

### GET `/api/test-call?batch_call_id={id}`
Verifica el estado de una llamada de prueba.

#### Parámetros de Consulta
- `batch_call_id`: ID de la llamada de batch (requerido)

#### Respuesta Exitosa
```json
{
  "success": true,
  "batch_call_id": "batch_123456789",
  "status": "completed",
  "conversation_id": "conv_123456789",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Códigos de Error
- `400`: Batch Call ID inválido o faltante
- `404`: Batch call no encontrado
- `408`: Timeout en la consulta
- `500`: Error interno del servidor

### PUT `/api/test-call`
Crea un agente de prueba mínimo en ElevenLabs.

#### Respuesta Exitosa
```json
{
  "success": true,
  "agent_id": "agent_nuevo_id",
  "details": {
    "agent_id": "agent_nuevo_id",
    "name": "AgentePruebaMinimo"
  }
}
```

## Características de Seguridad

### Sanitización de Logs
- Los números de teléfono se ocultan parcialmente en los logs (ej: `+549***`)
- Los payloads sensibles se sanitizan antes de ser registrados

### Timeouts
- **POST**: 30 segundos para iniciar llamadas
- **GET**: 15 segundos para consultar estado

### Validaciones
- Formato de teléfono internacional
- Estructura de respuesta de ElevenLabs
- Variables dinámicas permitidas
- Formato de Batch Call ID

## Variables de Entorno Requeridas

```env
ELEVENLABS_API_KEY=tu_api_key_de_elevenlabs
```

## Ejemplo de Uso Completo

### 1. Iniciar una llamada
```javascript
const response = await fetch('/api/test-call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phoneNumber: '+5491123456789',
    agentId: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
    agentPhoneNumberId: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
    variables: {
      nombre_paciente: 'María González',
      stock_teorico: '200 unidades',
      fecha_envio: '20 de enero',
      producto: 'Medicamento Y'
    }
  })
});

const data = await response.json();
console.log('Batch Call ID:', data.batch_call_id);
```

### 2. Verificar estado
```javascript
const statusResponse = await fetch(`/api/test-call?batch_call_id=${data.batch_call_id}`);
const statusData = await statusResponse.json();
console.log('Estado:', statusData.status);
```

## Estados de Llamada

- `initiated`: Llamada iniciada
- `in_progress`: Llamada en progreso
- `completed`: Llamada completada exitosamente
- `failed`: Llamada fallida
- `cancelled`: Llamada cancelada

## Manejo de Errores

El API incluye manejo robusto de errores con:
- Validación de entrada
- Timeouts para conexiones externas
- Sanitización de datos sensibles
- Logs detallados para debugging
- Códigos de estado HTTP apropiados

## Notas de Implementación

- Las llamadas se programan para ejecutarse inmediatamente (`scheduled_time_unix`)
- Solo se permiten variables dinámicas específicas para evitar inyección
- Los logs incluyen información de debugging sin exponer datos sensibles
- Se valida la estructura de respuesta de ElevenLabs antes de procesarla 