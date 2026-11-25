/* ============================================================
   Opções do planeador de eventos (planear.html).
   Para acrescentar, tirar ou mudar opções edite só este ficheiro.

   unica: true  -> só se pode escolher uma opção do grupo
   unica: false -> pode marcar várias

   A CONFIRMAR: rever a lista com o que o serviço de catering
   faz mesmo, antes de divulgar a página.
   ============================================================ */
window.PLANEADOR_GRUPOS = [
  {
    id: 'evento',
    titulo: 'Tipo de evento',
    unica: true,
    opcoes: ['Casamento', 'Batizado', 'Comunhão', 'Aniversário', 'Festa', 'Jantar de empresa', 'Outro']
  },
  {
    id: 'rececao',
    titulo: 'Receção',
    unica: false,
    opcoes: ['Receção com bar', 'Entradas e petiscos']
  },
  {
    id: 'refeicao',
    titulo: 'Refeição',
    unica: false,
    opcoes: ['Sopa', 'Prato de peixe', 'Prato de carne']
  },
  {
    id: 'final',
    titulo: 'Sobremesa e fim de festa',
    unica: false,
    opcoes: ['Sobremesas', 'Fruta', 'Bolo do evento', 'Ceia']
  },
  {
    id: 'bebidas',
    titulo: 'Bebidas',
    unica: false,
    opcoes: ['Bebidas à refeição', 'Bar aberto']
  }
];
