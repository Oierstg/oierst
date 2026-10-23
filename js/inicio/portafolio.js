/**
 * LÓGICA DE CONTROL DE LA VISTA PRINCIPAL (PORTAFOLIO)
 * Oier Santo Tomás Gamayo - Portafolio Profesional
 * Código Modular ES6+, Manipulación Segura del DOM y Cero innerHTML Inseguro
 * Optimizado para Rendimiento Extremo, Accesibilidad (WCAG 2.1 AA) y Navegación Móvil
 */

import {
  AudioGlaciar,
  copiarAlPortapapeles,
  limitarFrecuencia,
  desplazarSuavementeA,
  anunciarAccesible,
} from '../comun/utilidades.js';

// Inicialización Segura del Sistema de Audio con Memoria Local
const audio = new AudioGlaciar();

// Estado Global de la Vista
const estado = {
  modoRender: 'crystal',
  progresoScroll: 0,
  reveladoManifiesto: 1, // 100% legible por defecto (alta legibilidad empresarial)
  anulacionManualManifiesto: false,
  filtroTrayectoria: 'TODOS',
  nodoTecnologicoActivo: 'Python // Automatización, Scripts & IA',
  telemetriaHomelab: {
    cpu: 24,
    vram: 6.4,
    ping: 12,
  },
};

