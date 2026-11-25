/* planear.js - planeador de eventos do Catering
   Desenha as caixas a partir de planear-dados.js, junta tudo num texto e
   abre o email ou o WhatsApp do visitante. Nada é enviado para o site. */
(function () {
  'use strict';

  const EMAIL = 'joaovazz@hotmail.com';
  const WHATSAPP = '351964894175';          // só dígitos, com indicativo
  const GRUPOS = window.PLANEADOR_GRUPOS || [];

  const $ = id => document.getElementById(id);
  const form  = $('plano-form');
  const aviso = $('plano-aviso');

  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  $('plano-grupos').innerHTML = GRUPOS.map(g => `
    <fieldset class="plano-cartao">
      <legend>${esc(g.titulo)}</legend>
      <p class="plano-ajuda">${g.unica ? 'Escolha uma opção.' : 'Pode marcar várias.'}</p>
      <div class="plano-opcoes">
        ${g.opcoes.map(o => `
          <label class="plano-opcao">
            <input type="${g.unica ? 'radio' : 'checkbox'}" name="${esc(g.id)}" value="${esc(o)}">
            <span>${esc(o)}</span>
          </label>`).join('')}
      </div>
    </fieldset>`).join('');

  const valor = id => $(id).value.trim();

  /* "2027-06-12" -> "12/06/2027" (sem passar por Date, para não mudar o dia com o fuso) */
  const dataPt = iso => iso.split('-').reverse().join('/');

  /* Texto do pedido; devolve '' enquanto não houver nenhuma opção marcada */
  function montarPedido() {
    const escolhas = GRUPOS.map(g => ({
      grupo: g,
      marcadas: Array.from(form.querySelectorAll(`input[name="${g.id}"]:checked`), i => i.value)
    })).filter(e => e.marcadas.length);

    if (!escolhas.length) return '';

    const linhas = ['Olá! Gostava de pedir um orçamento de catering.', ''];

    escolhas.forEach(({ grupo, marcadas }) => {
      if (grupo.unica) linhas.push(`${grupo.titulo}: ${marcadas[0]}`);
      else linhas.push('', `${grupo.titulo}:`, ...marcadas.map(m => '- ' + m));
    });

    const pormenores = [
      ['Data', valor('plano-data') && dataPt(valor('plano-data'))],
      ['N.º de pessoas', valor('plano-pessoas')],
      ['Local', valor('plano-local')],
      ['Notas', valor('plano-notas')],
      ['Nome', valor('plano-nome')]
    ].filter(p => p[1]);

    if (pormenores.length) {
      linhas.push('', ...pormenores.map(([rot, v]) => `${rot}: ${v}`));
    }

    return linhas.join('\n');
  }

  function atualizar() {
    const texto = montarPedido();
    $('plano-texto').textContent = texto;
    $('plano-texto').hidden = !texto;
    $('plano-vazio').hidden = !!texto;
    aviso.textContent = '';
  }

  /* devolve o texto, ou avisa e devolve '' se não há nada marcado */
  function pedidoOuAviso() {
    const texto = montarPedido();
    if (!texto) aviso.textContent = 'Marque pelo menos uma opção antes de enviar.';
    return texto;
  }

  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);
  form.addEventListener('submit', e => e.preventDefault());   // Enter não recarrega a página
  window.addEventListener('pageshow', atualizar);             // o browser pode repor as caixas ao voltar

  $('plano-email').addEventListener('click', () => {
    const texto = pedidoOuAviso();
    if (!texto) return;
    location.href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Pedido de orçamento - Catering') +
      '&body=' + encodeURIComponent(texto.replace(/\n/g, '\r\n'));
    aviso.textContent = 'Se o email não abrir, use «Copiar pedido» e envie para ' + EMAIL + '.';
  });

  $('plano-whatsapp').addEventListener('click', () => {
    const texto = pedidoOuAviso();
    if (!texto) return;
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  });

  $('plano-copiar').addEventListener('click', async () => {
    const texto = pedidoOuAviso();
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      aviso.textContent = 'Pedido copiado.';
    } catch (e) {
      const sel = window.getSelection();
      sel.selectAllChildren($('plano-texto'));
      aviso.textContent = 'Não foi possível copiar. O texto ficou selecionado: copie-o à mão.';
    }
  });

  /* não deixa escolher datas passadas no calendário */
  const hoje = new Date();
  $('plano-data').min = [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()]
    .map(n => String(n).padStart(2, '0')).join('-');

  atualizar();
})();
