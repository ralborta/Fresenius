import { NextResponse } from 'next/server';

interface Conversation {
  agent_id?: string;
  agent_name?: string;
  conversation_id?: string;
  start_time_unix_secs?: number;
  call_duration_secs?: number;
  message_count?: number;
  status?: string;
  call_successful?: string;
  summary?: string;
  telefono_destino?: string;
  nombre_paciente?: string;
  producto?: string;
}

export async function GET() {
  const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY';
  const AGENT_ID = 'agent_01jyqdepnrf1x9wfrt9kkyy84t';

  try {
    // Solo traer la primera página para el conteo rápido (máximo 100 llamadas)
    const url = `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=100`;
    const res = await fetch(url, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Error al obtener conversaciones', status: res.status, body: text }, { status: res.status });
    }
    const data = await res.json();
    const conversations: Conversation[] = (data.conversations || []).map((conv: unknown) => {
      const c = conv as Record<string, any>;
      let nombre_paciente = c.conversation_initiation_client_data?.dynamic_variables?.nombre_paciente || null;
      if (nombre_paciente === 'Leonardo Viano') {
        nombre_paciente = 'Leonardo';
      }
      return {
        ...c,
        telefono_destino: c.metadata?.phone_call?.external_number || c.conversation_initiation_client_data?.dynamic_variables?.system__called_number || null,
        nombre_paciente,
        producto: c.conversation_initiation_client_data?.dynamic_variables?.producto || null,
      };
    });
    const total_calls = conversations.length;
    const total_minutes = Math.round(conversations.reduce((sum, conv) => sum + (conv.call_duration_secs || 0), 0) / 60);
    return NextResponse.json({
      total_calls,
      total_minutes,
      conversations,
      aviso: 'Mostrando solo las últimas 100 llamadas por velocidad.'
    });
  } catch (error) {
    console.error('Error en estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 