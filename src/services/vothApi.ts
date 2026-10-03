/**
 * Servicio de Validación de User ID para Blood Strike vía VothAPI
 */

export interface ValidationResult {
  success: boolean;
  valid: boolean;
  nickname?: string;
  error?: string;
}

export async function validarIdGame(idIngresado: string): Promise<ValidationResult> {
  const cleanId = idIngresado.trim();
  if (!cleanId || cleanId.length < 5) {
    return {
      success: false,
      valid: false,
      error: 'ID Inválido. Debe tener al menos 5 dígitos numéricos.',
    };
  }

  // Token privado de VothAPI obtenido desde variables de entorno
  const apiToken = import.meta.env.VITE_VOTHAPI_TOKEN || 'TU_TOKEN_PRIVADO_DE_VOTHAPI';
  const rawBaseUrl = import.meta.env.VITE_VOTHAPI_URL || 'https://vothapi.site';
  const baseUrl = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  const requestUrl = `${baseUrl}/${cleanId}`;

  // Si el usuario aún no ha configurado su token privado real en .env,
  // ofrecemos una respuesta simulada para que la tienda y el flujo de compra no se bloqueen en desarrollo
  if (!apiToken || apiToken === 'TU_TOKEN_PRIVADO_DE_VOTHAPI') {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Validación básica: los IDs de Blood Strike válidos suelen tener entre 6 y 12 dígitos
    if (cleanId.length >= 5) {
      return {
        success: true,
        valid: true,
        nickname: `Striker_${cleanId.slice(-4)}`,
      };
    } else {
      return {
        success: false,
        valid: false,
        error: 'ID Inválido. Por favor verifica tus datos.',
      };
    }
  }

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        return {
          success: false,
          valid: false,
          error: 'ID Inválido. Por favor verifica tus datos.',
        };
      }
      return {
        success: false,
        valid: false,
        error: `Error temporal del servidor (${response.status}). Intenta de nuevo.`,
      };
    }

    const resultado = await response.json();

    if (resultado.success && resultado.data && resultado.data.valid) {
      // ÉXITO: El ID existe y te devuelve el nombre del personaje
      return {
        success: true,
        valid: true,
        nickname: resultado.data.nickname || `Striker_${cleanId.slice(-4)}`,
      };
    } else {
      // ERROR: El ID no se encuentra en los servidores de NetEase
      return {
        success: false,
        valid: false,
        error: resultado.message || 'ID Inválido. Por favor verifica tus datos.',
      };
    }
  } catch (error) {
    console.error('Error en la conexión de la API de validación:', error);
    return {
      success: false,
      valid: false,
      error: 'Error temporal del sistema. Intenta de nuevo.',
    };
  }
}
