// Dados d'O Castelo — placeholders até o cliente fornecer o conteúdo real.
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
  // Placeholders de curso (não são pratos inventados) — só para mostrar o estilo
  destaques: [
    "Entrada a confirmar",
    "Prato principal a confirmar",
    "Sobremesa a confirmar"
  ],
  ementa: {
    "Entradas":   [ { nome: "A confirmar", descricao: null, preco: null, meiaDose: null } ],
    "Carnes":     [ { nome: "A confirmar", descricao: null, preco: null, meiaDose: null } ],
    "Peixe":      [ { nome: "A confirmar", descricao: null, preco: null, meiaDose: null } ],
    "Sobremesas": [ { nome: "A confirmar", descricao: null, preco: null, meiaDose: null } ]
  },
  vinhos: { tipo: "regional", lista: null },
  aConfirmar: [
    "Rua e código-postal exatos (já temos localidade Alvito + GPS)",
    "WhatsApp, se usarem",
    "Confirmar hora de fecho do jantar (assumido 22:00 a partir de '19:30 - 10')",
    "Ementa real: categorias, pratos, preços e meias doses",
    "Pratos-destaque (3-4) e respetivas fotos",
    "Avaliações/nota do Google",
    "Fotos próprias: castelo/fachada, sala, pratos"
  ]
};
