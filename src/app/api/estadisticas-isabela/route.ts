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

// Función para traducir texto usando LibreTranslate
async function traducirTexto(texto: string): Promise<string> {
  try {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: texto,
        source: "en",
        target: "es",
        format: "text"
      })
    });
    const data = await res.json();
    return data.translatedText || texto;
  } catch {
    return texto;
  }
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
          let nombre_paciente = data.conversation_initiation_client_data?.dynamic_variables?.nombre_paciente || null;
          if (nombre_paciente === 'Leonardo Viano') {
            nombre_paciente = 'Leonardo';
          }
          let resumen = data.analysis?.transcript_summary || null;
          if (resumen) {
            resumen = await traducirTexto(resumen);
          }
          return {
            ...conv,
            telefono_destino: data.metadata?.phone_call?.external_number || data.conversation_initiation_client_data?.dynamic_variables?.system__called_number || null,
            nombre_paciente,
            producto: data.conversation_initiation_client_data?.dynamic_variables?.producto || null,
            summary: resumen,
          };
        } catch {
          return conv;
        }
      })
    );

    // Ordenar por fecha de más reciente a más antigua
    detailedConversations.sort((a, b) => (b.start_time_unix_secs || 0) - (a.start_time_unix_secs || 0));
    // Tomar las primeras 35
    const last35Conversations = detailedConversations.slice(0, 35);
    const total_calls = last35Conversations.length;
    const total_minutes = Math.round(last35Conversations.reduce((acc: number, c: Conversation) => acc + (c.call_duration_secs || 0), 0) / 60);

    return NextResponse.json({
      total_calls,
      total_minutes,
      conversations: last35Conversations
    });
  } catch (error) {
    console.error('Error en estadísticas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 