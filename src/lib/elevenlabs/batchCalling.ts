interface BatchCallRecipient {
  phone_number: string;
  dynamic_variables?: Record<string, string | number | boolean>;
}

interface BatchCallRequest {
  call_name: string;
  agent_id: string;
  agent_phone_number_id: string;
  scheduled_time_unix?: number | null;
  recipients: BatchCallRecipient[];
}

// Cambiar el tipo de BatchCallResponse para no usar 'any'
interface BatchCallResponse {
  id: string;
  status: string;
  [key: string]: unknown;
}

export async function sendBatchCall(request: BatchCallRequest): Promise<BatchCallResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('API key de ElevenLabs no configurada');
  }

  // Validar que no haya espacios en los nombres de las claves
  const validatePayload = (obj: Record<string, unknown>, path: string = '') => {
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      if (/\s/.test(key)) {
        throw new Error(`El nombre de la clave '${currentPath}' contiene espacios. Corrígelo antes de enviar a ElevenLabs.`);
      }
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        validatePayload(obj[key] as Record<string, unknown>, currentPath);
      }
    });
  };

  validatePayload(request as unknown as Record<string, unknown>);

  // Configurar timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/convai/batch-calling/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson: Record<string, unknown> = {};
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        // Si no es JSON, usar el texto como error
      }

      throw new Error(`Error en ElevenLabs API: ${response.status} - ${JSON.stringify(errorJson)}`);
    }

    const data = await response.json();
    
    if (!data || !data.id) {
      throw new Error('Respuesta inválida de ElevenLabs: falta ID de batch call');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al conectar con ElevenLabs (30s)');
      }
      throw error;
    }
    
    throw new Error('Error desconocido al enviar batch call');
  }
}

export async function getBatchCallStatus(batchCallId: string): Promise<BatchCallResponse> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('API key de ElevenLabs no configurada');
  }

  // Validar formato del batch call ID
  if (!/^[a-zA-Z0-9_-]+$/.test(batchCallId)) {
    throw new Error('Formato de Batch Call ID inválido');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/batch-calling/${batchCallId}`, {
      headers: {
        'xi-api-key': apiKey,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Batch call no encontrado: ${batchCallId}`);
      }
      
      const errorText = await response.text();
      throw new Error(`Error al consultar estado: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data || typeof data.status === 'undefined') {
      throw new Error('Respuesta inválida de ElevenLabs: falta información de estado');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout al consultar estado de la llamada (15s)');
      }
      throw error;
    }
    
    throw new Error('Error desconocido al consultar estado');
  }
} 