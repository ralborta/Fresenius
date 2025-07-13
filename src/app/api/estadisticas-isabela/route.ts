import { NextResponse } from 'next/server';

type Conversation = {
  call_duration_secs?: number;
  call_successful?: string;
  // agrega aquí otros campos si los necesitas
};

export async function GET() {
  const API_KEY = process.env.ELEVENLABS_API_KEY || 'YOUR_API_KEY';
  const AGENT_ID = 'agent_01jyqdepnrf1x9wfrt9kkyy84t';

  try {
    let allConversations: Conversation[] = [];
    let hasMore = true;
    let nextPageToken: string | null = null;
    const PAGE_SIZE = 100;

    while (hasMore) {
      let url = `https://api.elevenlabs.io/v1/convai/conversations?agent_id=${AGENT_ID}&page_size=${PAGE_SIZE}`;
      if (nextPageToken) {
        url += `&page_token=${nextPageToken}`;
      }
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
      const conversations = data.conversations || [];
      allConversations = allConversations.concat(conversations);
      // Verificar si hay más páginas
      if (data.next_page_token) {
        nextPageToken = data.next_page_token;
        hasMore = true;
      } else {
        hasMore = false;
      }
    }

    if (allConversations.length > 0) {
      // Log para ver la estructura real de los datos
      console.log('Ejemplo de conversación:', allConversations[0]);
    }

    // Estadísticas agregadas
    const total_calls = allConversations.length;
    const total_minutes = Math.round(allConversations.reduce((acc: number, c: Conversation) => acc + (c.call_duration_secs || 0), 0) / 60);
    const exitosas = allConversations.filter((c: Conversation) => c.call_successful === 'success').length;
    const fallidas = allConversations.filter((c: Conversation) => c.call_successful === 'failure').length;
    const desconocidas = allConversations.filter((c: Conversation) => c.call_successful === 'unknown').length;

    return NextResponse.json({
      total_calls,
      total_minutes,
      exitosas,
      fallidas,
      desconocidas,
      conversations: allConversations, // puedes quitar esto si solo quieres los totales
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
} 