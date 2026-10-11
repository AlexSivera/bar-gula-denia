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
})();
