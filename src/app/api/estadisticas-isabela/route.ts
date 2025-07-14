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
    const conversations: Conversation[] = data.conversations || [];

    // Calcular totales solo con las llamadas de la primera página
    const total_calls = conversations.length;
    const total_minutes = Math.round(conversations.reduce((sum, conv) => sum + (conv.call_duration_secs || 0), 0) / 60);
    
    const exitosas = conversations.filter(conv => conv.call_successful === 'success').length;
    const fallidas = conversations.filter(conv => conv.call_successful === 'failed').length;
    const desconocidas = conversations.filter(conv => conv.call_successful !== 'success' && conv.call_successful !== 'failed').length;

    return NextResponse.json({
      total_calls,
      total_minutes,
      exitosas,
      fallidas,
      desconocidas,
      conversations: conversations.map(conv => ({
        agent_id: conv.agent_id,
        agent_name: conv.agent_name,
        conversation_id: conv.conversation_id,
        start_time_unix_secs: conv.start_time_unix_secs,
        call_duration_secs: conv.call_duration_secs,
        message_count: conv.message_count,
        status: conv.status,
        call_successful: conv.call_successful,
        summary: conv.summary
      }))
    });

  } catch (error) {
    console.error('Error en estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 