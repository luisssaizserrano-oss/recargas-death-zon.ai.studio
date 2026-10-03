/**
 * Servicio de Validación de User ID para Blood Strike vía VothAPI Oficial
 * Documentación oficial: https://vothapi.site/docs/checkid
 * Endpoint GET: /{game}/checkid?token={token}&user_id={id}
 */

export interface ValidationResult {
  success: boolean;
  valid: boolean;
  nickname?: string;
  error?: string;
  statusColor?: 'green' | 'red' | 'orange';
  statusMessage?: string;
}

/**
 * Función oficial para verificar ID de usuario en Blood Strike usando VothAPI
 * Actualiza el DOM directamente (#status-id y #btn-agregar-carrito) y devuelve el resultado tipado
 */
export async function verificarIdBloodStrike(idUsuario: string): Promise<ValidationResult> {
  const cleanId = (idUsuario || '').trim();

  // Helper para actualizar directamente el DOM (#status-id y #btn-agregar-carrito)
  const updateDomStatus = (color: 'green' | 'red' | 'orange', message: string, enableCart: boolean) => {
    if (typeof document !== 'undefined') {
      const statusEl = document.getElementById('status-id');
      if (statusEl) {
        statusEl.style.color = color;
        statusEl.innerText = message;
      }
      const btnCart = document.getElementById('btn-agregar-carrito') as HTMLButtonElement | null;
      if (btnCart) {
        btnCart.disabled = !enableCart;
      }
      // Actualizar todos los botones de añadir al carrito que tengan data-btn-agregar-carrito
      const allCartBtns = document.querySelectorAll<HTMLButtonElement>('[data-btn-agregar-carrito]');
      allCartBtns.forEach((btn) => {
        btn.disabled = !enableCart;
      });
    }
  };

  if (!cleanId || cleanId.length < 5) {
    const errorMsg = 'ID Inválido o Error de Token';
    const displayMsg = `❌ Error: ${errorMsg}`;
    updateDomStatus('red', displayMsg, false);
    return {
      success: false,
      valid: false,
      statusColor: 'red',
      statusMessage: displayMsg,
      error: errorMsg,
    };
  }

  // Tokens y configuración de proveedores (RapidAPI y VothAPI)
  const rapidApiKey =
    (typeof window !== 'undefined' && localStorage.getItem('deathzone_rapidapi_key')) ||
    import.meta.env.VITE_RAPIDAPI_KEY ||
    '';
  const rapidBaseUrl = (
    (typeof window !== 'undefined' && localStorage.getItem('deathzone_rapidapi_url')) ||
    import.meta.env.VITE_RAPIDAPI_URL ||
    'https://rapidapi.com'
  ).replace(/\/+$/, '');

  const miTokenVoth =
    (typeof window !== 'undefined' && localStorage.getItem('deathzone_vothapi_token')) ||
    import.meta.env.VITE_VOTHAPI_TOKEN ||
    'TU_TOKEN_REAL_DE_VOTHAPI';

  const rawBaseUrl = import.meta.env.VITE_VOTHAPI_URL || 'https://vothapi.site';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');

  try {
    // 1. INTENTO CON RAPIDAPI (Si hay API Key configurada)
    if (rapidApiKey && rapidApiKey !== 'TU_API_KEY_DE_RAPIDAPI') {
      let rapidHost = 'rapidapi.com';
      try {
        rapidHost = new URL(rapidBaseUrl).host || 'rapidapi.com';
      } catch {
        // fallback host
      }

      try {
        const respuestaRapid = await fetch(`${rapidBaseUrl}/bloodstrike?userId=${encodeURIComponent(cleanId)}`, {
          method: 'GET',
          headers: {
            'x-rapidapi-key': rapidApiKey,
            'x-rapidapi-host': rapidHost,
            'Accept': 'application/json',
          },
        });

        if (respuestaRapid.ok) {
          const resJson = await respuestaRapid.json();
          if (resJson && resJson.success) {
            const nick = resJson.username || resJson.ign || resJson.nickname;
            if (nick && String(nick).trim().toLowerCase() !== 'na') {
              const displayNick = String(nick).trim();
              const successMsg = 'ID verificado correctamente ✅';
              updateDomStatus('green', successMsg, true);
              return {
                success: true,
                valid: true,
                nickname: displayNick,
                statusColor: 'green',
                statusMessage: successMsg,
              };
            }
          }
        }
      } catch (rapidErr) {
        console.warn('Fallo en consulta RapidAPI, intentando VothAPI:', rapidErr);
      }
    }

    // 2. INTENTO CON VOTHAPI OFICIAL
    let urlEndpoint: string;
    if (miTokenVoth.startsWith('http://') || miTokenVoth.startsWith('https://')) {
      if (miTokenVoth.includes('{id}')) {
        urlEndpoint = miTokenVoth.replace('{id}', encodeURIComponent(cleanId));
      } else {
        const sep = miTokenVoth.includes('?') ? '&' : '?';
        urlEndpoint = `${miTokenVoth}${sep}user_id=${encodeURIComponent(cleanId)}`;
      }
    } else if (miTokenVoth.startsWith('/') || miTokenVoth.startsWith('?')) {
      urlEndpoint = `${baseUrl}${miTokenVoth}&user_id=${encodeURIComponent(cleanId)}`;
    } else if (miTokenVoth.includes('{id}')) {
      const path = miTokenVoth.startsWith('/') ? miTokenVoth : `/${miTokenVoth}`;
      urlEndpoint = `${baseUrl}${path.replace('{id}', encodeURIComponent(cleanId))}`;
    } else {
      urlEndpoint = `${baseUrl}/blood-strike/checkid?token=${encodeURIComponent(miTokenVoth)}&user_id=${encodeURIComponent(cleanId)}`;
    }

    const respuesta = await fetch(urlEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    // Si el servidor responde con un código de error (como códigos 400 o 401)
    if (!respuesta.ok || respuesta.status === 400 || respuesta.status === 401) {
      const errorMsg = 'ID Inválido o Error de Token';
      const displayMsg = `❌ Error: ${errorMsg}`;
      updateDomStatus('red', displayMsg, false);
      return {
        success: false,
        valid: false,
        statusColor: 'red',
        statusMessage: displayMsg,
        error: errorMsg,
      };
    }

    const resultado = await respuesta.json();

    // Estructura de respuesta de VothAPI y RapidAPI
    if (resultado && resultado.success === true) {
      const nicknameJuego =
        resultado.username ||
        resultado.ign ||
        resultado.nickname ||
        (resultado.data && (
          resultado.data.nickname ||
          resultado.data.username ||
          resultado.data.name ||
          resultado.data.player_name
        ));

      const esNombreValido =
        resultado.data?.valid !== false &&
        typeof nicknameJuego === 'string' &&
        nicknameJuego.trim().length > 0 &&
        nicknameJuego.toLowerCase() !== 'na';

      if (esNombreValido) {
        // ÉXITO: Muestra sólo "ID verificado correctamente ✅" y habilita el botón para añadir al carrito
        const displayNick = nicknameJuego.trim() || 'Jugador Encontrado';
        const successMsg = 'ID verificado correctamente ✅';
        updateDomStatus('green', successMsg, true);
        return {
          success: true,
          valid: true,
          nickname: displayNick,
          statusColor: 'green',
          statusMessage: successMsg,
        };
      } else {
        const errorMsg = 'ID Inválido o Error de Token';
        const displayMsg = `❌ Error: ${errorMsg}`;
        updateDomStatus('red', displayMsg, false);
        return {
          success: false,
          valid: false,
          statusColor: 'red',
          statusMessage: displayMsg,
          error: errorMsg,
        };
      }
    } else {
      const errorMsg = resultado?.message || 'ID Inválido o Error de Token';
      const displayMsg = `❌ Error: ${errorMsg}`;
      updateDomStatus('red', displayMsg, false);
      return {
        success: false,
        valid: false,
        statusColor: 'red',
        statusMessage: displayMsg,
        error: errorMsg,
      };
    }
  } catch (error) {
    console.error('Error de red o conexión con el validador:', error);
    const connErrorMsg = '⚠️ Error de conexión con el servidor. Verifica tus variables de entorno.';
    updateDomStatus('orange', connErrorMsg, false);
    return {
      success: false,
      valid: false,
      statusColor: 'orange',
      statusMessage: connErrorMsg,
      error: connErrorMsg,
    };
  }
}

// Alias para compatibilidad con implementaciones previas
export const validarIdGame = verificarIdBloodStrike;

// Registrar globalmente en window para llamadas de scripts o pruebas externas
if (typeof window !== 'undefined') {
  (window as unknown as { verificarIdBloodStrike?: typeof verificarIdBloodStrike; validarIdGame?: typeof validarIdGame }).verificarIdBloodStrike = verificarIdBloodStrike;
  (window as unknown as { verificarIdBloodStrike?: typeof verificarIdBloodStrike; validarIdGame?: typeof validarIdGame }).validarIdGame = verificarIdBloodStrike;
}

