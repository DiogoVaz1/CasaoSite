/* app.js — O Casão */
(function () {
  'use strict';

  /* ── Horário: mapeamento JS getDay() → chave DADOS.horarios ── */
  const DIAS_KEY  = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
  const DIAS_ABBR = ['dom.','2ª','3ª','4ª','5ª','6ª','sáb.'];
  const DIAS_LONG = {
    segunda:'Segunda-feira', terca:'Terça-feira', quarta:'Quarta-feira',
    quinta:'Quinta-feira',   sexta:'Sexta-feira', sabado:'Sábado', domingo:'Domingo'
  };

  function toMin(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m; // minutos desde a meia-noite ("00:00" → 0)
  }

  function shiftsForDay(di) {
    return DADOS.horarios[DIAS_KEY[di]] || [];
  }

  function agoraLisboa() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
  }

  /* ── Badge aberto/fechado ─────────────────────────────────────
     Suporta vários turnos por dia e turnos que passam da meia-noite
     (ex.: 19:00–02:00, ou 10:00–00:00). ─────────────────────────── */
  function calcBadge() {
    const now = agoraLisboa();
    const di  = now.getDay();
    const min = now.getHours() * 60 + now.getMinutes();

    // 1) Turnos de hoje
    for (const [o, c] of shiftsForDay(di)) {
      const open = toMin(o);
      let close  = toMin(c);
      if (close === 0) close = 1440;           // "00:00" = fim do dia
      if (close > open) {                        // turno normal
        if (min >= open && min < close) return { aberto: true, txt: `Aberto agora · fecha às ${c}` };
      } else if (min >= open) {                  // turno que cruza a meia-noite (parte da noite)
        return { aberto: true, txt: `Aberto agora · fecha às ${c}` };
      }
    }

    // 2) Turno de ontem que entra pela madrugada de hoje
    for (const [o, c] of shiftsForDay((di + 6) % 7)) {
      const open = toMin(o), close = toMin(c);
      if (close !== 0 && close <= open && min < close) {
        return { aberto: true, txt: `Aberto agora · fecha às ${c}` };
      }
    }

    // 3) Próxima abertura
    for (let i = 0; i <= 7; i++) {
      const ni = (di + i) % 7;
      for (const [o] of shiftsForDay(ni)) {
        if (i === 0 && toMin(o) <= min) continue;      // turno de hoje já passado
        const quando = i === 0 ? 'hoje' : DIAS_ABBR[ni];
        return { aberto: false, txt: `Fechado · abre ${quando} às ${o}` };
      }
    }
    return { aberto: false, txt: 'Fechado' };
  }

  function renderBadge() {
    const el = document.getElementById('badge');
    if (!el) return;
    const b = calcBadge();
    el.textContent = b.txt;
    el.className = b.aberto ? 'badge-aberto' : 'badge-fechado';
  }

  /* ── Especialidades ───────────────────────────────────────── */
  const SLUGS = {
    'Carne de porco à alentejana': 'carne-porco',
    'Ensopado de borrego':          'borrego',
    'Sericaia com ameixa':          'sericaia',
    'Doce da casa':                  'doce-casa'
  };

  function renderEspecialidades() {
    const grid = document.getElementById('espec-grid');
    if (!grid) return;

    DADOS.destaques.forEach(nome => {
      const slug = SLUGS[nome]
        || nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
      const src = `img/prato-${slug}.webp`;

      const card = document.createElement('article');
      card.className = 'espec-card revelar';
      card.dataset.rd = (grid.children.length * 80);
      card.innerHTML = `
        <div class="espec-foto">
          <img src="${src}" alt="${escHtml(nome)}" loading="lazy"
               onerror="this.style.display='none'">
          <div class="espec-foto-ph" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            foto a adicionar
          </div>
        </div>
        <div class="espec-info">
          <h3>${escHtml(nome)}</h3>
          <p class="espec-ph-desc">—</p>
        </div>`;
      grid.appendChild(card);
    });
  }

  /* ── Ementa ───────────────────────────────────────────────── */
  function renderEmenta() {
    const tabs     = document.getElementById('ementa-tabs');
    const conteudo = document.getElementById('ementa-conteudo');
    if (!tabs || !conteudo) return;

    const cats = Object.keys(DADOS.ementa);

    cats.forEach((cat, i) => {
      // Tab button
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (i === 0 ? ' ativo' : '');
      btn.textContent = cat;
      btn.dataset.cat = cat;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => activateTab(cat));
      tabs.appendChild(btn);

      // Lista de pratos
      const lista = document.createElement('div');
      lista.id = `cat-${cat}`;
      lista.className = 'categoria-lista' + (i === 0 ? ' ativa' : '');
      lista.setAttribute('role', 'tabpanel');

      // Título de categoria — só visível na impressão (no ecrã usam-se as tabs)
      const tit = document.createElement('h3');
      tit.className = 'cat-titulo-print';
      tit.textContent = cat;
      lista.appendChild(tit);

      DADOS.ementa[cat].forEach(p => {
        const item = document.createElement('div');
        item.className = 'prato-item';

        const esq = document.createElement('div');
        esq.className = 'prato-esq';
        esq.innerHTML =
          `<div class="prato-nome">${escHtml(p.nome)}${p.meiaDose ? ' <span class="badge-meia">½ dose</span>' : ''}</div>` +
          (p.descricao ? `<div class="prato-desc">${escHtml(p.descricao)}</div>` : '');

        const preco = document.createElement('div');
        preco.className = 'prato-preco';
        preco.innerHTML = p.preco != null
          ? `${p.preco.toFixed(2).replace('.', ',')} €`
          : '<span class="preco-ph">a confirmar</span>';

        item.appendChild(esq);
        item.appendChild(preco);
        lista.appendChild(item);
      });

      conteudo.appendChild(lista);
    });

    // Nota sobre vinhos
    const vNota = document.createElement('p');
    vNota.className = 'vinhos-nota';
    vNota.textContent = 'Vinhos regionais alentejanos · carta disponível no restaurante';
    conteudo.appendChild(vNota);
  }

  function activateTab(cat) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      const ativo = b.dataset.cat === cat;
      b.classList.toggle('ativo', ativo);
      b.setAttribute('aria-selected', ativo ? 'true' : 'false');
    });
    document.querySelectorAll('.categoria-lista').forEach(l => {
      l.classList.toggle('ativa', l.id === `cat-${cat}`);
    });
  }

  /* ── Reviews ──────────────────────────────────────────────── */
  function renderReviews() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    DADOS.reviews.forEach(r => {
      const card = document.createElement('article');
      card.className = 'review-card revelar';
      card.dataset.rd = (grid.children.length * 90);
      const autor = r.autor ? r.autor.split(' ')[0] : 'Google Review';
      card.innerHTML =
        `<p class="review-texto">"${escHtml(r.texto)}"</p>` +
        `<p class="review-autor">— ${escHtml(autor)}</p>`;
      grid.appendChild(card);
    });
  }

  /* ── Horários (tabela) ────────────────────────────────────── */
  function renderHorarios() {
    const tbody = document.getElementById('horarios-tbody');
    if (!tbody) return;
    const hoje = agoraLisboa().getDay();

    const ORDEM = [
      ['segunda',1],['terca',2],['quarta',3],
      ['quinta',4],['sexta',5],['sabado',6],['domingo',0]
    ];

    ORDEM.forEach(([key, jsDay]) => {
      const sch = DADOS.horarios[key];
      const tr  = document.createElement('tr');
      if (jsDay === hoje) tr.className = 'hoje';

      const tdDia = document.createElement('td');
      tdDia.textContent = DIAS_LONG[key];

      const tdHrs = document.createElement('td');
      if (!sch) {
        tdHrs.textContent = 'Fechado';
        tdHrs.className = 'fechado';
      } else {
        tdHrs.textContent = sch.map(([o, c]) => `${o} – ${c}`).join(' · ');
      }

      tr.appendChild(tdDia);
      tr.appendChild(tdHrs);
      tbody.appendChild(tr);
    });
  }

  /* ── Revelação no scroll ──────────────────────────────────── */
  function initReveal() {
    document.documentElement.classList.add('js-reveal');

    // Marcar alvos estáticos (os cards gerados já trazem .revelar)
    const SEL = '[data-reveal], .seccao-etiqueta, .seccao-titulo, .seccao-intro,' +
                ' .ementa-conteudo, .reservas-box > *, .local-info, .local-mapa, .reviews-link';
    document.querySelectorAll(SEL).forEach(el => el.classList.add('revelar'));

    const els = document.querySelectorAll('.revelar');

    const revelar = el => {
      const d = el.dataset.rd;
      if (d) el.style.transitionDelay = d + 'ms';
      el.classList.add('visivel');
    };

    // Sem IntersectionObserver: mostrar tudo, sem animar
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visivel'));
      return;
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        revelar(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // O que já está na dobra revela no load (não depende do observer);
    // o resto fica ao cuidado do IntersectionObserver ao rolar.
    const naDobra = el => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight * 0.92 && r.bottom > 0;
    };
    // Pequeno atraso para garantir que o estado inicial (opacity 0) é
    // pintado antes de animar — funciona mesmo quando rAF não corre.
    setTimeout(() => {
      els.forEach(el => { if (naDobra(el)) revelar(el); else io.observe(el); });
    }, 60);
  }

  /* ── WhatsApp (renderizado só se DADOS.whatsapp existir) ──── */
  const WA_GLYPH = 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z';

  function waIcon(size) {
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true"><path d="${WA_GLYPH}"/></svg>`;
  }
  function waUrl() {
    const msg = DADOS.whatsappMsg ? `?text=${encodeURIComponent(DADOS.whatsappMsg)}` : '';
    return `https://wa.me/${DADOS.whatsapp}${msg}`;
  }

  function renderWhatsapp() {
    if (!DADOS.whatsapp) return; // sem número → nada aparece
    const url = waUrl();

    const heroAcoes = document.querySelector('.hero-acoes');
    if (heroAcoes) {
      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp';
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = waIcon(18) + 'WhatsApp';
      heroAcoes.appendChild(a);
    }

    const sticky = document.querySelector('.sticky-bar');
    if (sticky) {
      const a = document.createElement('a');
      a.className = 'sticky-wa';
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = waIcon(20) + '<span>WhatsApp</span>';
      sticky.insertBefore(a, sticky.children[1] || null);
    }

    const reservas = document.querySelector('.reservas-box');
    if (reservas) {
      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp reservas-wa';
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = waIcon(18) + 'Reservar por WhatsApp';
      reservas.appendChild(a);
    }
  }

  /* ── Redes sociais no rodapé (só se DADOS.redes existir) ───── */
  const REDE_ICON = {
    instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
    facebook:  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
  };

  function renderRedes() {
    const el = document.getElementById('rodape-redes');
    if (!el) return;
    if (!Array.isArray(DADOS.redes) || DADOS.redes.length === 0) { el.remove(); return; }
    el.innerHTML = DADOS.redes.map(r => {
      const path = REDE_ICON[r.tipo];
      if (!path) return '';
      return `<a href="${escHtml(r.url)}" target="_blank" rel="noopener" aria-label="${escHtml(r.tipo)}">` +
             `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg></a>`;
    }).join('');
  }

  /* ── Util ─────────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  /* ── Boot ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    renderBadge();
    setInterval(renderBadge, 60_000);
    renderEspecialidades();
    renderEmenta();
    renderReviews();
    renderHorarios();
    renderWhatsapp();
    renderRedes();
    initReveal(); // depois de o conteúdo dinâmico estar no DOM
  });
})();
