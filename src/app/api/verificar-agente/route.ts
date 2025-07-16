import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key de ElevenLabs no configurada' }, { status: 500 });
    }

    // Verificar el agente actual
    const agentId = 'agent_01jyqdepnrf1x9wfrt9kkyy84t';
    
    console.log('=== VERIFICANDO CONFIGURACIÓN DEL AGENTE ===');
    console.log('Agent ID:', agentId);
    
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${agentId}`, {
      headers: {
        'xi-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Error al obtener agente', 
        status: response.status,
        details: errorText 
      }, { status: response.status });
    }

    const agentData = await response.json();
    
    console.log('Configuración del agente:', JSON.stringify(agentData, null, 2));
    
    // Analizar si usa la sintaxis correcta
    const firstMessage = agentData.conversation_config?.first_message || '';
    const systemPrompt = agentData.conversation_config?.system_prompt || '';
    
    const usaSintaxisCorrecta = firstMessage.includes('{{') && firstMessage.includes('}}');
    const usaSintaxisIncorrecta = firstMessage.includes('{') && firstMessage.includes('}') && !firstMessage.includes('{{');
    
    console.log('First message:', firstMessage);
    console.log('Usa sintaxis correcta ({{}}):', usaSintaxisCorrecta);
    console.log('Usa sintaxis incorrecta ({}):', usaSintaxisIncorrecta);
    
    return NextResponse.json({
      success: true,
      agent_id: agentId,
      agent_name: agentData.conversation_config?.name,
      first_message: firstMessage,
      system_prompt: systemPrompt,
      analisis: {
        usa_sintaxis_correcta: usaSintaxisCorrecta,
        usa_sintaxis_incorrecta: usaSintaxisIncorrecta,
        necesita_actualizacion: usaSintaxisIncorrecta,
        recomendacion: usaSintaxisIncorrecta 
          ? 'El agente usa sintaxis incorrecta. Necesita actualización o crear uno nuevo.' 
          : 'El agente usa sintaxis correcta. Debería funcionar bien.'
      },
      configuracion_completa: agentData
    });

  } catch (error) {
    console.error('Error al verificar agente:', error);
    return NextResponse.json({ 
      error: 'Error interno al verificar agente', 
      details: error instanceof Error ? error.message : 'Error desconocido' 
    }, { status: 500 });
  }
} 