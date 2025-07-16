import { NextRequest, NextResponse } from 'next/server';
import { sendBatchCall } from '@/lib/elevenlabs/batchCalling';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { phoneNumber, agentId, agentPhoneNumberId, variables } = requestBody;

    console.log('=== TEST VARIABLES ENDPOINT MEJORADO ===');
    console.log('Request body completo:', JSON.stringify(requestBody, null, 2));
    
    console.log('Variables extraídas:', JSON.stringify(variables, null, 2));
    console.log('Tipo de variables:', typeof variables);
    console.log('Es objeto:', typeof variables === 'object');
    console.log('Es null:', variables === null);
    console.log('Es undefined:', variables === undefined);

    // Procesamiento de variables dinámicas (igual que en test-call)
    const dynamicVariablesNormalizadas: Record<string, string | number | boolean> = {};
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

    console.log('Variables normalizadas:', JSON.stringify(dynamicVariablesNormalizadas, null, 2));
    console.log('Variables permitidas encontradas:', Object.keys(dynamicVariablesNormalizadas));

    // Crear el payload exacto que se enviaría a ElevenLabs
    const batchCallRequest = {
      call_name: `Test Variables Debug - ${new Date().toISOString()}`,
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000), // llamada inmediata
      recipients: [
        {
          phone_number: phoneNumber,
          dynamic_variables: dynamicVariablesNormalizadas
        }
      ]
    };

    console.log('Payload que se enviará a ElevenLabs:', JSON.stringify(batchCallRequest, null, 2));

    // HACER LA LLAMADA REAL A ELEVENLABS
    console.log('=== INICIANDO LLAMADA REAL A ELEVENLABS ===');
    let elevenLabsResponse = null;
    let elevenLabsError = null;
    
    try {
      elevenLabsResponse = await sendBatchCall(batchCallRequest);
      console.log('✅ Respuesta exitosa de ElevenLabs:', JSON.stringify(elevenLabsResponse, null, 2));
    } catch (error) {
      elevenLabsError = error;
      console.error('❌ Error de ElevenLabs:', error);
    }

    console.log('=== FIN TEST VARIABLES MEJORADO ===');

    return NextResponse.json({
      success: true,
      message: 'Test de variables completado',
      variables_recibidas: variables,
      variables_normalizadas: dynamicVariablesNormalizadas,
      payload_enviado: batchCallRequest,
      respuesta_elevenlabs: elevenLabsResponse,
      error_elevenlabs: elevenLabsError ? elevenLabsError.message : null,
      debug_info: {
        tipo_variables: typeof variables,
        es_objeto: typeof variables === 'object',
        es_null: variables === null,
        es_undefined: variables === undefined,
        cantidad_variables: variables ? Object.keys(variables).length : 0,
        cantidad_normalizadas: Object.keys(dynamicVariablesNormalizadas).length,
        batch_call_id: elevenLabsResponse?.id || null
      }
    });

  } catch (error) {
    console.error('Error en test de variables:', error);
    return NextResponse.json(
      { 
        error: 'Error en test de variables',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 