// ============================================================================
// 1. GESTOR DE ESCENA 3D THREE.JS (ESCULTURA GEOMÉTRICA ARQUITECTÓNICA)
// ============================================================================
class GestorEscena3D {
  constructor(contenedorId) {
    this.contenedor = document.getElementById(contenedorId);
    if (!this.contenedor || typeof window.THREE === 'undefined') {
      return;
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rootGroup = null;
    this.outerCrystalMesh = null;
    this.outerMat = null;
    this.wireMat = null;
    this.innerMat = null;
    this.seedMat = null;
    this.innerCoreMesh = null;
    this.seedMesh = null;
    this.orbitalRing1 = null;
    this.orbitalRing2 = null;
    this.particleSystem = null;
    this.cursorLight = null;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.prevDrag = { x: 0, y: 0 };
    this.dragVelocity = { x: 0, y: 0 };
    this.clock = new window.THREE.Clock();
    this.frameId = null;
    this.ultimoEnvioTelemetria = 0;

    // Control de Rendimiento y Accesibilidad
    this.estaVisible = true;
    this.observadorVisibilidad = null;
    this.movimientoReducido = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.iniciar();
  }

  iniciar() {
    const THREE = window.THREE;
    const cont = this.contenedor;

    // Escena, Cámara y Renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(40, cont.clientWidth / cont.clientHeight, 0.1, 100);
    this.camera.position.set(0, 0, 6.8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(cont.clientWidth, cont.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    cont.appendChild(this.renderer.domElement);

    // Grupo Raíz
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // 1. Cúpula Exterior Facetada (Icosaedro Grafito/Pizarra Mate)
    const outerGeo = new THREE.IcosahedronGeometry(1.72, 1);
    this.outerMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#111622'),
      emissive: new THREE.Color('#0a0e17'),
      emissiveIntensity: 0.15,
      roughness: 0.28,
      metalness: 0.25,
      transmission: 0.65,
      thickness: 1.4,
      ior: 1.35,
      reflectivity: 0.5,
      clearcoat: 0.4,
      clearcoatRoughness: 0.15,
      flatShading: true,
      transparent: true,
      opacity: 0.88,
    });
    this.outerCrystalMesh = new THREE.Mesh(outerGeo, this.outerMat);
    this.rootGroup.add(this.outerCrystalMesh);

    // 2. Malla Geodésica Alámbrica Sutil (Línea Slate de Precisión)
    const wireGeo = new THREE.IcosahedronGeometry(1.74, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(wireGeo);
    this.wireMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#475569'),
      transparent: true,
      opacity: 0.45,
    });
    const outerWireframe = new THREE.LineSegments(wireframeGeometry, this.wireMat);
    this.rootGroup.add(outerWireframe);

    // 3. Nodos en los Vértices
    const verticesPositions = outerGeo.attributes.position;
    const uniquePoints = [];
    const seen = new Set();
    for (let i = 0; i < verticesPositions.count; i++) {
      const vx = verticesPositions.getX(i).toFixed(3);
      const vy = verticesPositions.getY(i).toFixed(3);
      const vz = verticesPositions.getZ(i).toFixed(3);
      const key = `${vx},${vy},${vz}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePoints.push(parseFloat(vx) * 1.015, parseFloat(vy) * 1.015, parseFloat(vz) * 1.015);
      }
    }
    const nodesGeo = new THREE.BufferGeometry();
    nodesGeo.setAttribute('position', new THREE.Float32BufferAttribute(uniquePoints, 3));
    const nodesMat = new THREE.PointsMaterial({
      color: new THREE.Color('#94A3B8'),
      size: 0.045,
      transparent: true,
      opacity: 0.75,
    });
    const vertexNodes = new THREE.Points(nodesGeo, nodesMat);
    this.rootGroup.add(vertexNodes);

    // 4. Núcleo Interno Estructural (Octaedro)
    const innerGeo = new THREE.OctahedronGeometry(0.86, 2);
    this.innerMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3B82F6'),
      emissive: new THREE.Color('#1D4ED8'),
      emissiveIntensity: 0.35,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    this.innerCoreMesh = new THREE.Mesh(innerGeo, this.innerMat);
    this.rootGroup.add(this.innerCoreMesh);

    // 5. Semilla Central Monolítica
    const seedGeo = new THREE.OctahedronGeometry(0.42, 0);
    this.seedMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F8FAFC'),
      emissive: new THREE.Color('#2563EB'),
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.5,
      flatShading: true,
    });
    this.seedMesh = new THREE.Mesh(seedGeo, this.seedMat);
    this.rootGroup.add(this.seedMesh);

    // 6. Anillos Guía de Rotación
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.005, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#334155'),
      transparent: true,
      opacity: 0.25,
    });
    this.orbitalRing1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.orbitalRing1.rotation.x = Math.PI / 2.6;
    this.orbitalRing1.rotation.y = 0.3;
    this.rootGroup.add(this.orbitalRing1);

    const ring2Geo = new THREE.TorusGeometry(2.68, 0.004, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#2563EB'),
      transparent: true,
      opacity: 0.15,
    });
    this.orbitalRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.orbitalRing2.rotation.x = -Math.PI / 3.2;
    this.orbitalRing2.rotation.z = 0.6;
    this.rootGroup.add(this.orbitalRing2);

    // 7. Partículas Ambientales Monocromáticas
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: new THREE.Color('#64748B'),
      size: 0.022,
      transparent: true,
      opacity: 0.4,
    });
    this.particleSystem = new THREE.Points(particlesGeo, particlesMat);
    this.scene.add(this.particleSystem);

    // 8. Iluminación de Estudio Técnica
    const ambientLight = new THREE.AmbientLight('#0F172A', 1.8);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight('#F8FAFC', 2.4);
    keyLight.position.set(4, 5, 5);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#2563EB', 1.4);
    rimLight.position.set(-5, -3, -2);
    this.scene.add(rimLight);

    this.cursorLight = new THREE.PointLight('#3B82F6', 1.8, 8);
    this.cursorLight.position.set(0, 0, 3.5);
    this.scene.add(this.cursorLight);

    // Eventos e IntersectionObserver para Optimización
    this.vincularEventos();
    this.inicializarObservadorVisibilidad();

    // Iniciar bucle de animación
    this.animar();
  }

  inicializarObservadorVisibilidad() {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observadorVisibilidad = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.estaVisible = entry.isIntersecting;

          if (this.estaVisible && !this.frameId) {
            this.clock.start();
            this.animar();
          } else if (!this.estaVisible && this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
          }
        });
      },
      { threshold: 0.05 }
    );

    const seccionHero = document.getElementById('hero');
    if (seccionHero) {
      this.observadorVisibilidad.observe(seccionHero);
    }
  }

  vincularEventos() {
    const cont = this.contenedor;

    const actualizarPuntero = (clientX, clientY) => {
      const rect = cont.getBoundingClientRect();
      this.mouse.targetX = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.targetY = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (this.isDragging) {
        const dx = clientX - this.prevDrag.x;
        const dy = clientY - this.prevDrag.y;
        this.dragVelocity.x = dx * 0.007;
        this.dragVelocity.y = dy * 0.007;
        this.prevDrag = { x: clientX, y: clientY };
      }
    };

    window.addEventListener('mousemove', (e) => actualizarPuntero(e.clientX, e.clientY), { passive: true });

    cont.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevDrag = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    cont.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches && e.touches[0]) {
          this.isDragging = true;
          this.prevDrag = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
      },
      { passive: true }
    );

    window.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches && e.touches[0]) {
          actualizarPuntero(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('resize', () => {
      if (!this.contenedor || !this.renderer || !this.camera) return;
      const ancho = this.contenedor.clientWidth;
      const alto = this.contenedor.clientHeight;
      this.camera.aspect = ancho / alto;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(ancho, alto);
    });
  }

  establecerModo(modo) {
    estado.modoRender = modo;
  }

  animar() {
    if (!this.estaVisible) {
      this.frameId = null;
      return;
    }

    this.frameId = requestAnimationFrame(() => this.animar());

    const elapsed = this.clock.getElapsedTime();
    const modo = estado.modoRender;
    const scrollProg = estado.progresoScroll;

    // Amortiguación
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    this.dragVelocity.x *= 0.94;
    this.dragVelocity.y *= 0.94;

    // Modos de Visualización Arquitectónicos
    if (modo === 'crystal') {
      this.outerCrystalMesh.visible = true;
      this.outerMat.opacity = 0.88;
      this.outerMat.wireframe = false;
      this.wireMat.opacity = 0.35;
      this.innerMat.emissiveIntensity = 0.35;
      this.seedMat.emissiveIntensity = 0.45;
    } else if (modo === 'wireframe') {
      this.outerCrystalMesh.visible = false;
      this.wireMat.opacity = 0.75;
      this.innerMat.emissiveIntensity = 0.55;
      this.seedMat.emissiveIntensity = 0.65;
    } else if (modo === 'overclock') {
      this.outerCrystalMesh.visible = true;
      this.outerMat.opacity = 0.65;
      this.wireMat.opacity = 0.65;
      this.innerMat.emissiveIntensity = 0.8 + Math.sin(elapsed * 4) * 0.2;
      this.seedMat.emissiveIntensity = 0.95;
    }

    // Rotación suave y controlada
    const multVel = this.movimientoReducido ? 0 : 0.8;
    this.rootGroup.rotation.y += 0.0022 * multVel + this.dragVelocity.x;
    this.rootGroup.rotation.x += 0.0010 * multVel + this.dragVelocity.y;

    const targetGroupX = -this.mouse.y * 0.25 + scrollProg * 1.0;
    const targetGroupZ = -this.mouse.x * 0.2;
    this.rootGroup.rotation.x += (targetGroupX - this.rootGroup.rotation.x) * 0.02;
    this.rootGroup.rotation.z += (targetGroupZ - this.rootGroup.rotation.z) * 0.02;

    if (!this.movimientoReducido) {
      this.rootGroup.position.y = Math.sin(elapsed * 1.0) * 0.08;

      this.innerCoreMesh.rotation.y = -elapsed * 0.3 * multVel;
      this.innerCoreMesh.rotation.z = elapsed * 0.2;
      this.seedMesh.rotation.x = elapsed * 0.5;
      this.seedMesh.rotation.y = elapsed * 0.4;

      this.orbitalRing1.rotation.z = elapsed * 0.15;
      this.orbitalRing2.rotation.y = -elapsed * 0.12;

      this.particleSystem.rotation.y = elapsed * 0.03 + this.mouse.x * 0.08;
      this.particleSystem.rotation.x = -this.mouse.y * 0.05;
    }

    this.cursorLight.position.x = this.mouse.x * 3.5;
    this.cursorLight.position.y = this.mouse.y * 3.5;

    const targetCamZ = 6.8 - Math.min(scrollProg * 1.2, 0.9);
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.04;

    this.renderer.render(this.scene, this.camera);

    // Telemetría HUD (throttled a ~200ms)
    if (elapsed - this.ultimoEnvioTelemetria > 0.2) {
      this.ultimoEnvioTelemetria = elapsed;
      actualizarTelemetriaHUD({
        rotX: ((this.rootGroup.rotation.x * 180) / Math.PI).toFixed(1),
        rotY: (((this.rootGroup.rotation.y * 180) / Math.PI) % 360).toFixed(1),
        vecX: this.mouse.x.toFixed(2),
        vecY: this.mouse.y.toFixed(2),
      });
    }
  }
}

function actualizarTelemetriaHUD({ rotX, rotY, vecX, vecY }) {
  const elRot = document.getElementById('telemetria-rotacion');
  const elVec = document.getElementById('telemetria-vector');
  const elScroll = document.getElementById('hud-profundidad-scroll');

  if (elRot) elRot.textContent = `${rotX}° / ${rotY}°`;
  if (elVec) elVec.textContent = `[${vecX}, ${vecY}]`;
  if (elScroll) elScroll.textContent = `${Math.round(estado.progresoScroll * 100)}%`;
}

// ============================================================================
// 2. BOTONES MAGNÉTICOS SUTILES (MICROINTERACCIÓN DISCRETA)
// ============================================================================
function inicializarBotonesMagneticos() {
  const botones = document.querySelectorAll('.boton-magnetico');

  botones.forEach((boton) => {
    boton.addEventListener('mouseenter', () => audio.reproducirTick());

    boton.addEventListener('mousemove', (e) => {
      const rect = boton.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Desplazamiento mínimo (4px máx) para evitar sensación de distorsión
      const offsetX = (relX - centerX) * 0.12;
      const offsetY = (relY - centerY) * 0.12;

      boton.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    boton.addEventListener('mouseleave', () => {
      boton.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

// ============================================================================
// 3. TARJETAS DE ENFOQUE TÉCNICO (ELEVACIÓN NATURAL Y SUTIL)
// ============================================================================
function inicializarTarjetasTilt() {
  const tarjetas = document.querySelectorAll('.tarjeta-enfoque-3d');

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener('mouseenter', () => {
      tarjeta.classList.add('activa');
      audio.reproducirTick();
    });

    tarjeta.addEventListener('mouseleave', () => {
      tarjeta.classList.remove('activa');
    });
  });
}

// ============================================================================
// 4. MANIFIESTO: LEGIBILIDAD DIRECTA Y CONTROL DE ILUMINACIÓN SUTIL
// ============================================================================
function inicializarManifiesto() {
  const contenedorPalabras = document.getElementById('contenedor-palabras-manifiesto');
  const deslizador = document.getElementById('deslizador-iluminacion');
  const etiquetaPorcentaje = document.getElementById('porcentaje-iluminacion');
  const botonReinicio = document.getElementById('boton-reinicio-iluminacion');

  if (!contenedorPalabras) return;

  const palabras = contenedorPalabras.querySelectorAll('.palabra-manifiesto');

  // Asegurar que todas las palabras sean legibles de forma predeterminada
  palabras.forEach((p) => p.classList.add('iluminada'));
  if (etiquetaPorcentaje) etiquetaPorcentaje.textContent = '100%';
  if (deslizador) deslizador.value = '1';

  const actualizarIluminacion = (progreso) => {
    palabras.forEach((palabra, index) => {
      const umbral = (index / palabras.length) * 0.7;
      if (progreso >= umbral) {
        palabra.classList.add('iluminada');
      } else {
        palabra.classList.remove('iluminada');
      }
    });

    if (etiquetaPorcentaje) {
      etiquetaPorcentaje.textContent = `${Math.round(progreso * 100)}%`;
    }
  };

  if (deslizador) {
    deslizador.addEventListener('input', (e) => {
      estado.anulacionManualManifiesto = true;
      estado.reveladoManifiesto = parseFloat(e.target.value);
      actualizarIluminacion(estado.reveladoManifiesto);
    });
  }

  if (botonReinicio) {
    botonReinicio.addEventListener('click', () => {
      audio.reproducirCampana();
      estado.anulacionManualManifiesto = false;
      actualizarIluminacion(1);
      if (deslizador) deslizador.value = '1';
      anunciarAccesible('Modo de lectura completa restablecido.');
    });
  }
}

// ============================================================================
// 5. LÍNEA DE TIEMPO: FILTRADO SEGMENTADO Y ACORDEÓN TÉCNICO
// ============================================================================
function inicializarTrayectoria() {
  const botonesFiltro = document.querySelectorAll('.boton-filtro-trayectoria');
  const itemsTimeline = document.querySelectorAll('.item-linea-tiempo');

  botonesFiltro.forEach((boton) => {
    boton.addEventListener('click', () => {
      audio.reproducirCampana();
      const categoria = boton.getAttribute('data-categoria');

      botonesFiltro.forEach((b) => {
        b.classList.remove('activo');
        b.setAttribute('aria-pressed', 'false');
      });
      boton.classList.add('activo');
      boton.setAttribute('aria-pressed', 'true');

      let cantidadVisibles = 0;
      itemsTimeline.forEach((item) => {
        const itemCat = item.getAttribute('data-tipo');
        if (categoria === 'TODOS' || itemCat === categoria) {
          item.style.display = 'block';
          cantidadVisibles++;
        } else {
          item.style.display = 'none';
        }
      });

      anunciarAccesible(`Filtro aplicado: ${categoria}. Mostrando ${cantidadVisibles} registros.`);
    });

    boton.addEventListener('mouseenter', () => audio.reproducirTick());
  });

  itemsTimeline.forEach((item) => {
    const cabeceraBoton = item.querySelector('.item-linea-tiempo__cabecera');
    const elementoActivador = cabeceraBoton || item;

    const alternarHito = () => {
      audio.reproducirCampana();
      const yaExpandido = item.classList.contains('expandido');

      // Colapsar los demás
      itemsTimeline.forEach((i) => {
        i.classList.remove('expandido');
        const b = i.querySelector('.item-linea-tiempo__cabecera');
        if (b) b.setAttribute('aria-expanded', 'false');
        const accionTexto = i.querySelector('.item-linea-tiempo__accion-texto');
        if (accionTexto) accionTexto.textContent = 'Detalles';
      });

      if (!yaExpandido) {
        item.classList.add('expandido');
        if (cabeceraBoton) cabeceraBoton.setAttribute('aria-expanded', 'true');
        const accionTexto = item.querySelector('.item-linea-tiempo__accion-texto');
        if (accionTexto) accionTexto.textContent = 'Ocultar';

        const tituloHito = item.querySelector('.item-linea-tiempo__titulo')?.textContent?.trim() || '';
        anunciarAccesible(`Hito expandido: ${tituloHito}`);
      }
    };

    elementoActivador.addEventListener('click', (e) => {
      e.stopPropagation();
      alternarHito();
    });

    elementoActivador.addEventListener('mouseenter', () => audio.reproducirTick());
  });
}

// ============================================================================
// 6. MATRIZ DE TECNOLOGÍAS & CONSOLA HOMELAB STATUS
// ============================================================================
function inicializarMatrizYHomelab() {
  const tarjetasTech = document.querySelectorAll('.tarjeta-tecnologia');
  const descriptorInspector = document.getElementById('descriptor-nodo-activo');

  tarjetasTech.forEach((tarjeta) => {
    const seleccionar = () => {
      tarjetasTech.forEach((t) => t.classList.remove('seleccionada'));
      tarjeta.classList.add('seleccionada');

      const descriptor = tarjeta.getAttribute('data-descriptor') || '';
      if (descriptorInspector) {
        descriptorInspector.textContent = descriptor;
      }
    };

    tarjeta.addEventListener('mouseenter', () => {
      audio.reproducirTick();
      seleccionar();
    });

    tarjeta.addEventListener('click', () => {
      audio.reproducirCampana();
      seleccionar();
    });

    // Accesibilidad por Teclado (WCAG 2.1 AA)
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        audio.reproducirCampana();
        seleccionar();
        const nombre = tarjeta.querySelector('.tarjeta-tecnologia__nombre')?.textContent?.trim() || '';
        anunciarAccesible(`Competencia seleccionada: ${nombre}.`);
      }
    });
  });

  // Consola Homelab Interactiva
  const contenedorLogs = document.getElementById('terminal-logs-contenedor');
  const botonesComando = document.querySelectorAll('.boton-comando-shell');
  const formShell = document.getElementById('formulario-shell-interactivo');
  const inputShell = document.getElementById('input-comando-shell');

  const agregarLog = (tipo, texto) => {
    if (!contenedorLogs) return;

    const div = document.createElement('div');
    div.className = `log-registro log-registro--${tipo}`;
    div.textContent = texto;

    contenedorLogs.appendChild(div);

    while (contenedorLogs.children.length > 8) {
      contenedorLogs.removeChild(contenedorLogs.firstChild);
    }

    contenedorLogs.scrollTop = contenedorLogs.scrollHeight;
  };

  const ejecutarComando = (cmdTexto) => {
    const limpio = cmdTexto.trim().toLowerCase();
    if (!limpio) return;

    if (limpio === 'status' || limpio === 'status --homelab' || limpio.startsWith('status')) {
      agregarLog('cmd', `$ ${cmdTexto}`);
      agregarLog(
        'ok',
        'UPTIME: 99.9% | ENV: SERVIDOR LOCAL (Basauri) | ESTADO: OPERATIVO | 14 CONTENEDORES'
      );
    } else if (limpio === 'ai' || limpio === 'pipeline' || limpio.includes('voice') || limpio.includes('llm')) {
      agregarLog('cmd', `$ ${cmdTexto}`);
      agregarLog(
        'ai',
        'VOICE_AI (DOMAX): LISTO | LLM LOCAL: Quantized / On-Prem | SOMORROSTRO BIG DATA: ACTIVO'
      );
    } else if (limpio === 'stack' || limpio === 'layers' || limpio.includes('stack')) {
      agregarLog('cmd', `$ ${cmdTexto}`);
      agregarLog(
        'ok',
        'L1 [SMR]: Linux/Redes -> L2 [DAM]: Java/Python/JS/SQL/Mongo -> L3 [IA]: GenAI & Pipelines'
      );
    } else if (limpio === 'ping') {
      agregarLog('cmd', '$ ping basauri.gateway');
      agregarLog('ok', '64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=11.2ms [NOMINAL]');
    } else if (limpio === 'whoami') {
      agregarLog('cmd', '$ whoami');
      agregarLog('ok', 'oier@stg-homelab: Oier Santo Tomás Gamayo · Especialista en Integración de IA & DAM');
    } else if (limpio === 'contacto' || limpio === 'contact') {
      agregarLog('cmd', `$ ${cmdTexto}`);
      agregarLog('ok', 'Navegando a la sección de contacto (#contacto)...');
      desplazarSuavementeA('contacto');
    } else if (limpio === 'help' || limpio === 'ayuda' || limpio === '?') {
      agregarLog('cmd', '$ help');
      agregarLog('sys', 'COMANDOS DISPONIBLES: status, ai, stack, ping, whoami, contacto, clear');
    } else if (limpio === 'clear' || limpio === 'cls') {
      if (contenedorLogs) {
        contenedorLogs.textContent = '';
        agregarLog('sys', 'CONSOLA HOMELAB REINICIADA');
        agregarLog('ok', 'Sistema listo. Haz clic en un preajuste o escribe un comando.');
      }
    } else {
      agregarLog('cmd', `$ ${cmdTexto}`);
      agregarLog('sys', `bash: orden no encontrada: "${cmdTexto}". Escribe "help" para ver los comandos.`);
    }
  };

  botonesComando.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.reproducirCampana();
      const comando = btn.getAttribute('data-comando');
      if (comando === 'status') ejecutarComando('status --homelab');
      else if (comando === 'ai') ejecutarComando('pipeline --ai');
      else if (comando === 'stack') ejecutarComando('stack --layers');
      else if (comando === 'clear') ejecutarComando('clear');
    });

    btn.addEventListener('mouseenter', () => audio.reproducirTick());
  });

  if (formShell && inputShell) {
    formShell.addEventListener('submit', (e) => {
      e.preventDefault();
      const texto = inputShell.value;
      if (texto.trim()) {
        audio.reproducirCampana();
        ejecutarComando(texto);
        inputShell.value = '';
      }
    });
  }

  // Simulación Periódica de Telemetría Dinámica Homelab
  setInterval(() => {
    if (document.visibilityState === 'hidden') return;

    const seccionStack = document.getElementById('stack');
    if (seccionStack) {
      const rect = seccionStack.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
        return;
      }
    }

    estado.telemetriaHomelab.cpu = Math.max(
      14,
      Math.min(68, estado.telemetriaHomelab.cpu + Math.floor(Math.random() * 9) - 4)
    );
    estado.telemetriaHomelab.vram = Number(
      Math.max(4.8, Math.min(11.2, estado.telemetriaHomelab.vram + (Math.random() * 0.4 - 0.2))).toFixed(1)
    );
    estado.telemetriaHomelab.ping = Math.max(
      8,
      Math.min(24, estado.telemetriaHomelab.ping + Math.floor(Math.random() * 5) - 2)
    );

    const elCpu = document.getElementById('metrica-homelab-cpu');
    const elVram = document.getElementById('metrica-homelab-vram');
    const elPing = document.getElementById('metrica-homelab-ping');

    if (elCpu) elCpu.textContent = `${estado.telemetriaHomelab.cpu}%`;
    if (elVram) elVram.textContent = `${estado.telemetriaHomelab.vram} GB`;
    if (elPing) elPing.textContent = `${estado.telemetriaHomelab.ping}ms`;
  }, 2500);
}

// ============================================================================
// 7. FORMULARIO DE CONTACTO DIRECTO & COPIA DE CORREO
// ============================================================================
function inicializarContacto() {
  const btnCopiar = document.getElementById('boton-copiar-email');
  const textoEmail = document.getElementById('texto-email-copia');
  const iconoCheck = document.getElementById('icono-check-email');
  const iconoMail = document.getElementById('icono-mail-email');

  if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
      audio.reproducirCampana();
      const exito = await copiarAlPortapapeles('oier.santotomas@dev-ops.es');
      if (exito) {
        if (textoEmail) textoEmail.textContent = 'Copiado al portapapeles';
        if (iconoCheck) iconoCheck.classList.remove('elemento-oculto');
        if (iconoMail) iconoMail.classList.add('elemento-oculto');

        anunciarAccesible('Correo electrónico oier.santotomas@dev-ops.es copiado al portapapeles.');

        setTimeout(() => {
          if (textoEmail) textoEmail.textContent = 'oier.santotomas@dev-ops.es';
          if (iconoCheck) iconoCheck.classList.add('elemento-oculto');
          if (iconoMail) iconoMail.classList.remove('elemento-oculto');
        }, 2500);
      }
    });

    btnCopiar.addEventListener('mouseenter', () => audio.reproducirTick());
  }

  // Temas de Contacto Rápido
  const botonesTemas = document.querySelectorAll('.boton-tema-interes');
  botonesTemas.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.reproducirCampana();
      botonesTemas.forEach((b) => {
        b.classList.remove('activo');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('activo');
      btn.setAttribute('aria-checked', 'true');
    });
  });

  // Envío del Formulario
  const formulario = document.getElementById('formulario-transmision');
  const botonEnviar = document.getElementById('boton-enviar-formulario');
  const textoBotonEnviar = document.getElementById('texto-boton-enviar');

  if (formulario && botonEnviar && textoBotonEnviar) {
    formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.reproducirCampana();

      const nombre = document.getElementById('contacto-nombre')?.value?.trim() || 'Contacto';
      const email = document.getElementById('contacto-email')?.value?.trim() || '';
      const campoMensaje = document.getElementById('mensaje-proyecto');
      const mensaje = campoMensaje ? campoMensaje.value.trim() : '';
      const temaActivo = document.querySelector('.boton-tema-interes.activo')?.textContent?.trim() || 'Consulta General';

      const textoOriginal = textoBotonEnviar.textContent;
      textoBotonEnviar.textContent = 'Mensaje preparado';
      botonEnviar.style.backgroundColor = 'var(--color-estado-activo)';
      botonEnviar.style.color = '#FFFFFF';

      anunciarAccesible('Mensaje procesado. Abriendo cliente de correo...');

      const asunto = encodeURIComponent(`[Contacto STG] Mensaje de ${nombre} // ${temaActivo}`);
      const cuerpo = encodeURIComponent(
        `Hola Oier,\n\nNombre / Empresa: ${nombre}\nCorreo: ${email}\nÁrea de Interés: ${temaActivo}\n\nMensaje:\n${mensaje}\n\n---\nEnviado desde el portafolio profesional de Oier Santo Tomás`
      );
      const enlaceMailto = `mailto:oier.santotomas@dev-ops.es?subject=${asunto}&body=${cuerpo}`;

      setTimeout(() => {
        window.location.href = enlaceMailto;
      }, 500);

      if (campoMensaje) campoMensaje.value = '';
      const campoNombre = document.getElementById('contacto-nombre');
      const campoEmail = document.getElementById('contacto-email');
      if (campoNombre) campoNombre.value = '';
      if (campoEmail) campoEmail.value = '';

      setTimeout(() => {
        textoBotonEnviar.textContent = textoOriginal;
        botonEnviar.style.backgroundColor = '';
        botonEnviar.style.color = '';
      }, 3500);
    });
  }
}

