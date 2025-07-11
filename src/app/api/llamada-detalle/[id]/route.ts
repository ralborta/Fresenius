import { NextResponse } from 'next/server';

export async function GET(request: Request, context: any) {
  const conversationId = context.params.id;

  const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY';

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`, {
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Error al obtener detalle de la conversación', status: res.status, body: text }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
} 