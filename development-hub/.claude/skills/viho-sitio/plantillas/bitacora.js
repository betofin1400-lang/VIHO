/**
 * bitacora.js — Realza las tablas de la bitácora (sitio estático, sin dependencias).
 *
 * Da a cualquier <table class="data-table"> :
 *   - Barra de herramientas: búsqueda de texto + selects de filtro (por columna) + "Limpiar".
 *   - Paginación (por defecto 10 filas/página), operando sobre las filas ya filtradas.
 *   - Fila de DETALLE expandible EN LÍNEA (bajo la misma fila del item) — item 3.
 *   - Botón de acción "Log" que filtra la tabla de log de abajo por ese item — item 4.
 *
 * Contrato de marcado (lo emite /centro-desarrollo al renderizar):
 *   <table class="data-table" data-table="func" data-filters="tipo:Tipo,estado:Estado,autor:Autor"
 *          data-page-size="10">
 *     <tbody>
 *       <tr class="item-row" data-item="feat-x" data-tipo="feature" data-estado="completado" data-autor="jfguzman">…</tr>
 *       <tr class="item-detail" data-detail-for="feat-x"><td colspan="N">…detalle…</td></tr>
 *       …
 *   <table class="data-table" data-table="log" data-filters="item:Funcionalidad" data-page-size="10">
 *     <tbody><tr class="log-row" data-item="feat-x">…</tr>…
 *
 * Un botón de acción: <button class="btn-log" data-log-item="feat-x">Log</button>
 */
