import { NextResponse } from 'next/server';

export async function GET() {
  const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY';
  const AGENT_ID = 'agent_01jyqdepnrf1x9wfrt9kkyy84t';

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=100`, {
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
    const conversations = data.conversations || [];

    // Estadísticas agregadas
    const total_calls = conversations.length;
    const total_minutes = Math.round(conversations.reduce((acc: number, c: any) => acc + (c.call_duration_secs || 0), 0) / 60);
    const exitosas = conversations.filter(c => c.call_successful === 'success').length;
    const fallidas = conversations.filter(c => c.call_successful === 'failure').length;
    const desconocidas = conversations.filter(c => c.call_successful === 'unknown').length;

    return NextResponse.json({
      total_calls,
      total_minutes,
      exitosas,
      fallidas,
      desconocidas,
      conversations, // puedes quitar esto si solo quieres los totales
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
} 