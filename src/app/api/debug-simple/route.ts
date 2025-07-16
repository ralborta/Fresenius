import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    console.log('=== DEBUG SIMPLE - REQUEST BODY ===');
    console.log(JSON.stringify(requestBody, null, 2));
    
    const { phoneNumber, agentId, agentPhoneNumberId, variables } = requestBody;
    
    console.log('=== VARIABLES EXTRAÍDAS ===');
    console.log('Variables:', variables);
    console.log('Tipo:', typeof variables);
    console.log('Es objeto:', typeof variables === 'object');
    console.log('Claves:', variables ? Object.keys(variables) : 'null');
    
    // Crear payload mínimo para ElevenLabs
    const payload = {
      call_name: 'Debug Simple Test',
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000) + 60, // 1 minuto en el futuro
      recipients: [
        {
          phone_number: phoneNumber,
          dynamic_variables: variables || {}
        }
      ]
    };
    
    console.log('=== PAYLOAD A ELEVENLABS ===');
    console.log(JSON.stringify(payload, null, 2));
    
    // Hacer la llamada a ElevenLabs
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('API key no configurada');
    }
    
    console.log('=== LLAMANDO A ELEVENLABS ===');
    const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });
    
    const responseData = await response.json();
    console.log('=== RESPUESTA DE ELEVENLABS ===');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(responseData, null, 2));
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      request_body: requestBody,
      payload_sent: payload,
      elevenlabs_response: responseData,
      debug_info: {
        variables_received: variables,
        variables_type: typeof variables,
        variables_keys: variables ? Object.keys(variables) : [],
        api_key_present: !!apiKey
      }
    });
    
  } catch (error) {
    console.error('=== ERROR EN DEBUG SIMPLE ===');
    console.error(error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 