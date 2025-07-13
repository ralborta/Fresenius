import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { phoneNumber, agentId, agentPhoneNumberId, variables } = requestBody;

    console.log('=== TEST VARIABLES ENDPOINT ===');
    console.log('Request body completo:', JSON.stringify(requestBody, null, 2));
    
    console.log('Variables extraídas:', JSON.stringify(variables, null, 2));
    console.log('Tipo de variables:', typeof variables);
    console.log('Es objeto:', typeof variables === 'object');
    console.log('Es null:', variables === null);
    console.log('Es undefined:', variables === undefined);

    // Simular el procesamiento de variables dinámicas
    let dynamicVariablesNormalizadas: Record<string, unknown> = {};
    if (variables && typeof variables === 'object') {
      const permitidas = ['nombre_paciente', 'stock_teorico', 'fecha_envio', 'producto'];
      dynamicVariablesNormalizadas = Object.fromEntries(
        Object.entries(variables as Record<string, unknown>).filter(([k]) => permitidas.includes(k))
      );
    }

    console.log('Variables normalizadas:', JSON.stringify(dynamicVariablesNormalizadas, null, 2));
    console.log('Variables permitidas encontradas:', Object.keys(dynamicVariablesNormalizadas));

    // Simular el payload que se enviaría a ElevenLabs
    const simulatedPayload = {
      call_name: `Test Variables - ${new Date().toISOString()}`,
      agent_id: agentId,
      agent_phone_number_id: agentPhoneNumberId,
      scheduled_time_unix: Math.floor(Date.now() / 1000),
      recipients: [
        {
          phone_number: phoneNumber,
          dynamic_variables: dynamicVariablesNormalizadas
        }
      ]
    };

    console.log('Payload simulado:', JSON.stringify(simulatedPayload, null, 2));
    console.log('=== FIN TEST VARIABLES ===');

    return NextResponse.json({
      success: true,
      message: 'Test de variables completado',
      variables_recibidas: variables,
      variables_normalizadas: dynamicVariablesNormalizadas,
      payload_simulado: simulatedPayload,
      debug_info: {
        tipo_variables: typeof variables,
        es_objeto: typeof variables === 'object',
        es_null: variables === null,
        es_undefined: variables === undefined,
        cantidad_variables: variables ? Object.keys(variables).length : 0,
        cantidad_normalizadas: Object.keys(dynamicVariablesNormalizadas).length
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