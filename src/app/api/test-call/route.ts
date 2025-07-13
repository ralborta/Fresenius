import { NextRequest, NextResponse } from 'next/server';

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

    // --- Prueba mínima: solo nombre_paciente ---
    let variablesNormalizadas = {};
    if (variables && typeof variables === 'object' && variables.nombre_paciente) {
      variablesNormalizadas = { nombre_paciente: variables.nombre_paciente };
    } else {
      variablesNormalizadas = { nombre_paciente: '' };
    }
    // Log detallado de las variables antes de enviar
    console.log('Variables enviadas a ElevenLabs:', JSON.stringify(variablesNormalizadas, null, 2));
    // Payload para la API de ElevenLabs
    const payload = {
      call_name: `Test Call - ${new Date().toISOString()}`,
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      recipients: [
        {
          phone_number: phoneNumber,
          variables: variablesNormalizadas
        }
      ],
      scheduled_time_unix: Math.floor(Date.now() / 1000) // llamada inmediata
    };
    // Log del payload completo antes de enviar
    console.log('Iniciando llamada de prueba con payload:', JSON.stringify(payload, null, 2));

    // Validar que no haya espacios en los nombres de las claves del payload
    Object.keys(payload).forEach(key => {
      if (/\s/.test(key)) {
        throw new Error(`El nombre de la clave '${key}' en el payload contiene espacios. Corrígelo antes de enviar a ElevenLabs.`);
      }
    });

    console.log('Iniciando llamada de prueba con payload:', JSON.stringify(payload, null, 2));

    // Llamada a la API de ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    // Log de la respuesta completa
    const responseText = await response.text();
    try {
      const responseJson = JSON.parse(responseText);
      console.log('Respuesta cruda de ElevenLabs:', JSON.stringify(responseJson, null, 2));
    } catch {
      console.log('Respuesta cruda de ElevenLabs:', responseText);
    }

    if (!response.ok) {
      console.error('Error en la API de ElevenLabs:', response.status, responseText);
      let errorJson = {};
      try { errorJson = JSON.parse(responseText); } catch {}
      return NextResponse.json(
        {
          error: 'Error al iniciar la llamada de prueba',
          details: errorJson,
          status: response.status,
          payload_enviado: payload
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Respuesta exitosa de ElevenLabs:', data);

    // Retornar la respuesta con el batch_call_id
    return NextResponse.json({
      success: true,
      batch_call_id: data.id, // mapeo correcto
      status: 'initiated',
      message: 'Llamada de prueba iniciada exitosamente',
      timestamp: new Date().toISOString(),
      ...data
    });

  } catch (error) {
    console.error('Error interno del servidor:', error);
    
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

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key de ElevenLabs no configurada' },
        { status: 500 }
      );
    }

    // Consultar el estado de la llamada
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/batch-calling/${batchCallId}`, {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Error al consultar estado:', response.status, errorData);
      
      return NextResponse.json(
        { 
          error: 'Error al consultar el estado de la llamada',
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Estado de la llamada:', data);

    return NextResponse.json({
      success: true,
      batch_call_id: batchCallId,
      status: data.status,
      conversation_id: data.conversation_id,
      ...data
    });

  } catch (error) {
    console.error('Error al consultar estado:', error);
    
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