// ============================================================================
// 8. NAVEGACIÓN MÓVIL ADAPTATIVA (< 768px)
// ============================================================================
function inicializarMenuMovil() {
  const botonMenu = document.getElementById('boton-menu-movil');
  const menuDesplegable = document.getElementById('menu-movil-desplegable');
  if (!botonMenu || !menuDesplegable) return;

  const iconoHamburguesa = botonMenu.querySelector('.icono-hamburguesa');
  const iconoCerrar = botonMenu.querySelector('.icono-cerrar');

  const alternarMenu = (forzarEstado) => {
    const estaActivo = menuDesplegable.classList.contains('activo');
    const abrir = typeof forzarEstado === 'boolean' ? forzarEstado : !estaActivo;

    if (abrir) {
      audio.reproducirCampana();
      menuDesplegable.classList.add('activo');
      menuDesplegable.setAttribute('aria-hidden', 'false');
      botonMenu.setAttribute('aria-expanded', 'true');
      if (iconoHamburguesa) iconoHamburguesa.classList.add('elemento-oculto');
      if (iconoCerrar) iconoCerrar.classList.remove('elemento-oculto');
      anunciarAccesible('Menú de navegación móvil abierto.');
    } else {
      menuDesplegable.classList.remove('activo');
      menuDesplegable.setAttribute('aria-hidden', 'true');
      botonMenu.setAttribute('aria-expanded', 'false');
      if (iconoHamburguesa) iconoHamburguesa.classList.remove('elemento-oculto');
      if (iconoCerrar) iconoCerrar.classList.add('elemento-oculto');
    }
  };

  botonMenu.addEventListener('click', () => alternarMenu());

  const enlacesMoviles = menuDesplegable.querySelectorAll('.enlace-navegacion-movil');
  enlacesMoviles.forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      audio.reproducirCampana();
      const destinoId = enlace.getAttribute('data-destino');
      alternarMenu(false);
      if (destinoId) {
        desplazarSuavementeA(destinoId);
      }
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuDesplegable.classList.contains('activo')) {
      alternarMenu(false);
      botonMenu.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (
      menuDesplegable.classList.contains('activo') &&
      !menuDesplegable.contains(e.target) &&
      !botonMenu.contains(e.target)
    ) {
      alternarMenu(false);
    }
  });
}

