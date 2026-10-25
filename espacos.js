/* espacos.js - seletor de espaços (O Casão · O Castelo · Catering)
   Põe o seletor no topo da página e em todos os elementos [data-espacos] (rodapé).
   Para acrescentar/alterar um espaço, edita só a lista ESPACOS. */
(function () {
  'use strict';

  const ESPACOS = [
    { href: 'casao.html',    nome: 'O Casão' },
    { href: 'castelo.html',  nome: 'O Castelo' },
    { href: 'catering.html', nome: 'Catering' }
  ];

  // página atual, com ou sem ".html" (o servidor pode remover a extensão)
  const atual = location.pathname.split('/').pop().replace(/\.html$/, '');

  function criar() {
    const nav = document.createElement('nav');
    nav.className = 'espacos';
    nav.setAttribute('aria-label', 'Os nossos espaços');
    nav.innerHTML = ESPACOS.map(e => {
      const eAtual = e.href.replace(/\.html$/, '') === atual;
      return `<a href="${e.href}"${eAtual ? ' aria-current="page"' : ''}>${e.nome}</a>`;
    }).join('');
    return nav;
  }

  // topo: logo a seguir à ligação "Saltar para o conteúdo" (que tem de ser a 1.ª a receber foco)
  const salto = document.querySelector('.skip-link');
  if (salto) salto.after(criar());
  else document.body.prepend(criar());

  // rodapé(s)
  document.querySelectorAll('[data-espacos]').forEach(el => {
    el.classList.add('espacos-rodape');
    el.innerHTML = '<p class="espacos-rodape-tit">Os nossos espaços</p>';
    el.appendChild(criar());
  });
})();
