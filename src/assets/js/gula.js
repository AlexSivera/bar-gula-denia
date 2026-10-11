/* GULA · Dénia — comportamiento mínimo, sin dependencias.
   Todo el contenido existe sin JavaScript; esto solo añade:
   estado abierto/cerrado, pestañas de antojos, mapa bajo demanda,
   «hoy» en el horario y sección activa en la carta. */
(function () {
  'use strict';

  var CLAVES = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  var NOMBRES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  var horario = {};
  try { horario = JSON.parse(document.body.getAttribute('data-horario') || '{}'); } catch (e) { horario = {}; }

  // Hora de Dénia (Europe/Madrid). ?dia=0-6&hora=HH:MM permite probar otros momentos.
  function ahora() {
    var q = new URLSearchParams(location.search);
    if (q.has('dia') && q.has('hora')) {
      var hm = q.get('hora').split(':');
      return { dia: +q.get('dia') % 7, min: (+hm[0]) * 60 + (+hm[1] || 0) };
    }
    var partes = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var v = {};
    partes.forEach(function (p) { v[p.type] = p.value; });
    var dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { dia: dias[v.weekday], min: (+v.hour) * 60 + (+v.minute) };
  }

  // Desplaza solo el contenedor horizontal, nunca la página
  function centrar(cont, el) {
    if (!cont || cont.scrollWidth <= cont.clientWidth) return;
    cont.scrollTo({ left: el.offsetLeft - (cont.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }

  var aMin = function (h) { var p = h.split(':'); return (+p[0]) * 60 + (+p[1]); };
  var bonita = function (h) { return h.replace(/^0/, ''); };

  function calcularEstado() {
    var n = ahora();
    var hoy = horario[CLAVES[n.dia]];
    if (hoy && n.min >= aMin(hoy[0]) && n.min < aMin(hoy[1])) {
      var queda = aMin(hoy[1]) - n.min;
      return {
        abierto: true, dia: n.dia,
        corto: ['Abierto', queda <= 30 ? ' · cierra a las ' + bonita(hoy[1]) : ' hasta las ' + bonita(hoy[1])],
        largo: queda <= 30 ? 'Abierto, pero cerramos a las ' + bonita(hoy[1]) + '.' : 'Abierto ahora · hasta las ' + bonita(hoy[1]) + '.'
      };
    }
    if (hoy && n.min < aMin(hoy[0])) {
      return { abierto: false, dia: n.dia, corto: ['Cerrado', ' · abre a las ' + bonita(hoy[0])], largo: 'Ahora cerrado · hoy abrimos a las ' + bonita(hoy[0]) + '.' };
    }
    for (var i = 1; i <= 7; i++) {
      var d = (n.dia + i) % 7, h = horario[CLAVES[d]];
      if (h) {
        var cuando = i === 1 ? 'mañana' : 'el ' + NOMBRES[d];
        var miercoles = !hoy;
        return {
          abierto: false, dia: n.dia,
          corto: miercoles ? ['Hoy cerrado', ' · abre ' + cuando] : ['Cerrado', ' · abre ' + cuando],
          largo: (miercoles ? 'Los miércoles descansamos.' : 'Ahora cerrado.') + ' Abrimos ' + cuando + ' a las ' + bonita(h[0]) + '.'
        };
      }
    }
    return null;
  }

  var estado = calcularEstado();
  if (estado) {
    document.querySelectorAll('[data-estado]').forEach(function (el) {
      var t = el.querySelector('[data-estado-texto]');
      t.textContent = estado.corto[0];
      var det = document.createElement('span');
      det.className = 'estado__detalle';
      det.textContent = estado.corto[1];
      t.appendChild(det);
      el.classList.toggle('es-cerrado', !estado.abierto);
      el.hidden = false;
    });
    document.querySelectorAll('[data-estado-largo]').forEach(function (el) {
      el.textContent = estado.largo;
      el.classList.add(estado.abierto ? 'es-abierto' : 'es-cerrado');
    });
    var fila = document.querySelector('.horario tr[data-dia="' + estado.dia + '"]');
    if (fila) { fila.classList.add('es-hoy'); fila.setAttribute('aria-current', 'date'); }
  }

  // Pestañas «¿Qué te pide el cuerpo?» (patrón ARIA tabs, activación manual con flechas)
  var lista = document.querySelector('[data-tabs]');
  if (lista) {
    var tabs = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
    var paneles = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    function activar(i, foco) {
      tabs.forEach(function (t, j) {
        var si = i === j;
        t.setAttribute('aria-selected', si ? 'true' : 'false');
        t.tabIndex = si ? 0 : -1;
        paneles[j].hidden = !si;
      });
      if (foco) tabs[i].focus();
      if (foco !== null) centrar(lista, tabs[i]);
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activar(i, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, nuevo = null;
        if (k === 'ArrowRight') nuevo = (i + 1) % tabs.length;
        else if (k === 'ArrowLeft') nuevo = (i - 1 + tabs.length) % tabs.length;
        else if (k === 'Home') nuevo = 0;
        else if (k === 'End') nuevo = tabs.length - 1;
        if (nuevo !== null) { e.preventDefault(); activar(nuevo, true); }
      });
    });
    paneles.forEach(function (p) { p.tabIndex = 0; });
    document.body.classList.add('js-tabs');
    lista.hidden = false;
    activar(0, null);
  }

  // Mapa de Google solo cuando se pide
  document.querySelectorAll('[data-mapa]').forEach(function (caja) {
    var boton = caja.querySelector('[data-mapa-boton]');
    if (!boton) return;
    boton.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = caja.getAttribute('data-src');
      f.title = 'Mapa de Google con la ubicación de Bar Restaurante GULA';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      caja.textContent = '';
      caja.appendChild(f);
      caja.classList.add('con-mapa');
    });
  });

  // Carta: resaltar la sección visible en la barra
  var enlaces = document.querySelectorAll('.carta-nav a');
  if (enlaces.length && 'IntersectionObserver' in window) {
    var porId = {};
    enlaces.forEach(function (a) { porId[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        enlaces.forEach(function (a) { a.removeAttribute('aria-current'); });
        var a = porId[en.target.id];
        if (a) {
          a.setAttribute('aria-current', 'true');
          centrar(a.closest('ul'), a);
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    document.querySelectorAll('.carta-sec').forEach(function (s) { io.observe(s); });
  }

  // ---------- Movimiento ----------
  // html.mo lo pone el <head> solo si hay IntersectionObserver y no se pide reducir movimiento.
  var MO = document.documentElement.classList.contains('mo');
  var EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';
  var EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  var EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

  // Plato giratorio de la portada: enseña que en Gula hay de todo.
  // Gira solo cada pocos segundos (con botón de pausa), se para fuera de pantalla
  // o con la pestaña oculta y, con movimiento reducido, solo cambia si se pide.
  var giro = document.querySelector('[data-giratorio]');
  if (giro) {
    var platos = [];
    try { platos = JSON.parse(giro.getAttribute('data-platos') || '[]'); } catch (e) { platos = []; }
    var fig = giro.querySelector('[data-plato]');
    var foto = fig && fig.querySelector('img');
    var controles = giro.querySelector('[data-giro-controles]');
    if (foto && controles && platos.length > 1) {
      var peg = giro.querySelectorAll('[data-pegatina] span');
      var pie = giro.querySelector('[data-giro-pie]');
      var nombre = giro.querySelector('[data-giro-nombre]');
      var precioEl = giro.querySelector('[data-giro-precio]');
      var bPausa = giro.querySelector('[data-giro-pausa]');
      var bSig = giro.querySelector('[data-giro-siguiente]');
      var actual = 0, girando = false, pausado = !MO, enPantalla = true, encima = false, reloj = null;
      var INTERVALO = 4500;

      controles.hidden = false;
      if (!MO) bPausa.hidden = true; // nada se mueve solo: no hace falta pausa

      var precargar = function (p) {
        var im = new Image();
        im.sizes = foto.sizes;
        im.srcset = p.srcset;
        im.src = p.src;
        return im.decode ? im.decode().catch(function () {}) : Promise.resolve();
      };
      var aplicar = function (p) {
        foto.srcset = p.srcset;
        foto.src = p.src;
        foto.alt = p.alt;
        nombre.textContent = p.nombre;
        precioEl.textContent = p.precio;
        p.peg.forEach(function (t, k) { if (peg[k]) peg[k].textContent = t; });
      };
      var programar = function () {
        clearTimeout(reloj);
        if (!pausado && enPantalla && !encima && !document.hidden) reloj = setTimeout(function () { siguiente(); }, INTERVALO);
      };
      var siguiente = function () {
        if (girando) return;
        girando = true;
        clearTimeout(reloj);
        var n = (actual + 1) % platos.length, p = platos[n];
        precargar(p).then(function () {
          actual = n;
          if (!MO) {
            aplicar(p);
            girando = false;
            return;
          }
          // El plato da una vuelta completa; a mitad de giro (máxima velocidad, con algo de
          // desenfoque) se cambia la foto, así el ojo lo lee como un plato que gira y llega otro.
          var vuelta = fig.animate([
            { transform: 'rotate(0deg) scale(1)', filter: 'blur(0px)' },
            { transform: 'rotate(180deg) scale(.93)', filter: 'blur(3px)', offset: 0.5 },
            { transform: 'rotate(360deg) scale(1)', filter: 'blur(0px)' }
          ], { duration: 950, easing: EASE_IN_OUT });
          giro.querySelector('[data-pegatina]').animate([
            { opacity: 1, transform: 'rotate(12deg) scale(1)' },
            { opacity: 0, transform: 'rotate(-10deg) scale(.7)', offset: 0.4 },
            { opacity: 0, transform: 'rotate(40deg) scale(1.4)', offset: 0.55 },
            { opacity: 1, transform: 'rotate(12deg) scale(1)' }
          ], { duration: 950, easing: EASE_OUT });
          pie.animate([
            { opacity: 1, transform: 'none' },
            { opacity: 0, transform: 'translateY(8px)', offset: 0.45 },
            { opacity: 0, transform: 'translateY(-8px)', offset: 0.55 },
            { opacity: 1, transform: 'none' }
          ], { duration: 950, easing: EASE_OUT });
          setTimeout(function () { aplicar(p); }, 475);
          vuelta.onfinish = vuelta.oncancel = function () { girando = false; programar(); };
        });
      };

      bSig.addEventListener('click', siguiente);
      bPausa.addEventListener('click', function () {
        pausado = !pausado;
        bPausa.setAttribute('aria-pressed', pausado ? 'true' : 'false');
        bPausa.setAttribute('aria-label', pausado ? 'Reanudar el cambio de platos' : 'Pausar el cambio de platos');
        programar();
      });
      // Si alguien está mirando o leyendo el plato con el ratón, se espera
      giro.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { encima = true; clearTimeout(reloj); } });
      giro.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { encima = false; programar(); } });
      document.addEventListener('visibilitychange', programar);
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { enPantalla = es[0].isIntersecting; programar(); }, { threshold: 0.3 }).observe(giro);
      }
      // Precarga el siguiente plato tras la entrada y arranca
      setTimeout(function () { precargar(platos[1]); programar(); }, 1200);
    }
  }

  if (!MO) return;

  // Revelados al hacer scroll: una sola vez, con escalonado entre hermanos
  var GRUPOS = [
    ['.titulo, .carta-sec__titulo', 'rv-linea', false],
    ['.antojos__intro, .bocatas__cab > p, .cocina__cab p, .dias__in > div > p, .donde__texto > p, .donde address, .donde__acciones, .domicilio, .opinan__pie, .donde__sub, .tel-gigante', 'rv-sube', false],
    ['.datos__lista li, .bocata, .fiestas li, .opinan__citas li, .horario tr', 'rv-sube', true],
    ['.cocina__rejilla figure', 'rv-cortina', true],
    ['.carta-sec__foto, .pie__sello', 'rv-plato', false]
  ];
  var pendientes = [];
  var alVer = []; // acciones que se lanzan una vez cuando su elemento entra en pantalla
  GRUPOS.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el) {
      if (el.closest('.hero, .antojo, .carta-hero')) return;
      // Lo que ya está a la vista al cargar se queda quieto: ocultarlo para
      // volver a mostrarlo sería un parpadeo, no una entrada.
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add(g[1]); // estado inicial, todavía sin transición
      if (g[2]) {
        var i = Array.prototype.indexOf.call(el.parentElement.children, el);
        if (el.closest('.cocina__rejilla')) i = Array.prototype.indexOf.call(el.closest('ul').children, el.closest('li'));
        el.style.setProperty('--i', String(Math.min(i, 7)));
      }
      pendientes.push(el);
    });
  });
  // Revela todo lo que ya esté por encima del 92 % de la pantalla, también lo que se
  // haya pasado de largo con un scroll rápido: así nada puede quedarse oculto.
  // (No se usa IntersectionObserver: entrega tarde con la página ocupada y no ve
  // los elementos que empiezan recortados con clip-path.)
  var revisar = function () {
    var limite = innerHeight * 0.92, toca = [];
    pendientes = pendientes.filter(function (el) {
      var recortado = el.classList.contains('rv-linea') || el.classList.contains('rv-cortina');
      var ref = recortado ? el.parentElement : el;
      if (ref.getBoundingClientRect().top < limite) { toca.push(el); return false; }
      return true;
    });
    toca.forEach(function (el) { el.classList.add('visto'); }); // escrituras después de leer
    alVer = alVer.filter(function (v) {
      if (v.el.getBoundingClientRect().top < limite) { v.fn(); return false; }
      return true;
    });
    if (!pendientes.length && !alVer.length) { removeEventListener('scroll', alMover); removeEventListener('resize', alMover); }
  };
  var pedido = false;
  var alMover = function () {
    if (pedido) return;
    pedido = true;
    requestAnimationFrame(function () { pedido = false; revisar(); });
  };
  // La transición se activa un fotograma después: así el estado inicial no se anima
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      pendientes.forEach(function (el) { el.classList.add('rv'); });
      addEventListener('scroll', alMover, { passive: true });
      addEventListener('resize', alMover);
      revisar();
    });
  });

  // Contador de la valoración: de 0,0 a la nota real cuando aparece
  var cuenta = document.querySelector('[data-cuenta]');
  if (cuenta) {
    var objetivo = parseFloat(cuenta.textContent.replace(',', '.'));
    var estrella = document.querySelector('.opinan__estrella');
    if (!isNaN(objetivo)) {
      var arrancar = function () {
        var t0 = performance.now(), dur = 1100;
        var paso = function (t) {
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
          cuenta.textContent = (objetivo * e).toFixed(1).replace('.', ',');
          if (k < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
        if (estrella && estrella.animate) {
          estrella.animate([
            { opacity: 0, transform: 'rotate(-160deg) scale(.4)' },
            { opacity: 1, transform: 'none' }
          ], { duration: 700, delay: 700, easing: EASE_BACK, fill: 'backwards' });
        }
      };
      // Solo se anima si aún está por debajo de la pantalla; si no, se deja la nota tal cual
      if (cuenta.getBoundingClientRect().top > innerHeight) {
        cuenta.textContent = '0,0';
        alVer.push({ el: cuenta, fn: arrancar });
      }
    }
  }
})();
