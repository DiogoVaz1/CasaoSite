/* catering-dados.js - álbuns do Catering
   Formato de cada álbum:
     { id, titulo, cor: [c1, c2], capa?, fotos: [{ src, thumb? }] }
   - "thumb" é a miniatura (pequena); "src" é a foto grande. Sem "thumb", usa-se "src".
   - Foto sem "src" aparece como placeholder colorido (álbuns de exemplo).
   Quando a pasta do Drive estiver ligada, esta lista passa a vir de /api/albuns
   (mesmo formato) e este ficheiro serve só de exemplo / alternativa. */
(function () {
  const amostra = n => Array.from({ length: n }, () => ({}));

  window.CATERING_ALBUNS = [
    { id: 'casamentos',   titulo: 'Casamentos',         cor: ['#C8922E', '#A6522C'], fotos: amostra(24) },
    { id: 'batizados',    titulo: 'Batizados',          cor: ['#2E7A9E', '#16435A'], fotos: amostra(12) },
    { id: 'aniversarios', titulo: 'Aniversários',       cor: ['#A6522C', '#6E2433'], fotos: amostra(18) },
    { id: 'empresas',     titulo: 'Eventos de empresa', cor: ['#5C544B', '#2B2622'], fotos: amostra(9) },
    { id: 'comunhoes',    titulo: 'Comunhões',          cor: ['#E3C06A', '#C8922E'], fotos: amostra(15) },
    { id: 'jantares',     titulo: 'Jantares privados',  cor: ['#6E2433', '#4A443C'], fotos: amostra(7) }
  ];
})();
