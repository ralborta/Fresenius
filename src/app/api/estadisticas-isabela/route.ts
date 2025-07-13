import { NextResponse } from 'next/server';

// Ampliar el tipo Conversation para incluir los nuevos campos
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

    // Por cada conversación, obtener el detalle y extraer los datos requeridos
    const detailedConversations: Conversation[] = await Promise.all(
      allConversations.map(async (conv) => {
        try {
          const res = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${conv.conversation_id}`, {
            headers: {
              'xi-api-key': API_KEY,
              'Content-Type': 'application/json',
            },
          });
          if (!res.ok) return conv;
          const data = await res.json();
          // Extraer los datos de los campos correctos
          const telefono_destino = data.metadata?.phone_call?.external_number || data.conversation_initiation_client_data?.dynamic_variables?.system__called_number || null;
          const nombre_paciente = data.conversation_initiation_client_data?.dynamic_variables?.nombre_paciente || null;
          const producto = data.conversation_initiation_client_data?.dynamic_variables?.producto || null;
          return {
            ...conv,
            telefono_destino,
            nombre_paciente,
            producto,
          };
        } catch {
          return conv;
        }
      })
    );

    if (detailedConversations.length > 0) {
      // Log para ver la estructura real de los datos
      console.log('Ejemplo de conversación:', detailedConversations[0]);
    }

    // Estadísticas agregadas
    const total_calls = detailedConversations.length;
    const total_minutes = Math.round(detailedConversations.reduce((acc: number, c: Conversation) => acc + (c.call_duration_secs || 0), 0) / 60);
    const exitosas = detailedConversations.filter((c: Conversation) => c.call_successful === 'success').length;
    const fallidas = detailedConversations.filter((c: Conversation) => c.call_successful === 'failure').length;
    const desconocidas = detailedConversations.filter((c: Conversation) => c.call_successful === 'unknown').length;

    return NextResponse.json({
      total_calls,
      total_minutes,
      exitosas,
      fallidas,
      desconocidas,
      conversations: detailedConversations,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor', details: error }, { status: 500 });
  }
} 