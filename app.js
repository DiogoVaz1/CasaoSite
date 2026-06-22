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
    return h === 0 ? 1440 : h * 60 + m; // "00:00" → meia-noite = fim do dia
  }

  function agoraLisboa() {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Lisbon' }));
  }

  /* ── Badge aberto/fechado ─────────────────────────────────── */
  function calcBadge() {
    const now = agoraLisboa();
    const di  = now.getDay();
    const min = now.getHours() * 60 + now.getMinutes();
    const sch = DADOS.horarios[DIAS_KEY[di]];

    if (sch) {
      for (const [o, c] of sch) {
        if (min >= toMin(o) && min < toMin(c)) {
          return { aberto: true, txt: `Aberto · fecha às ${c}` };
        }
      }
    }

    // Próxima abertura
    for (let i = 1; i <= 7; i++) {
      const ni = (di + i) % 7;
      const ns = DADOS.horarios[DIAS_KEY[ni]];
      if (ns && ns.length > 0) {
        return { aberto: false, txt: `Fechado · abre ${DIAS_ABBR[ni]} às ${ns[0][0]}` };
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
    initReveal(); // depois de o conteúdo dinâmico estar no DOM
  });
})();
