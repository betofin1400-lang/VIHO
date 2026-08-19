/**
 * nav.js — Layout compartido del centro de desarrollo (sidebar + header compacto).
 *
 * NADA CABLEADO. Este archivo es SOLO el motor de pintado: no conoce el nombre del
 * proyecto, ni las paginas, ni los workspaces, ni cuantas skills hay. Todo eso lo
 * escribe `render.py` en `js/nav-data.js`, derivado del marcador y del disco:
 *
 *     window.CENTRO_NAV = {
 *       marca:   { pre: 'Centro ', acento: 'Alfa', sub: 'Centro de desarrollo' },
 *       version: 'v2.0.0',
 *       anio:    '2026',
 *       pages:   [ {section:'General'},
 *                  {id:'index', icon:'&#9673;', label:'Inicio', tags:['portada']},
 *                  {id:'avances-<workspace>', icon:'&#9702;', label:'<workspace>', sub:true}, ... ]
 *     }
 *
 * Se carga con dos <script> en este orden — nav-data.js primero:
 *   <body class="with-sidebar">
 *     <main class="main-content">...</main>
 *     <script src="js/nav-data.js"></script>
 *     <script src="js/nav.js"></script>
 *
 * Por que un .js y no un .json: el sitio se abre con file://, donde fetch() de un
 * JSON local lo bloquea CORS. Un script que asigna una global funciona sin servidor.
 *
 * Opt-out del header compacto (ej. una portada con hero propio):
 *   <body class="with-sidebar no-compact-header">
 */

(function () {
    'use strict';

    // Si nav-data.js falta o no cargo, el sidebar sale vacio pero la pagina NO se rompe.
    var NAV = window.CENTRO_NAV || {};
    var PAGES = NAV.pages || [];
    var MARCA = NAV.marca || { pre: '', acento: 'Centro', sub: 'Centro de desarrollo' };

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function currentPageId() {
        var file = window.location.pathname.split('/').pop().replace(/\.html$/, '');
        return file || 'index';
    }

    function currentPage() {
        var id = currentPageId();
        for (var i = 0; i < PAGES.length; i++) {
            if (PAGES[i].id === id) return PAGES[i];
        }
        return null;
    }

    function currentSection() {
        var id = currentPageId(), last = null;
        for (var i = 0; i < PAGES.length; i++) {
            if (PAGES[i].section) last = PAGES[i].section;
            if (PAGES[i].id === id) return last;
        }
        return null;
    }

    /* ============ SIDEBAR ============ */
    function renderSidebar() {
        var id = currentPageId();
        var html = '' +
            '<div class="sidebar-brand">' +
            '<h2>' + esc(MARCA.pre) + '<span class="accent">' + esc(MARCA.acento) + '</span></h2>' +
            '<p>' + esc(MARCA.sub) + '</p>' +
            '</div><nav class="sidebar-nav">';

        PAGES.forEach(function (item) {
            if (item.section) {
                html += '<div class="nav-section">' + esc(item.section) + '</div>';
                return;
            }
            var cls = [];
            if (item.id === id) cls.push('active');
            if (item.sub) cls.push('sub');
            // Una entrada sin pagina en disco NO se emite como enlace: render.py ya
            // la omite, pero si alguna vez llegara, degrada a texto inerte antes que
            // ofrecer un href roto.
            if (item.disabled) {
                html += '<a href="#" class="' + cls.concat('disabled').join(' ') +
                        '" aria-disabled="true" tabindex="-1">' +
                        '<span class="icon">' + (item.icon || '') + '</span>' +
                        '<span class="label">' + esc(item.label) + '</span></a>';
                return;
            }
            html += '<a href="' + esc(item.id) + '.html" class="' + cls.join(' ') + '">' +
                    '<span class="icon">' + (item.icon || '') + '</span>' +
                    '<span class="label">' + esc(item.label) + '</span></a>';
        });

        html += '</nav><div class="sidebar-footer">' +
                '<span class="footer-brand">' + esc(MARCA.pre) + esc(MARCA.acento) + '</span>' +
                '<span class="footer-ver">' + esc(MARCA.sub) + ' &bull; <strong>' +
                esc(NAV.version || '') + '</strong> &bull; ' + esc(NAV.anio || '') + '</span></div>';
        return html;
    }

    /* ============ HEADER COMPACTO ============ */
    function renderCompactHeader() {
        var page = currentPage();
        if (!page) return '';
        var section = currentSection();
        var tags = (page.tags || []).map(function (t) {
            return '<span class="badge">' + esc(t) + '</span>';
        }).join('');
        return '' +
            '<div class="compact-header">' +
            '<div class="breadcrumb"><a href="index.html">' + esc(MARCA.sub) + '</a>' +
            (section ? '<span class="sep">&rsaquo;</span><span class="section-label">' +
                       esc(section) + '</span>' : '') +
            '</div><div class="compact-header-row">' +
            '<h1><span class="icon">' + (page.icon || '') + '</span> ' + esc(page.label) + '</h1>' +
            '<div class="badges">' + tags + '</div></div></div>';
    }

    /* ============ INIT ============ */
    function toggleSidebar() {
        document.getElementById('sidebar').classList.toggle('open');
        document.getElementById('overlay').classList.toggle('show');
    }

    function initLayout() {
        document.body.classList.add('with-sidebar');

        if (!document.querySelector('.main-content')) {
            var main = document.createElement('main');
            main.className = 'main-content';
            var skip = { STYLE: 1, SCRIPT: 1, LINK: 1, META: 1 };
            Array.prototype.slice.call(document.body.childNodes).filter(function (n) {
                if (n.nodeType === Node.ELEMENT_NODE) return !skip[n.tagName];
                return n.nodeType === Node.TEXT_NODE;
            }).forEach(function (n) { main.appendChild(n); });
            document.body.appendChild(main);
        }

        var sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.id = 'sidebar';
        sidebar.innerHTML = renderSidebar();
        document.body.prepend(sidebar);

        var btn = document.createElement('button');
        btn.className = 'hamburger';
        btn.innerHTML = '&#9776;';
        btn.setAttribute('aria-label', 'Menu');
        btn.onclick = toggleSidebar;
        document.body.prepend(btn);

        var ov = document.createElement('div');
        ov.className = 'overlay';
        ov.id = 'overlay';
        ov.onclick = toggleSidebar;
        document.body.prepend(ov);

        if (!document.body.classList.contains('no-compact-header')) {
            var mc = document.querySelector('.main-content');
            var wrap = document.createElement('div');
            wrap.innerHTML = renderCompactHeader();
            if (mc && wrap.firstElementChild) mc.prepend(wrap.firstElementChild);
        }
    }

    document.addEventListener('DOMContentLoaded', initLayout);
})();
