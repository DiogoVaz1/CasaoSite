/* catering.js - álbuns de fotos do Catering
   Fonte de dados: /api/albuns (Cloudinary). Se a API não responder
   (ex.: servidor local), usa window.CATERING_ALBUNS (catering-dados.js). */
(function () {
  'use strict';

  let ALBUNS = [];

  const $ = id => document.getElementById(id);
  const corpo     = document.body;
  const secAlbuns = $('cat-albuns');
  const secAlbum  = $('cat-album');
  const grelhaA   = $('cat-grelha-albuns');
  const grelhaF   = $('cat-grelha-fotos');
  const voltar    = $('cat-voltar');
  const voltarTxt = $('cat-voltar-txt');
  const topoTit   = $('cat-topo-titulo');

  const ICONE_FOTO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const textoFotos = n => n === 1 ? '1 foto' : n + ' fotos';

  /* Placeholder colorido (álbuns de exemplo, sem imagens reais) */
  function placeholder(album, i) {
    const [c1, c2] = album.cor || ['#999', '#555'];
    const ang = 120 + (i * 37) % 120;
    return `<div class="cat-ph" style="background:linear-gradient(${ang}deg,${c1},${c2})">${ICONE_FOTO}</div>`;
  }

  function miniatura(album, foto, i, alt) {
    const src = foto && (foto.thumb || foto.src);
    return src
      ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async">`
      : placeholder(album, i);
  }

  /* ── Lista de álbuns ─────────────────────────────────────── */
  function renderAlbuns() {
    if (!ALBUNS.length) {
      grelhaA.innerHTML = '<p class="cat-intro">Ainda não há álbuns para mostrar.</p>';
      return;
    }
    grelhaA.innerHTML = ALBUNS.map(a => {
      const capa = a.capa
        ? `<img src="${esc(a.capa)}" alt="" loading="lazy" decoding="async">`
        : miniatura(a, a.fotos[0], 0, '');
      return `
        <button type="button" class="cat-album-cartao" data-id="${esc(a.id)}">
          <div class="cat-capa">${capa}</div>
          <p class="cat-album-nome">${esc(a.titulo)}</p>
          <p class="cat-album-qtd">${textoFotos(a.fotos.length)}</p>
        </button>`;
    }).join('');
  }

  /* ── Fotos de um álbum ───────────────────────────────────── */
  let albumAtual = null;

  function renderAlbum(album) {
    albumAtual = album;
    $('cat-album-titulo').textContent = album.titulo;
    $('cat-album-conta').textContent = textoFotos(album.fotos.length);
    grelhaF.innerHTML = album.fotos.map((f, i) => `
      <button type="button" class="cat-foto" data-i="${i}" aria-label="Abrir foto ${i + 1} de ${album.fotos.length}">
        ${miniatura(album, f, i, album.titulo + ' ' + (i + 1))}
      </button>`).join('');
  }

  /* ── Navegação (hash: #id do álbum; sem hash = lista) ────── */
  function mostrar() {
    const id = decodeURIComponent(location.hash.slice(1));
    const album = ALBUNS.find(a => a.id === id);

    if (album) {
      renderAlbum(album);
      secAlbuns.hidden = true;
      secAlbum.hidden = false;
      corpo.classList.add('em-album');
      topoTit.textContent = album.titulo;
      voltar.setAttribute('href', '#');
      voltarTxt.textContent = 'Álbuns';
      document.title = album.titulo + ' | Catering | O Casão';
    } else {
      albumAtual = null;
      secAlbum.hidden = true;
      secAlbuns.hidden = false;
      corpo.classList.remove('em-album');
      topoTit.textContent = '';
      voltar.setAttribute('href', 'index.html');
      voltarTxt.textContent = 'Espaços';
      document.title = 'Catering | O Casão · Vila Nova da Baronia';
    }
    fecharLb();
    window.scrollTo(0, 0);
  }

  grelhaA.addEventListener('click', e => {
    const b = e.target.closest('.cat-album-cartao');
    if (b) location.hash = encodeURIComponent(b.dataset.id);
  });

  voltar.addEventListener('click', e => {
    if (albumAtual) {            // "Álbuns": limpa o hash, volta à lista
      e.preventDefault();
      history.pushState('', document.title, location.pathname + location.search);
      mostrar();
    }
  });

  window.addEventListener('hashchange', mostrar);

  /* ── Foto em ecrã inteiro ────────────────────────────────── */
  const lb      = $('cat-lb');
  const palco   = $('cat-lb-palco');
  const lbConta = $('cat-lb-conta');
  let idx = 0;
  let focoAntes = null;

  function pintarLb() {
    const fotos = albumAtual.fotos;
    const f = fotos[idx];
    palco.innerHTML = f.src
      ? `<img src="${esc(f.src)}" alt="${esc(albumAtual.titulo)} ${idx + 1}" decoding="async">`
      : placeholder(albumAtual, idx);
    lbConta.textContent = (idx + 1) + ' / ' + fotos.length;
  }

  function abrirLb(i) {
    focoAntes = document.activeElement;
    idx = i;
    pintarLb();
    lb.hidden = false;
    corpo.classList.add('lb-aberta');
    $('cat-lb-fechar').focus();
  }

  function fecharLb() {
    if (lb.hidden) return;
    lb.hidden = true;
    corpo.classList.remove('lb-aberta');
    if (focoAntes && focoAntes.focus) focoAntes.focus();
  }

  function passar(d) {
    const n = albumAtual.fotos.length;
    idx = (idx + d + n) % n;
    pintarLb();
  }

  grelhaF.addEventListener('click', e => {
    const b = e.target.closest('.cat-foto');
    if (b) abrirLb(Number(b.dataset.i));
  });
  $('cat-lb-fechar').addEventListener('click', fecharLb);
  $('cat-lb-ant').addEventListener('click', () => passar(-1));
  $('cat-lb-seg').addEventListener('click', () => passar(1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target === palco) fecharLb(); });

  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') fecharLb();
    else if (e.key === 'ArrowLeft') passar(-1);
    else if (e.key === 'ArrowRight') passar(1);
  });

  /* Deslizar para mudar de foto (telemóvel) */
  let x0 = null;
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) passar(dx < 0 ? 1 : -1);
  });

  async function carregar() {
    grelhaA.innerHTML = '<p class="cat-intro">A carregar álbuns…</p>';
    try {
      const r = await fetch('/api/albuns');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      ALBUNS = await r.json();
    } catch (e) {
      ALBUNS = window.CATERING_ALBUNS || [];
    }
    renderAlbuns();
    mostrar();
  }

  carregar();
})();
