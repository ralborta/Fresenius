import { NextResponse } from 'next/server';

export async function GET() {
  // Reemplaza 'YOUR_API_KEY' con tu API Key real de ElevenLabs
  const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY';
  const AGENT_ID = 'agent_01jyqdepnrf1x9wfrt9kkyy84t';

  try {
    // Endpoint de ElevenLabs para obtener estadísticas del agente
    const res = await fetch(`https://api.elevenlabs.io/v1/agents/${AGENT_ID}/stats`, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error al obtener estadísticas del agente' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
} 