// ============================================================================
// 9. NAVEGACIÓN, CONMUTADOR THREE.JS & SCROLL SPY
// ============================================================================
function inicializarNavegacionYModos(gestor3D) {
  const botonesModo = document.querySelectorAll('.boton-modo-render');
  botonesModo.forEach((btn) => {
    btn.addEventListener('click', () => {
      audio.reproducirCampana();
      const modo = btn.getAttribute('data-modo');
      if (modo && gestor3D) {
        gestor3D.establecerModo(modo);
      }

      botonesModo.forEach((b) => b.classList.remove('activo'));
      btn.classList.add('activo');
    });

    btn.addEventListener('mouseenter', () => audio.reproducirTick());
  });

  const botonAudio = document.getElementById('boton-alternar-audio');
  if (botonAudio) {
    if (audio.activo) {
      botonAudio.classList.add('activo');
      botonAudio.setAttribute('title', 'Respuesta sonora activada');
      botonAudio.setAttribute('aria-label', 'Respuesta sonora activada');
    }

    botonAudio.addEventListener('click', () => {
      const activo = audio.alternar();
      if (activo) {
        botonAudio.classList.add('activo');
        botonAudio.setAttribute('title', 'Respuesta sonora activada');
        botonAudio.setAttribute('aria-label', 'Respuesta sonora activada');
        anunciarAccesible('Respuesta sonora activada.');
      } else {
        botonAudio.classList.remove('activo');
        botonAudio.setAttribute('title', 'Activar respuesta sonora sutil');
        botonAudio.setAttribute('aria-label', 'Activar respuesta sonora sutil');
        anunciarAccesible('Respuesta sonora desactivada.');
      }
    });
  }

  const enlacesNav = document.querySelectorAll('.enlace-navegacion, .enlace-scroll');
  enlacesNav.forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      audio.reproducirCampana();
      const destinoId = enlace.getAttribute('data-destino');
      if (destinoId) {
        desplazarSuavementeA(destinoId);
      }
    });

    enlace.addEventListener('mouseenter', () => audio.reproducirTick());
  });

  // Seguimiento de Progreso de Scroll y Sección Activa (Scroll Spy)
  window.addEventListener(
    'scroll',
    limitarFrecuencia(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const normalizado = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      estado.progresoScroll = normalizado;

      const secciones = ['hero', 'vision', 'trayectoria', 'stack', 'contacto'];
      for (const secId of secciones) {
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
            document.querySelectorAll('.enlace-navegacion, .enlace-navegacion-movil').forEach((nav) => {
              if (nav.getAttribute('data-destino') === secId) {
                nav.classList.add('activo');
              } else {
                nav.classList.remove('activo');
              }
            });
            break;
          }
        }
      }
    }, 40),
    { passive: true }
  );
}

// ============================================================================
// INICIALIZACIÓN GLOBAL CUANDO EL DOM ESTÉ LISTO
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  const gestor3D = new GestorEscena3D('contenedor-escena-three');

  inicializarBotonesMagneticos();
  inicializarTarjetasTilt();
  inicializarManifiesto();
  inicializarTrayectoria();
  inicializarMatrizYHomelab();
  inicializarContacto();
  inicializarMenuMovil();
  inicializarNavegacionYModos(gestor3D);
});