(function () {
  'use strict';

  var PAGE_SIZE = 10;

  function parseFilters(spec) {
    // "tipo:Tipo,estado:Estado" -> [{key:'tipo', label:'Tipo'}, ...]
    if (!spec) return [];
    return spec.split(',').map(function (p) {
      var kv = p.split(':');
      return { key: kv[0].trim(), label: (kv[1] || kv[0]).trim() };
    });
  }

  function distinctValues(rows, key) {
    var seen = {};
    var out = [];
    rows.forEach(function (r) {
      var v = r.getAttribute('data-' + key);
      if (v && !seen[v]) { seen[v] = 1; out.push(v); }
    });
    return out.sort();
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function enhance(table) {
    var kind = table.getAttribute('data-table') || 'generic';
    var pageSize = parseInt(table.getAttribute('data-page-size'), 10) || PAGE_SIZE;
    var filters = parseFilters(table.getAttribute('data-filters'));
    var tbody = table.tBodies[0];
    if (!tbody) return;

    var allTr = Array.prototype.slice.call(tbody.rows);
    // Filas "principales" (paginables) vs filas de detalle (viajan con su item).
    var mainRows = allTr.filter(function (r) { return !r.classList.contains('item-detail'); });
    var detailFor = {};
    allTr.forEach(function (r) {
      if (r.classList.contains('item-detail')) {
        detailFor[r.getAttribute('data-detail-for')] = r;
        r.style.display = 'none';
      }
    });

    // ---- Barra de herramientas ----
    var toolbar = el('div', 'dt-toolbar');
    var search = el('input', 'dt-search');
    search.type = 'search';
    search.placeholder = 'Buscar…';
    toolbar.appendChild(search);

    var selects = {};
    filters.forEach(function (f) {
      var wrap = el('label', 'dt-filter');
      wrap.appendChild(el('span', 'dt-filter-lbl', f.label));
      var sel = el('select');
      var optAll = el('option', null, 'Todos');
      optAll.value = ''; // valor vacío = "sin filtro" (si no, su value sería el texto "Todos")
      sel.appendChild(optAll);
      distinctValues(mainRows, f.key).forEach(function (v) {
        var o = el('option', null, v);
        o.value = v;
        sel.appendChild(o);
      });
      wrap.appendChild(sel);
      toolbar.appendChild(wrap);
      selects[f.key] = sel;
    });

    var clearBtn = el('button', 'dt-clear', 'Limpiar filtros');
    clearBtn.type = 'button';
    toolbar.appendChild(clearBtn);

    var count = el('span', 'dt-count', '');
    toolbar.appendChild(count);

    var note = el('div', 'dt-note');
    note.style.display = 'none';

    // Si la tabla va dentro de un contenedor con scroll horizontal (.table-scroll,
    // responsive), la toolbar y el pager se insertan FUERA de él para que no se
    // desplacen con la tabla.
    var host = (table.parentNode && table.parentNode.classList &&
                table.parentNode.classList.contains('table-scroll')) ? table.parentNode : table;
    host.parentNode.insertBefore(toolbar, host);
    host.parentNode.insertBefore(note, host);

    // ---- Paginación ----
    var pager = el('div', 'dt-pager');
    host.parentNode.insertBefore(pager, host.nextSibling);

    var state = { page: 1 };

    function matches(row) {
      var q = search.value.trim().toLowerCase();
      if (q) {
        var text = row.textContent.toLowerCase();
        var det = detailFor[row.getAttribute('data-item')];
        if (det) text += ' ' + det.textContent.toLowerCase();
        if (text.indexOf(q) === -1) return false;
      }
      for (var key in selects) {
        var want = selects[key].value;
        if (want && row.getAttribute('data-' + key) !== want) return false;
      }
      return true;
    }

    function render() {
      var visible = mainRows.filter(matches);
      var pages = Math.max(1, Math.ceil(visible.length / pageSize));
      if (state.page > pages) state.page = pages;
      var start = (state.page - 1) * pageSize;
      var pageRows = visible.slice(start, start + pageSize);

      // Oculta todo, luego muestra la página actual + su detalle si está abierto.
      mainRows.forEach(function (r) {
        r.style.display = 'none';
        var det = detailFor[r.getAttribute('data-item')];
        if (det) det.style.display = 'none';
      });
      pageRows.forEach(function (r) {
        r.style.display = '';
        var det = detailFor[r.getAttribute('data-item')];
        if (det && r.classList.contains('open')) det.style.display = '';
      });

      count.textContent = visible.length + (visible.length === 1 ? ' resultado' : ' resultados');
      renderPager(pages);
    }

    function renderPager(pages) {
      pager.innerHTML = '';
      if (pages <= 1) return;
      function btn(label, page, disabled, active) {
        var b = el('button', 'dt-page' + (active ? ' active' : ''), label);
        b.type = 'button';
        if (disabled) b.disabled = true;
        else b.onclick = function () { state.page = page; render(); scrollTop(table); };
        pager.appendChild(b);
      }
      btn('‹', state.page - 1, state.page === 1, false);
      for (var i = 1; i <= pages; i++) btn(String(i), i, false, i === state.page);
      btn('›', state.page + 1, state.page === pages, false);
    }

    function scrollTop(node) {
      var y = node.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }

    // ---- Expandir fila (detalle en línea) ----
    mainRows.forEach(function (r) {
      var det = detailFor[r.getAttribute('data-item')];
      if (!det) return;
      r.classList.add('expandable');
      r.addEventListener('click', function (ev) {
        if (ev.target.closest('.btn-log') || ev.target.closest('a')) return; // no togglear en acción/enlace
        r.classList.toggle('open');
        det.style.display = r.classList.contains('open') ? '' : 'none';
      });
    });

    // ---- Eventos de filtro ----
    search.addEventListener('input', function () { state.page = 1; render(); });
    for (var k in selects) selects[k].addEventListener('change', function () { state.page = 1; render(); });
    clearBtn.addEventListener('click', function () {
      search.value = '';
      for (var k2 in selects) selects[k2].value = '';
      note.style.display = 'none';
      state.page = 1;
      render();
    });

    // API para el enlace acción→log (item 4).
    table._dt = {
      kind: kind,
      selects: selects,
      note: note,
      setItemFilter: function (item) {
        if (selects.item) { selects.item.value = item; }
        else { search.value = item; }
        state.page = 1;
        note.style.display = '';
        note.innerHTML = 'Filtrando por <strong>' + item + '</strong> · <a href="#" class="dt-note-clear">limpiar</a>';
        note.querySelector('.dt-note-clear').onclick = function (e) {
          e.preventDefault(); clearBtn.click();
        };
        render();
        scrollTop(toolbar);
      }
    };

    render();
  }

  function wireLogButtons() {
    var logTable = document.querySelector('table.data-table[data-table="log"]');
    document.querySelectorAll('.btn-log').forEach(function (b) {
      b.addEventListener('click', function () {
        if (logTable && logTable._dt) logTable._dt.setItemFilter(b.getAttribute('data-log-item'));
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('table.data-table').forEach(enhance);
    wireLogButtons();
  });
})();
