import { NextRequest, NextResponse } from 'next/server';
import { sendBatchCall, getBatchCallStatus } from '@/lib/elevenlabs/batchCalling';

// Función para validar formato de teléfono
function isValidPhoneNumber(phone: string): boolean {
  // Validar formato internacional: +[código país][código área][número]
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// Función para sanitizar logs (remover datos sensibles)
function sanitizePayloadForLogs(payload: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...payload };
  if (sanitized.recipients && Array.isArray(sanitized.recipients)) {
    sanitized.recipients = sanitized.recipients.map((recipient) => {
      const rec = recipient as Record<string, unknown>;
      return {
        ...rec,
        phone_number: typeof rec.phone_number === 'string' ? `${rec.phone_number.slice(0, 4)}***` : '***'
      };
    });
  }
  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, agentId, agentPhoneNumberId, variables } = await request.json();

    // Validaciones
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Número de teléfono requerido' },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Formato de número de teléfono inválido. Use formato internacional: +[código país][código área][número]' },
        { status: 400 }
      );
    }

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID requerido' },
        { status: 400 }
      );
    }

    if (!agentPhoneNumberId) {
      return NextResponse.json(
        { error: 'Agent Phone Number ID requerido' },
        { status: 400 }
      );
    }

    // Obtener la API key de las variables de entorno
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de ElevenLabs no configurada' },
        { status: 500 }
      );
    }

    // Log temporal para debug de variable de entorno
    console.log('DEBUG ELEVENLABS_API_KEY:', apiKey ? 'PRESENTE' : 'VACÍA');

    // --- Variables dinámicas para batch calling ---
    let dynamicVariablesNormalizadas: Record<string, string | number | boolean> = {};
    if (variables && typeof variables === 'object') {
      const permitidas = ['nombre_paciente', 'stock_teorico', 'fecha_envio', 'producto'];
      for (const [k, v] of Object.entries(variables)) {
        if (permitidas.includes(k)) {
          if (k === 'stock_teorico') {
            // Forzar a número
            dynamicVariablesNormalizadas[k] = Number(v);
          } else {
            // Forzar a string
            dynamicVariablesNormalizadas[k] = v !== undefined && v !== null ? String(v) : '';
          }
        }
      }
    }
    
    // Log detallado de las variables antes de enviar
    console.log('=== DEBUG VARIABLES DINÁMICAS ===');
    console.log('Variables recibidas del frontend:', JSON.stringify(variables, null, 2));
    console.log('Variables permitidas:', ['nombre_paciente', 'stock_teorico', 'fecha_envio', 'producto']);
    console.log('Variables normalizadas:', JSON.stringify(dynamicVariablesNormalizadas, null, 2));
    console.log('Cantidad de variables normalizadas:', Object.keys(dynamicVariablesNormalizadas).length);
    console.log('=== FIN DEBUG VARIABLES ===');
    
    // Payload para la API de ElevenLabs (siguiendo las recomendaciones del proveedor y soporte)
    const recipient = {
      phone_number: phoneNumber,
      ...dynamicVariablesNormalizadas
    };
    const batchCallRequest = {
      call_name: `Test Call - ${new Date().toISOString()}`,
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000), // llamada inmediata
      recipients: [recipient]
    };

    // Log del payload completo (sin sanitizar) para debugging
    console.log('=== PAYLOAD COMPLETO ENVIADO A ELEVENLABS ===');
    console.log(JSON.stringify(batchCallRequest, null, 2));
    console.log('=== FIN PAYLOAD ===');

    // Log del payload sanitizado antes de enviar
    console.log('Iniciando llamada de prueba con payload:', JSON.stringify(sanitizePayloadForLogs(batchCallRequest), null, 2));

    // Usar la función separada siguiendo las recomendaciones del proveedor
    const response = await sendBatchCall(batchCallRequest);

    console.log('Respuesta exitosa de ElevenLabs:', response);

    // Retornar la respuesta con el batch_call_id
    return NextResponse.json({
      success: true,
      batch_call_id: response.id,
      message: 'Llamada de prueba iniciada exitosamente',
      timestamp: new Date().toISOString(),
      ...response
    });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    
    // Manejar errores específicos de la función sendBatchCall
    if (error instanceof Error) {
      if (error.message.includes('Timeout')) {
        return NextResponse.json(
          { 
            error: 'Timeout al conectar con ElevenLabs',
            details: error.message
          },
          { status: 408 }
        );
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Error de configuración',
            details: error.message
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Endpoint para verificar el estado de una llamada
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const batchCallId = searchParams.get('batch_call_id');

    if (!batchCallId) {
      return NextResponse.json(
        { error: 'Batch Call ID requerido' },
        { status: 400 }
      );
    }

    // Usar la función separada siguiendo las recomendaciones del proveedor
    const response = await getBatchCallStatus(batchCallId);

    console.log('Estado de la llamada:', response);

    return NextResponse.json({
      success: true,
      batch_call_id: batchCallId,
      conversation_id: response.conversation_id,
      timestamp: new Date().toISOString(),
      ...response
    });

  } catch (error) {
    console.error('Error al consultar estado:', error);
    
    // Manejar errores específicos de la función getBatchCallStatus
    if (error instanceof Error) {
      if (error.message.includes('Timeout')) {
        return NextResponse.json(
          { 
            error: 'Timeout al consultar estado de la llamada',
            details: error.message
          },
          { status: 408 }
        );
      }
      
      if (error.message.includes('no encontrado')) {
        return NextResponse.json(
          { 
            error: 'Batch call no encontrado',
            details: error.message
          },
          { status: 404 }
        );
      }
      
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Error de configuración',
            details: error.message
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 

export async function PUT() {
  // Endpoint temporal para crear un agente mínimo de prueba en ElevenLabs
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key de ElevenLabs no configurada' }, { status: 500 });
    }
    const agentConfig = {
      conversation_config: {
        name: 'AgentePruebaMinimo',
        first_message: 'Hola {nombre_paciente}',
        system_prompt: 'Agente de prueba para test de variables dinámicas.'
      }
    };
    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(agentConfig),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: 'Error al crear agente', details: data }, { status: response.status });
    }
    return NextResponse.json({ success: true, agent_id: data.agent_id, details: data });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno al crear agente', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 