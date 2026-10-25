// Dados d'O Castelo - placeholders até o cliente fornecer o conteúdo real.
// Mesma forma do DADOS do Casão, reutilizando o app.js.
const DADOS = {
  nome: "O Castelo",
  tipo: "Restaurante",
  slogan: null,
  telefone: "+351964894175",
  telefoneFmt: "+351 964 894 175",
  whatsapp: null,
  whatsappMsg: "Olá! Gostava de reservar uma mesa n'O Castelo.",
  redes: null,
  morada: { rua: null, cp: null, localidade: "Alvito" },   // rua/CP exatos a confirmar
  gps: { lat: 38.2577626, lng: -7.9921249 },               // Castelo de Alvito
  googleMapsUrl: "https://www.google.com/maps/place/Pousada+Castelo+de+Alvito/@38.2577626,-7.9921249,17z",
  rating: null,                   // a confirmar
  // Pequeno-almoço 08:00–10:00 · almoço 12:30–15:00 · jantar 19:30–22:00
  // Folga: domingo ao jantar, segunda e terça todo o dia.
  horarios: {
    segunda: null,
    terca:   null,
    quarta:  [["08:00","10:00"], ["12:30","15:00"], ["19:30","22:00"]],
    quinta:  [["08:00","10:00"], ["12:30","15:00"], ["19:30","22:00"]],
    sexta:   [["08:00","10:00"], ["12:30","15:00"], ["19:30","22:00"]],
    sabado:  [["08:00","10:00"], ["12:30","15:00"], ["19:30","22:00"]],
    domingo: [["08:00","10:00"], ["12:30","15:00"]]
  },
  reviews: [],                    // a confirmar
  historia: null,
  reservasGrupos: true,
  // Placeholders de curso (não são pratos inventados) - só para mostrar o estilo
  destaques: [
    "Entrada a confirmar",
    "Prato principal a confirmar",
    "Sobremesa a confirmar"
  ],
  // Ementa transcrita das fotos da carta (IMG_1628, 1629, 1631, 1632, 1633).
  // "descricao" = tradução inglesa que vem na carta; "grupo" = subtítulo (produtor dos vinhos).
  ementa: {
    "Entradas": [
      { nome: "Pão",       descricao: null, preco: 1,    meiaDose: null },
      { nome: "Manteiga",  descricao: null, preco: 1,    meiaDose: null },
      { nome: "Azeitonas", descricao: null, preco: 1,    meiaDose: null },
      { nome: "Queijo",    descricao: null, preco: 4.5,  meiaDose: null },
      { nome: "Presunto",  descricao: null, preco: 4.5,  meiaDose: null },
      { nome: "Torresmos", descricao: null, preco: 5,    meiaDose: null }
    ],
    "Peixe": [
      { nome: "Bacalhau à Barão",    descricao: "Cod with onions",                    preco: 22, meiaDose: null },
      { nome: "Sopa de Cação",       descricao: "Dogfish soup",                       preco: 16, meiaDose: null },
      { nome: "Bacalhau Espiritual", descricao: "Cod with prawns and vegs",           preco: 16, meiaDose: null },
      { nome: "Polvo à Lagareiro",   descricao: "Octopus in olive oil and garlic",    preco: 22, meiaDose: null }
    ],
    "Carnes": [
      { nome: "Bochechas de Porco Estufadas", descricao: "Braised pork cheeks",       preco: 16, meiaDose: null },
      { nome: "Secretos de Porco Preto",      descricao: "Iberico black pork",        preco: 20, meiaDose: null },
      { nome: "Vitela na Telha",              descricao: "Veal steak · preço para 2 pessoas", preco: 37, meiaDose: null },
      { nome: "Peito de Frango Grelhado",     descricao: "Grilled chicken breast",    preco: 18, meiaDose: null }
    ],
    // Na carta há anotações à mão nesta página (riscos, vistos, "Pão de Ló" a substituir o Tecolameco).
    // Ficam só as sobremesas sem risco; Bolo de Bolacha (5 €) e Toucinho do Céu (6 €) estavam marcados com X.
    "Sobremesas": [
      { nome: "Doce Fidalgo Conventual",   descricao: null, preco: 6,   meiaDose: null },
      { nome: "Manjar de Abade Conventual", descricao: null, preco: 6,  meiaDose: null },
      { nome: "Sericaia com Ameixa",       descricao: null, preco: 5,   meiaDose: null },
      { nome: "Pudim de Ovos",             descricao: null, preco: 5,   meiaDose: null },
      { nome: "Pão de Ló",                 descricao: null, preco: 6,   meiaDose: null },
      { nome: "Petit Gâteau au Chocolat",  descricao: null, preco: 4,   meiaDose: null },
      { nome: "Melão",                     descricao: null, preco: 2.5, meiaDose: null },
      { nome: "Abacaxi",                   descricao: null, preco: 2.5, meiaDose: null }
    ],
    "Vinhos brancos": [
      { grupo: "Herdade Figueirinha", nome: "N' Te Rales 2021",              descricao: null, preco: 22, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "Amnésia 2024",                  descricao: null, preco: 17, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "Tã Somente Chardonnay 2022",    descricao: null, preco: 37, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Baronia D' Alvito",                    descricao: null, preco: 31, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira Reserva \"A Bonança\" 2022", descricao: null, preco: 46, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira Antão Vaz 2024",            descricao: null, preco: 22, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vila dos Gamas \"A Partida\" 2025",    descricao: null, preco: 10, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Planalto",                             descricao: null, preco: 16, meiaDose: null },
      { grupo: "Herdade do Sobroso", nome: "Herdade do Sobroso 2024",        descricao: null, preco: 20, meiaDose: null },
      { grupo: "Adega Mayor",        nome: "Caiado 2025",                    descricao: null, preco: 15, meiaDose: null },
      { grupo: "Adega Cooperativa de Reguengos", nome: "Reguengos \"Carmin\" 2025", descricao: null, preco: 10, meiaDose: null },
      { grupo: "Herdade Grande",     nome: "Herdade Grande 2022",            descricao: null, preco: 31, meiaDose: null },
      { grupo: "Herdade Mingorra",   nome: "Mingorra 2024",                  descricao: null, preco: 18, meiaDose: null },
      { grupo: "Hortas Velhas",      nome: "Hortas Velhas 2024",             descricao: null, preco: 24, meiaDose: null },
      { grupo: "Quinta do Quetzal",  nome: "Quinta do Quetzal Arte",         descricao: null, preco: 38, meiaDose: null },
      { grupo: "Quinta do Quetzal",  nome: "Quetzal 2025",                   descricao: null, preco: 21, meiaDose: null },
      { grupo: "Vinhos verdes",      nome: "Muralhas 2022",                  descricao: null, preco: 14, meiaDose: null },
      { grupo: "Vinhos verdes",      nome: "Alvarinha Deu-la-Deu 2023",      descricao: null, preco: 14, meiaDose: null }
    ],
    "Vinhos tintos": [
      { grupo: "Casa Relvas", nome: "Herdade S. Miguel 2024",                descricao: null, preco: 16, meiaDose: null },
      { grupo: "Casa Relvas", nome: "De Za Sete 2023",                       descricao: null, preco: 99, meiaDose: null },
      { grupo: "Casa Relvas", nome: "Herdade S. Miguel \"Pé de Meia\" 2023", descricao: null, preco: 99, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Baronia D' Alvito",                    descricao: null, preco: 31, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vila dos Gama \"A Partida\" 2025",     descricao: null, preco: 10, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira Trincadeira 2023",          descricao: null, preco: 24, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira Syrah",                     descricao: null, preco: 24, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira \"A Bonança\" Reserva 2022", descricao: null, preco: 46, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira \"A Saudade\" 2024",        descricao: null, preco: 16, meiaDose: null },
      { grupo: "Adega Cooperativa Vidigueira", nome: "Vidigueira Alicante Bouschet",         descricao: null, preco: 24, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "N' Te Rales Reserva",           descricao: null, preco: 22, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "Figueirinha 2022",              descricao: null, preco: 16, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "Amnésia",                       descricao: null, preco: 17, meiaDose: null },
      { grupo: "Herdade Figueirinha", nome: "Tã Somente Reserva 2021",       descricao: null, preco: 57, meiaDose: null },
      { grupo: "Herdade Hortas Velhas", nome: "Hortas Velhas 2024",          descricao: null, preco: 24, meiaDose: null },
      { grupo: "Herdade do Sobroso",  nome: "Herdade do Sobroso 2024",       descricao: null, preco: 20, meiaDose: null },
      { grupo: "Adega Mayor",         nome: "Caiado",                        descricao: null, preco: 15, meiaDose: null },
      { grupo: "Adega Mayor",         nome: "Reserva 2023",                  descricao: null, preco: 24, meiaDose: null },
      { grupo: "Adega Cartuxa",       nome: "Cartuxa 2021",                  descricao: null, preco: 55, meiaDose: null },
      { grupo: "Adega Cartuxa",       nome: "Monte dos Pinheiros",           descricao: null, preco: 10, meiaDose: null },
      { grupo: "Adega Ravasqueira",   nome: "Ravasqueira \"Encantado\"",     descricao: null, preco: 16, meiaDose: null },
      { grupo: "Adega Ravasqueira",   nome: "Ravasqueira \"Seleção 2024\"",  descricao: null, preco: 12, meiaDose: null },
      { grupo: "Adega Cooperativa de Reguengos", nome: "Carmin 2024",              descricao: null, preco: 12, meiaDose: null },
      { grupo: "Adega Cooperativa de Reguengos", nome: "Terras de Monsaraz 2024",  descricao: null, preco: 12, meiaDose: null },
      { grupo: "Adega José Sousa",    nome: "José Sousa 2023",               descricao: null, preco: 18.5, meiaDose: null },
      { grupo: "Adega José Sousa",    nome: "Montado 2022",                  descricao: null, preco: 9,    meiaDose: null },
      { grupo: "Herdade da Mingorra", nome: "Mingorra 2024",                 descricao: null, preco: 19, meiaDose: null }
    ]
  },
  ementaNotas: {
    "Carnes": "Acompanhamentos: arroz árabe, salada e batata frita."
  },
  notaVinhos: null,               // a carta de vinhos já está na ementa: não mostrar a nota genérica
  vinhos: { tipo: "regional", lista: null },
  aConfirmar: [
    "Rua e código-postal exatos (já temos localidade Alvito + GPS)",
    "WhatsApp, se usarem",
    "Confirmar hora de fecho do jantar (assumido 22:00 a partir de '19:30 - 10')",
    "Ementa: confirmar sobremesas (Bolo de Bolacha e Toucinho do Céu estavam riscados; preço do Pão de Ló e do Manjar de Abade) e se há meias doses",
    "Pratos-destaque (3-4) e respetivas fotos",
    "Avaliações/nota do Google",
    "Fotos próprias: castelo/fachada, sala, pratos"
  ]
};
