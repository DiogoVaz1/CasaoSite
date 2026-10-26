/* /api/assinar - assina uploads de fotos para o Cloudinary (página /fotos)
   POST { password, verificar: true }       -> { ok: true }                    (só confirma a palavra-passe)
   POST { password, pasta: "Casamentos" }   -> parâmetros assinados para enviar fotos para catering/Casamentos
   O API secret nunca sai daqui. A assinatura só serve para: fotos (allowed_formats), a pasta pedida e ~1 hora.
   Variáveis de ambiente (Vercel): CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, UPLOAD_PASSWORD */
'use strict';

const crypto = require('crypto');

const PASTA_RAIZ = 'catering';
const FORMATOS = 'jpg,jpeg,png,heic,webp';
const PASTA_VALIDA = /^[\p{L}\p{N}][\p{L}\p{N} _.\-]{0,59}$/u;   // sem "/", "&", "=", "," etc.
const ESPERA_ERRO_MS = 700;

const sha256 = s => crypto.createHash('sha256').update(String(s)).digest();
const iguais = (a, b) => crypto.timingSafeEqual(sha256(a), sha256(b));
const esperar = ms => new Promise(r => setTimeout(r, ms));

/* Assinatura do Cloudinary: params ordenados por nome, "k=v" unidos por "&", + secret, SHA-1 */
function assinar(params, segredo) {
  const texto = Object.keys(params).sort().map(k => k + '=' + params[k]).join('&');
  return crypto.createHash('sha1').update(texto + segredo).digest('hex');
}

function lerCorpo(req) {
  const b = req.body;
  if (b && typeof b === 'object') return b;
  try { return JSON.parse(b || '{}'); } catch (e) { return {}; }
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ erro: 'Método não permitido' });
    return;
  }

  const nuvem = process.env.CLOUDINARY_CLOUD_NAME;
  const chave = process.env.CLOUDINARY_API_KEY;
  const segredo = process.env.CLOUDINARY_API_SECRET;
  const palavraPasse = process.env.UPLOAD_PASSWORD;
  if (!nuvem || !chave || !segredo || !palavraPasse) {
    res.status(500).json({ erro: 'Envio de fotos não configurado' });
    return;
  }

  const corpo = lerCorpo(req);
  if (typeof corpo.password !== 'string' || !iguais(corpo.password, palavraPasse)) {
    await esperar(ESPERA_ERRO_MS);                // trava tentativas em massa
    res.status(401).json({ erro: 'Palavra-passe errada' });
    return;
  }

  if (corpo.verificar) {
    res.status(200).json({ ok: true });
    return;
  }

  const pasta = typeof corpo.pasta === 'string' ? corpo.pasta.trim() : '';
  if (!PASTA_VALIDA.test(pasta)) {
    res.status(400).json({ erro: 'Nome de álbum inválido' });
    return;
  }

  const params = {
    allowed_formats: FORMATOS,
    asset_folder: PASTA_RAIZ + '/' + pasta,
    timestamp: Math.floor(Date.now() / 1000)
  };
  res.status(200).json({
    url: `https://api.cloudinary.com/v1_1/${nuvem}/image/upload`,
    api_key: chave,
    signature: assinar(params, segredo),
    ...params
  });
}

module.exports = handler;
module.exports.assinar = assinar;
module.exports.PASTA_VALIDA = PASTA_VALIDA;
