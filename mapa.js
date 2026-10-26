/* mapa.js - mostra o mapa da Google só depois de a pessoa tocar em "Mostrar mapa".
   Até lá não é feito nenhum pedido à Google (privacidade). Uso:
   <div class="mapa-ph" data-mapa-src="https://www.google.com/maps?...&output=embed" data-mapa-titulo="Mapa - ..."> ... <button class="mapa-ph-btn"> </div> */
(function () {
  'use strict';

  document.addEventListener('click', e => {
    const botao = e.target.closest('.mapa-ph-btn');
    if (!botao) return;
    const ph = botao.closest('.mapa-ph');
    if (!ph || !ph.dataset.mapaSrc) return;

    const iframe = document.createElement('iframe');
    iframe.src = ph.dataset.mapaSrc;
    iframe.title = ph.dataset.mapaTitulo || 'Mapa';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.border = '0';
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    ph.replaceWith(iframe);
    iframe.focus();
  });
})();
