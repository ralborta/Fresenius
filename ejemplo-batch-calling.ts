// Ejemplo de uso siguiendo las recomendaciones del proveedor
// Este archivo muestra cómo usar el API de batch calling

import { sendBatchCall } from '@/lib/elevenlabs/batchCalling';

// Ejemplo 1: Llamada simple con variables dinámicas
export async function ejemploLlamadaSimple() {
  try {
    const response = await sendBatchCall({
      call_name: 'Llamadas Test Julio',
      agent_id: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
      agent_phone_number_id: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
      scheduled_time_unix: null, // llamada inmediata
      recipients: [
        {
          phone_number: '+5491155555555',
          dynamic_variables: {
            nombre_paciente: 'Raúl',
            producto: 'Seguro del Auto',
            stock_teorico: '150 unidades',
            fecha_envio: '15 de enero'
          },
        },
        {
          phone_number: '+5491144444444',
          dynamic_variables: {
            nombre_paciente: 'María',
            producto: 'Cobertura Médica',
            stock_teorico: '200 unidades',
            fecha_envio: '20 de enero'
          },
        },
      ],
    });

    console.log('Batch call iniciado:', response.id);
    return response;
  } catch (error) {
    console.error('Error al iniciar batch call:', error);
    throw error;
  }
}

// Ejemplo 2: Llamada programada para el futuro
export async function ejemploLlamadaProgramada() {
  try {
    const futureTime = Math.floor(Date.now() / 1000) + 3600; // 1 hora en el futuro
    
    const response = await sendBatchCall({
      call_name: 'Llamadas Programadas',
      agent_id: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
      agent_phone_number_id: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
      scheduled_time_unix: futureTime,
      recipients: [
        {
          phone_number: '+5491133333333',
          dynamic_variables: {
            nombre_paciente: 'Carlos',
            producto: 'Seguro de Vida',
            stock_teorico: '100 unidades',
            fecha_envio: '25 de enero'
          },
        },
      ],
    });

    console.log('Batch call programado:', response.id);
    return response;
  } catch (error) {
    console.error('Error al programar batch call:', error);
    throw error;
  }
}

// Ejemplo 3: Llamada con múltiples destinatarios
export async function ejemploLlamadaMultiple() {
  try {
    const recipients = [
      {
        phone_number: '+5491111111111',
        dynamic_variables: {
          nombre_paciente: 'Ana',
          producto: 'Seguro Hogar',
          stock_teorico: '75 unidades',
          fecha_envio: '10 de enero'
        },
      },
      {
        phone_number: '+5491222222222',
        dynamic_variables: {
          nombre_paciente: 'Luis',
          producto: 'Seguro Empresarial',
          stock_teorico: '300 unidades',
          fecha_envio: '30 de enero'
        },
      },
      {
        phone_number: '+5491333333333',
        dynamic_variables: {
          nombre_paciente: 'Elena',
          producto: 'Seguro de Salud',
          stock_teorico: '120 unidades',
          fecha_envio: '5 de febrero'
        },
      },
    ];

    const response = await sendBatchCall({
      call_name: 'Campaña Masiva Enero',
      agent_id: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
      agent_phone_number_id: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
      scheduled_time_unix: null,
      recipients,
    });

    console.log('Campaña masiva iniciada:', response.id);
    return response;
  } catch (error) {
    console.error('Error en campaña masiva:', error);
    throw error;
  }
}

// Ejemplo 4: Uso desde un API route (como en las recomendaciones del proveedor)
export async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await sendBatchCall({
      call_name: 'Llamadas Test Julio',
      agent_id: 'agent_01jyqdepnrf1x9wfrt9kkyy84t',
      agent_phone_number_id: 'phnum_01jzmyvs1sf49rvgy1vcdrfnd3',
      scheduled_time_unix: null, // o Date.now() / 1000 para timestamp futuro
      recipients: [
        {
          phone_number: '+5491155555555',
          dynamic_variables: {
            nombre_paciente: 'Raúl',
            producto: 'Seguro del Auto',
            stock_teorico: '150 unidades',
            fecha_envio: '15 de enero'
          },
        },
        {
          phone_number: '+5491144444444',
          dynamic_variables: {
            nombre_paciente: 'María',
            producto: 'Cobertura Médica',
            stock_teorico: '200 unidades',
            fecha_envio: '20 de enero'
          },
        },
      ],
    });

    res.status(200).json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
} 