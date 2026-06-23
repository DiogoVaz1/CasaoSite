/* portal.js — seleção em ecrãs tácteis
   Os 3 painéis preenchem o ecrã (sem scroll). Tocar num painel seleciona-o
   (ganha cor, os outros ficam dim); tocar no painel já selecionado entra.
   No desktop com rato, o efeito é :hover (CSS) e isto fica inativo. */
(function () {
  'use strict';
  const grid = document.querySelector('.portal-grid');
  if (!grid) return;
  const paineis = Array.prototype.slice.call(grid.querySelectorAll('.painel'));
  const mq = window.matchMedia('(max-width: 719px), (hover: none)');

  function setActive(target) {
    paineis.forEach(function (p) { p.classList.toggle('ativa', p === target); });
  }

  function onClick(e) {
    const p = e.currentTarget;
    if (!p.classList.contains('ativa')) {
      e.preventDefault();      // 1.º toque: apenas seleciona (mostra a cor)
      setActive(p);
    }
    // se já está selecionado, o toque segue a hiperligação normalmente
  }

  function enable() {
    const inicial = paineis.filter(function (p) {
      return p.classList.contains('painel-ativo-inicial');
    })[0] || paineis[0];
    setActive(inicial);
    paineis.forEach(function (p) { p.addEventListener('click', onClick); });
  }

  function disable() {
    paineis.forEach(function (p) {
      p.removeEventListener('click', onClick);
      p.classList.remove('ativa');
    });
  }

  function apply() { mq.matches ? enable() : disable(); }

  apply();
  if (mq.addEventListener) {
    mq.addEventListener('change', function () { disable(); apply(); });
  } else if (mq.addListener) {
    mq.addListener(apply);
  }
})();
