// Script de diagnóstico para variables dinámicas de ElevenLabs
// Ejecutar con: node diagnostico-variables.js

const API_KEY = process.env.ELEVENLABS_API_KEY || 'TU_API_KEY_AQUI';

async function diagnosticarVariables() {
  console.log('🔍 DIAGNÓSTICO DE VARIABLES DINÁMICAS - ELEVENLABS');
  console.log('==================================================\n');

  // Paso 1: Verificar API Key
  console.log('1️⃣ Verificando API Key...');
  if (!API_KEY || API_KEY === 'TU_API_KEY_AQUI') {
    console.log('❌ API Key no configurada o inválida');
    console.log('   Configura ELEVENLABS_API_KEY en tu .env');
    return;
  }
  console.log('✅ API Key configurada\n');

  // Paso 2: Verificar agente existente
  console.log('2️⃣ Verificando agente existente...');
  try {
    const agentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/agent_01jyqdepnrf1x9wfrt9kkyy84t', {
      headers: {
        'xi-api-key': API_KEY,
      },
    });
    
    if (agentResponse.ok) {
      const agentData = await agentResponse.json();
      console.log('✅ Agente encontrado:', agentData.conversation_config?.name);
      console.log('   First message:', agentData.conversation_config?.first_message);
      console.log('   System prompt:', agentData.conversation_config?.system_prompt?.substring(0, 100) + '...');
    } else {
      console.log('❌ Agente no encontrado o error:', agentResponse.status);
    }
  } catch (error) {
    console.log('❌ Error al verificar agente:', error.message);
  }
  console.log('');

  // Paso 3: Crear agente de prueba con variables dinámicas
  console.log('3️⃣ Creando agente de prueba con variables dinámicas...');
  try {
    const createAgentResponse = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        conversation_config: {
          name: 'AgenteTestVariables',
          first_message: 'Hola {nombre_paciente}, tu {producto} con stock {stock_teorico} se enviará el {fecha_envio}.',
          system_prompt: 'Usa las variables dinámicas: {nombre_paciente}, {producto}, {stock_teorico}, {fecha_envio}'
        }
      }),
    });
    
    const createAgentData = await createAgentResponse.json();
    if (createAgentResponse.ok) {
      console.log('✅ Agente de prueba creado:', createAgentData.agent_id);
      const TEST_AGENT_ID = createAgentData.agent_id;
      
      // Paso 4: Probar batch call con variables
      console.log('\n4️⃣ Probando batch call con variables dinámicas...');
      
      const batchCallPayload = {
        call_name: 'Test Variables Dinámicas',
        agent_id: TEST_AGENT_ID,
        agent_phone_number_id: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
        scheduled_time_unix: Math.floor(Date.now() / 1000) + 60, // 1 minuto en el futuro
        recipients: [
          {
            phone_number: '+5491123456789', // Número de prueba
            dynamic_variables: {
              nombre_paciente: 'Juan Pérez',
              producto: 'Medicamento X',
              stock_teorico: '150 unidades',
              fecha_envio: '15 de enero'
            }
          }
        ]
      };
      
      console.log('📤 Enviando payload:', JSON.stringify(batchCallPayload, null, 2));
      
      const batchCallResponse = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': API_KEY,
        },
        body: JSON.stringify(batchCallPayload),
      });
      
      const batchCallData = await batchCallResponse.json();
      console.log('📥 Respuesta de ElevenLabs:', JSON.stringify(batchCallData, null, 2));
      
      if (batchCallResponse.ok) {
        console.log('✅ Batch call creado exitosamente');
        console.log('   Batch Call ID:', batchCallData.id);
        
        // Paso 5: Verificar estado del batch call
        console.log('\n5️⃣ Verificando estado del batch call...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
        
        const statusResponse = await fetch(`https://api.elevenlabs.io/v1/convai/batch-calling/${batchCallData.id}`, {
          headers: {
            'xi-api-key': API_KEY,
          },
        });
        
        const statusData = await statusResponse.json();
        console.log('📊 Estado del batch call:', JSON.stringify(statusData, null, 2));
        
      } else {
        console.log('❌ Error al crear batch call:', batchCallData);
      }
      
    } else {
      console.log('❌ Error al crear agente de prueba:', createAgentData);
    }
  } catch (error) {
    console.log('❌ Error en prueba:', error.message);
  }
  
  console.log('\n🏁 Diagnóstico completado');
}

// Ejecutar diagnóstico
diagnosticarVariables().catch(console.error); 