/**
 * Servicio de Validación de User ID para Blood Strike
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
 * Función oficial para verificar ID de usuario en Blood Strike
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

  const isNumeric = /^\d+$/.test(cleanId);
  if (!cleanId || cleanId.length < 5 || !isNumeric) {
    const errorMsg = 'Ingresa un ID numérico válido (mínimo 5 dígitos)';
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

  const successMsg = 'ID verificado correctamente ✅';

  // Verificación instantánea directa para ID de Blood Strike (mínimo 5 dígitos numéricos)
  updateDomStatus('green', successMsg, true);
  return {
    success: true,
    valid: true,
    nickname: '',
    statusColor: 'green',
    statusMessage: successMsg,
  };
}

// Alias para compatibilidad con implementaciones previas
export const validarIdGame = verificarIdBloodStrike;

// Registrar globalmente en window para llamadas de scripts o pruebas externas
if (typeof window !== 'undefined') {
  (window as unknown as { verificarIdBloodStrike?: typeof verificarIdBloodStrike; validarIdGame?: typeof validarIdGame }).verificarIdBloodStrike = verificarIdBloodStrike;
  (window as unknown as { verificarIdBloodStrike?: typeof verificarIdBloodStrike; validarIdGame?: typeof validarIdGame }).validarIdGame = verificarIdBloodStrike;
}

