/* fotos.js - envio de fotos para os álbuns do Catering (Cloudinary)
   Fluxo: palavra-passe -> /api/assinar devolve parâmetros assinados -> a foto vai direta para o Cloudinary.
   Antes de enviar, cada foto é reduzida (máx. 2400 px) para poupar dados e espaço. */
(function () {
  'use strict';

  const $ = id => document.getElementById(id);
  const NOVO = '__novo__';
  const MAX_LADO = 2400;
  const PARALELO = 2;
  const NOME_VALIDO = /^[\p{L}\p{N}][\p{L}\p{N} _.\-]{0,59}$/u;   // igual ao do servidor

  const el = {
    login: $('f-login'), senha: $('f-senha'), loginErro: $('f-login-erro'), entrar: $('f-entrar'),
    app: $('f-app'), album: $('f-album'), novoCaixa: $('f-novo-caixa'), novo: $('f-novo'),
    ficheiros: $('f-ficheiros'), contagem: $('f-contagem'), lista: $('f-lista'),
    enviar: $('f-enviar'), estado: $('f-estado'), sair: $('f-sair')
  };

  let palavraPasse = '';
  let fila = [];          // [{ file, li, estado, barra }]
  let aEnviar = false;

  const guardar = {
    ler() { try { return sessionStorage.getItem('fotos-pw') || ''; } catch (e) { return ''; } },
    pôr(v) { try { v ? sessionStorage.setItem('fotos-pw', v) : sessionStorage.removeItem('fotos-pw'); } catch (e) { /* sem armazenamento */ } }
  };

  /* ── Servidor ────────────────────────────────────────────── */
  async function assinatura(corpo) {
    let r;
    try {
      r = await fetch('/api/assinar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ password: palavraPasse }, corpo))
      });
    } catch (e) {
      throw Object.assign(new Error('Sem ligação ao servidor. Verifique a internet.'), { rede: true });
    }
    let j = {};
    try { j = await r.json(); } catch (e) { /* resposta sem JSON */ }
    if (!r.ok) throw Object.assign(new Error(j.erro || 'Erro ' + r.status), { estado: r.status });
    return j;
  }

  /* ── Entrada / saída ─────────────────────────────────────── */
  function mostrarLogin(msg) {
    el.app.hidden = true;
    el.login.hidden = false;
    el.loginErro.hidden = !msg;
    el.loginErro.textContent = msg || '';
    el.entrar.disabled = false;
  }

  async function mostrarApp() {
    el.login.hidden = true;
    el.app.hidden = false;
    await carregarAlbuns();
  }

  el.login.addEventListener('submit', async e => {
    e.preventDefault();
    palavraPasse = el.senha.value;
    el.entrar.disabled = true;
    el.entrar.textContent = 'A verificar…';
    el.loginErro.hidden = true;
    try {
      await assinatura({ verificar: true });
      guardar.pôr(palavraPasse);
      el.senha.value = '';
      await mostrarApp();
    } catch (err) {
      palavraPasse = '';
      mostrarLogin(err.message);
    }
    el.entrar.textContent = 'Entrar';
  });

  el.sair.addEventListener('click', () => {
    palavraPasse = '';
    guardar.pôr('');
    limparFila();
    mostrarLogin('');
  });

  /* ── Álbuns ──────────────────────────────────────────────── */
  async function carregarAlbuns() {
    let albuns = [];
    try {
      const r = await fetch('/api/albuns?t=' + Date.now());   // ignora a cache para ver álbuns recentes
      if (r.ok) albuns = await r.json();
    } catch (e) { /* sem lista: fica só "Álbum novo" */ }

    el.album.innerHTML = '';
    albuns.forEach(a => {
      if (!a.pasta) return;
      const o = document.createElement('option');
      o.value = a.pasta;
      o.textContent = a.titulo;
      el.album.appendChild(o);
    });
    const novo = document.createElement('option');
    novo.value = NOVO;
    novo.textContent = '＋ Álbum novo…';
    el.album.appendChild(novo);
    if (!albuns.length) el.album.value = NOVO;
    atualizarAlbum();
  }

  function atualizarAlbum() {
    el.novoCaixa.hidden = el.album.value !== NOVO;
    atualizarBotao();
  }
  el.album.addEventListener('change', atualizarAlbum);
  el.novo.addEventListener('input', atualizarBotao);

  function pastaEscolhida() {
    return (el.album.value === NOVO ? el.novo.value : el.album.value).trim();
  }

  /* ── Fotos escolhidas ────────────────────────────────────── */
  function limparFila() {
    fila = [];
    el.lista.innerHTML = '';
    el.ficheiros.value = '';
    el.contagem.textContent = 'Nenhuma foto escolhida.';
    atualizarBotao();
  }

  el.ficheiros.addEventListener('change', () => {
    limparFila_semInput();
    [...el.ficheiros.files].forEach(file => {
      const li = document.createElement('li');
      li.className = 'fotos-item';
      li.innerHTML = '<span class="fotos-item-nome"></span><span class="fotos-item-estado">À espera</span>' +
                     '<div class="fotos-barra"><span></span></div>';
      li.querySelector('.fotos-item-nome').textContent = file.name;
      el.lista.appendChild(li);
      fila.push({ file, li, estado: li.querySelector('.fotos-item-estado'), barra: li.querySelector('.fotos-barra > span') });
    });
    el.contagem.textContent = fila.length === 0 ? 'Nenhuma foto escolhida.'
      : fila.length === 1 ? '1 foto escolhida.' : fila.length + ' fotos escolhidas.';
    el.estado.textContent = '';
    el.estado.className = 'fotos-estado';
    atualizarBotao();
  });

  function limparFila_semInput() { fila = []; el.lista.innerHTML = ''; }

  function atualizarBotao() {
    const pasta = pastaEscolhida();
    el.enviar.disabled = aEnviar || !fila.length || !NOME_VALIDO.test(pasta);
  }

  /* ── Reduzir foto antes de enviar ────────────────────────── */
  async function reduzir(file) {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const esc = Math.min(1, MAX_LADO / Math.max(bmp.width, bmp.height));
      if (esc === 1 && file.size < 3 * 1024 * 1024 && /^image\/jpe?g$/i.test(file.type)) { bmp.close && bmp.close(); return file; }
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * esc);
      c.height = Math.round(bmp.height * esc);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      bmp.close && bmp.close();
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.86));
      return blob ? new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
    } catch (e) {
      return file;      // formato que o browser não lê (ex.: HEIC no computador): envia o original
    }
  }

  /* ── Enviar uma foto (com progresso) ─────────────────────── */
  function enviarUma(item, ass) {
    return new Promise(async resolve => {
      const marcar = (cls, txt) => { item.li.classList.remove('ok', 'erro'); if (cls) item.li.classList.add(cls); item.estado.textContent = txt; };
      marcar('', 'A preparar…');
      // se a redução demorar demasiado (foto estranha), envia o original em vez de ficar preso
      const ficheiro = await Promise.race([reduzir(item.file), new Promise(r => setTimeout(() => r(item.file), 20000))]);

      const fd = new FormData();
      fd.append('file', ficheiro);
      ['api_key', 'timestamp', 'signature', 'asset_folder', 'allowed_formats'].forEach(k => fd.append(k, ass[k]));

      const xhr = new XMLHttpRequest();
      xhr.open('POST', ass.url);
      xhr.upload.onprogress = e => {
        if (!e.lengthComputable) return;
        const p = Math.round(e.loaded / e.total * 100);
        item.barra.style.width = p + '%';
        marcar('', 'A enviar ' + p + '%');
      };
      xhr.onload = () => {
        if (xhr.status === 200) { item.barra.style.width = '100%'; marcar('ok', 'Enviada'); resolve(true); return; }
        let msg = 'Falhou';
        try { msg = JSON.parse(xhr.responseText).error.message || msg; } catch (e) { /* sem detalhe */ }
        item.barra.style.width = '100%';
        marcar('erro', msg.length > 40 ? 'Falhou' : msg);
        resolve(false);
      };
      xhr.onerror = () => { marcar('erro', 'Sem ligação'); resolve(false); };
      xhr.send(fd);
    });
  }

  el.enviar.addEventListener('click', async () => {
    if (aEnviar || !fila.length) return;
    const pasta = pastaEscolhida();
    if (!NOME_VALIDO.test(pasta)) return;

    aEnviar = true;
    atualizarBotao();
    el.enviar.textContent = 'A enviar…';
    el.estado.className = 'fotos-estado';
    el.estado.textContent = 'A enviar. Não feche esta página.';

    let ass;
    try {
      ass = await assinatura({ pasta });
    } catch (err) {
      aEnviar = false;
      el.enviar.textContent = 'Enviar fotos';
      atualizarBotao();
      if (err.estado === 401) { palavraPasse = ''; guardar.pôr(''); mostrarLogin('A palavra-passe mudou. Escreva-a de novo.'); return; }
      el.estado.className = 'fotos-estado erro';
      el.estado.textContent = err.message;
      return;
    }

    const pendentes = fila.filter(i => !i.li.classList.contains('ok'));
    let feitas = 0, certas = 0, seguinte = 0;
    async function trabalhador() {
      while (seguinte < pendentes.length) {
        const item = pendentes[seguinte++];
        if (await enviarUma(item, ass)) certas++;
        feitas++;
        el.estado.textContent = 'A enviar… ' + feitas + ' de ' + pendentes.length;
      }
    }
    await Promise.all(Array.from({ length: Math.min(PARALELO, pendentes.length) }, trabalhador));

    aEnviar = false;
    el.enviar.textContent = 'Enviar fotos';
    if (certas === pendentes.length) {
      el.estado.className = 'fotos-estado ok';
      el.estado.textContent = 'Pronto! ' + certas + (certas === 1 ? ' foto enviada' : ' fotos enviadas') +
        '. Aparecem no site dentro de alguns minutos.';
    } else {
      el.estado.className = 'fotos-estado erro';
      const falhadas = pendentes.length - certas;
      el.estado.textContent = (falhadas === 1 ? '1 foto não foi enviada' : falhadas + ' fotos não foram enviadas') +
        '. Toque em "Enviar fotos" para tentar de novo só ' + (falhadas === 1 ? 'essa.' : 'essas.');
    }
    atualizarBotao();
  });

  /* ── Arranque ────────────────────────────────────────────── */
  palavraPasse = guardar.ler();
  if (palavraPasse) {
    assinatura({ verificar: true }).then(mostrarApp).catch(() => { palavraPasse = ''; guardar.pôr(''); mostrarLogin(''); });
  } else {
    mostrarLogin('');
  }
})();
