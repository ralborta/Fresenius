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

    // --- Normalización de variables ---
    let variablesNormalizadas = variables;
    if (variables && typeof variables === 'object') {
      variablesNormalizadas = { ...variables };
      if ('stock_previsto' in variablesNormalizadas) {
        variablesNormalizadas['stock_teorico'] = variablesNormalizadas['stock_previsto'];
        delete variablesNormalizadas['stock_previsto'];
      }
    }
    // Payload para la API de ElevenLabs
    const payload = {
      call_name: `Test Call - ${new Date().toISOString()}`,
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      recipients: [
        {
          phone_number: phoneNumber,
          ...(variablesNormalizadas ? { variables: variablesNormalizadas } : {})
        }
      ],
      scheduled_time_unix: Math.floor(Date.now() / 1000) // llamada inmediata
    };

    console.log('Iniciando llamada de prueba con payload:', payload);

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
    console.log('Respuesta cruda de ElevenLabs:', responseText);

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