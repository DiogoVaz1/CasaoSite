# O Casão - Guia do site

Obrigado por confiar em nós o site do **O Casão**. Este guia explica como pedir alterações e o que está incluído.

## Como pedir alterações

Para manter tudo organizado e rápido, **as alterações são pedidas por um único canal** (WhatsApp/email combinado consigo). Basta dizer o que quer mudar, por exemplo:

- "Adicionar prato X à ementa, na categoria Carne"
- "Atualizar o preço da sericaia para 4,50 €"
- "Mudar o horário de domingo"
- "Trocar a foto da entrada do site"

Não precisa de perceber nada de informática. Eu trato do resto.

## Como adicionar fotos ao Catering

### Pelo telemóvel (o mais simples)

Abrir a página **/fotos** do site (ex.: `ocasao.pt/fotos`; não está ligada a nenhum botão, é uma página reservada).

1. Escrever a palavra-passe.
2. Escolher o álbum, ou **＋ Álbum novo…** e escrever o nome (ex.: *Casamento da Ana*; o nome é o título que aparece no site).
3. Tocar em **Escolher fotos do telemóvel** e selecionar as fotos da galeria.
4. Tocar em **Enviar fotos** e esperar que todas fiquem a verde. Se alguma falhar, tocar outra vez em **Enviar fotos**: só reenvia as que faltam.
5. Em poucos minutos o site mostra as fotos novas. A primeira foto (por ordem de nome) é a capa do álbum.

A palavra-passe fica guardada na Vercel (variável `UPLOAD_PASSWORD`); para a mudar, altera-se lá e faz-se novo deploy.

### Pelo computador (Cloudinary), para apagar ou reorganizar

As fotos ficam no **Cloudinary** (cloudinary.com → Media Library → pasta **catering**). Cada álbum é uma pasta. É aí que se **apagam** fotos ou álbuns e se mudam nomes (a página /fotos só adiciona).

Dica: para escolher a ordem dos álbuns, começar o nome por um número (*01 - Casamentos*, *02 - Batizados*); o número não aparece no site.

## O que a avença inclui

- Atualizações de **ementa, preços e horários** sempre que precisar.
- Pequenos ajustes de texto e fotos.
- Manutenção técnica do site (estar sempre online e rápido).
- O site continua a aparecer bem no Google e no telemóvel.

## O que ainda falta para a versão final

Esta é uma **primeira versão (demo)**. Para ficar completa, precisamos de si:

1. **Preços** de todos os pratos.
2. **Fotos próprias** - fachada, sala e 4 a 6 pratos (as imagens atuais são provisórias).
3. **Reservas/grupos** - confirmar a mensagem.
4. (Opcional) Uma ou duas frases sobre a **história da casa** e quem está na cozinha.
5. (Opcional) **WhatsApp** - se quiser um botão de WhatsApp além do telefone.

---
*Site por Diogo Vaz.*
