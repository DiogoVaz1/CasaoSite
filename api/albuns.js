/* /api/albuns - álbuns do Catering, lidos do Cloudinary
   Cada subpasta de "catering/" (ex.: catering/Casamentos) é um álbum;
   as imagens dentro dela são as fotos. Devolve o formato de catering-dados.js:
     [{ id, titulo, capa, fotos: [{ src, thumb }] }]
   Variáveis de ambiente (Vercel): CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET */
'use strict';

const PASTA_RAIZ = 'catering';
const T_CAPA  = 'c_fill,g_auto,w_600,h_600,f_auto,q_auto';
const T_THUMB = 'c_fill,g_auto,w_400,h_400,f_auto,q_auto';
const T_GRANDE = 'c_limit,w_1800,f_auto,q_auto';

const semAcentos = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const slug = s => semAcentos(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
/* "01 - Casamentos" -> "Casamentos" (o prefixo numérico só serve para ordenar) */
const tituloDe = pasta => pasta.replace(/^\d+\s*[-_.]\s*/, '').replace(/_/g, ' ').trim() || pasta;
const comparar = (a, b) => a.localeCompare(b, 'pt', { numeric: true, sensitivity: 'base' });

/* Insere a transformação no URL de entrega: .../image/upload/<t>/v123/... */
const comTransf = (url, t) => url.replace('/upload/', '/upload/' + t + '/');

function agrupar(recursos) {
  const pastas = new Map();
  for (const r of recursos) {
    const pasta = r.asset_folder || '';
    const partes = pasta.split('/');
    if (partes[0] !== PASTA_RAIZ || partes.length < 2 || !partes[1]) continue;
    const nome = partes[1];                       // só o 1.º nível dentro de catering/
    if (!pastas.has(nome)) pastas.set(nome, []);
    pastas.get(nome).push(r);
  }
  return [...pastas.keys()].sort(comparar).map(nome => {
    const fotos = pastas.get(nome)
      .sort((a, b) => comparar(a.display_name || a.public_id, b.display_name || b.public_id))
      .map(r => ({ src: comTransf(r.secure_url, T_GRANDE), thumb: comTransf(r.secure_url, T_THUMB) }));
    return {
      id: slug(tituloDe(nome)) || slug(nome),
      titulo: tituloDe(nome),
      capa: comTransf(pastas.get(nome)[0].secure_url, T_CAPA),
      fotos
    };
  });
}

async function lerRecursos(nuvem, chave, segredo) {
  const auth = 'Basic ' + Buffer.from(chave + ':' + segredo).toString('base64');
  const recursos = [];
  let cursor = null;
  do {
    const r = await fetch(`https://api.cloudinary.com/v1_1/${nuvem}/resources/search`, {
      method: 'POST',
      headers: { Authorization: auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expression: 'resource_type:image',
        max_results: 500,
        sort_by: [{ created_at: 'asc' }],
        ...(cursor ? { next_cursor: cursor } : {})
      })
    });
    if (!r.ok) throw new Error('Cloudinary ' + r.status + ': ' + (await r.text()).slice(0, 200));
    const j = await r.json();
    recursos.push(...j.resources);
    cursor = j.next_cursor;
  } while (cursor);
  return recursos;
}

async function handler(req, res) {
  const nuvem = process.env.CLOUDINARY_CLOUD_NAME;
  const chave = process.env.CLOUDINARY_API_KEY;
  const segredo = process.env.CLOUDINARY_API_SECRET;
  if (!nuvem || !chave || !segredo) {
    res.status(500).json({ erro: 'Cloudinary não configurado' });
    return;
  }
  try {
    const albuns = agrupar(await lerRecursos(nuvem, chave, segredo));
    // 5 min em cache na CDN; depois serve a versão antiga enquanto atualiza
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
    res.status(200).json(albuns);
  } catch (e) {
    console.error(e);
    res.status(502).json({ erro: 'Não foi possível ler os álbuns' });
  }
}

module.exports = handler;
module.exports.agrupar = agrupar;
