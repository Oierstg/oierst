/**
 * UTILIDADES COMUNES Y SINTETIZADOR DE AUDIO GLACIAR
 * Oier Santo Tomás Gamayo - Portafolio Interactivo
 * Módulo puro, sin dependencias externas y sin variables globales desordenadas.
 */

/**
 * Generador de Audio Cristalino Sintetizado mediante Web Audio API
 * Emula la retroalimentación auditiva táctil y glaciar (estilo Igloo Inc)
 */
export class AudioGlaciar {
  constructor() {
    this.activo = false;
    this.contextoAudio = null;
    try {
      if (typeof localStorage !== 'undefined') {
        this.activo = localStorage.getItem('audio_hud_activo') === 'true';
      }
    } catch {
      // Ignorar bloqueos de almacenamiento local
    }
  }

  /**
   * Inicializa o reanuda el contexto de audio del navegador
   */
  iniciarContexto() {
    if (!this.contextoAudio && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.contextoAudio = new AudioCtx();
      }
    }
    if (this.contextoAudio && this.contextoAudio.state === 'suspended') {
      this.contextoAudio.resume();
    }
  }

  /**
   * Alterna el estado activado/desactivado del sistema de audio
   * @returns {boolean} Nuevo estado
   */
  alternar() {
    this.iniciarContexto();
    this.activo = !this.activo;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('audio_hud_activo', this.activo ? 'true' : 'false');
      }
    } catch {
      // Ignorar bloqueos de almacenamiento local
    }

    if (this.activo && this.contextoAudio) {
      // Armónico sutil de activación
      try {
        const ctx = this.contextoAudio;
        const ahora = ctx.currentTime;
        const osc = ctx.createOscillator();
        const ganancia = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, ahora);
        osc.frequency.exponentialRampToValueAtTime(1056, ahora + 0.18);

        ganancia.gain.setValueAtTime(0.03, ahora);
        ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.22);

        osc.connect(ganancia);
        ganancia.connect(ctx.destination);

        osc.start(ahora);
        osc.stop(ahora + 0.24);
      } catch {
        // Silencioso en caso de restricciones de política de audio
      }
    }

    return this.activo;
  }

  /**
   * Reproduce un 'tick' de alta frecuencia al pasar el cursor (hover)
   */
  reproducirTick() {
    if (!this.activo || !this.contextoAudio) return;
    try {
      const ctx = this.contextoAudio;
      const ahora = ctx.currentTime;
      const osc = ctx.createOscillator();
      const ganancia = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, ahora);
      osc.frequency.exponentialRampToValueAtTime(1920, ahora + 0.045);

      ganancia.gain.setValueAtTime(0.012, ahora);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.05);

      osc.connect(ganancia);
      ganancia.connect(ctx.destination);

      osc.start(ahora);
      osc.stop(ahora + 0.055);
    } catch {
      // Ignorar
    }
  }

  /**
   * Reproduce una campana cristalina triangular al interactuar (click)
   */
  reproducirCampana() {
    if (!this.activo || !this.contextoAudio) return;
    try {
      const ctx = this.contextoAudio;
      const ahora = ctx.currentTime;
      const osc = ctx.createOscillator();
      const ganancia = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(740, ahora);
      osc.frequency.exponentialRampToValueAtTime(1110, ahora + 0.12);

      ganancia.gain.setValueAtTime(0.025, ahora);
      ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.14);

      osc.connect(ganancia);
      ganancia.connect(ctx.destination);

      osc.start(ahora);
      osc.stop(ahora + 0.15);
    } catch {
      // Ignorar
    }
  }
}

/**
 * Copia un texto al portapapeles de forma asíncrona y segura
 * @param {string} texto
 * @returns {Promise<boolean>}
 */
export async function copiarAlPortapapeles(texto) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
    // Mecanismo de respaldo seguro
    const areaTexto = document.createElement('textarea');
    areaTexto.value = texto;
    areaTexto.setAttribute('readonly', '');
    areaTexto.style.position = 'fixed';
    areaTexto.style.left = '-9999px';
    document.body.appendChild(areaTexto);
    areaTexto.select();
    const exito = document.execCommand('copy');
    document.body.removeChild(areaTexto);
    return exito;
  } catch {
    return false;
  }
}

/**
 * Limita la frecuencia de ejecución de una función (Throttle)
 * @param {Function} funcion
 * @param {number} limiteMs
 * @returns {Function}
 */
export function limitarFrecuencia(funcion, limiteMs) {
  let esperando = false;
  return function (...argumentos) {
    if (!esperando) {
      funcion.apply(this, argumentos);
      esperando = true;
      setTimeout(() => {
        esperando = false;
      }, limiteMs);
    }
  };
}

/**
 * Realiza un scroll suave hacia el identificador especificado
 * @param {string} idElemento
 */
export function desplazarSuavementeA(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Emite un anuncio de texto a tecnologías de asistencia (WCAG 2.1 AA)
 * @param {string} mensaje
 */
export function anunciarAccesible(mensaje) {
  const anunciador = document.getElementById('anunciador-accesible');
  if (anunciador) {
    anunciador.textContent = '';
    setTimeout(() => {
      anunciador.textContent = mensaje;
    }, 50);
  }
}
