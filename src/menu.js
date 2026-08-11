/**
 * Menu do bot
 *
 * @author Dev Gui
 */
import pkg from "../package.json" with { type: "json" };
import { BOT_NAME, BOT_LID, OWNER_LID } from "./config.js";
import { getPrefix } from "./utils/database.js";
import { readMore } from "./utils/index.js";

export function menuMessage(groupJid, userLid) {
  const isOwner = userLid === OWNER_LID || userLid === BOT_LID;
  const date = new Date();
  const prefix = getPrefix(groupJid);

  const ownerMenu = isOwner ? `⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝑰𝑵𝑭𝑶𝑺 𝑩𝑶𝑻﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┣┉∴°𝄪⠡∝┅┈°.ᩚ⠤⠩⠥⠠⠦⠫⠰⠰
┋🇯🇵⃟⠥ʿ⇢ *Bot*: ${BOT_NAME}
┋🇯🇵⃟⠥ʿ⇢ *Data*: ${date.toLocaleDateString("pt-br")}
┋🇯🇵⃟⠥ʿ⇢ *Hora*: ${date.toLocaleTimeString("pt-br")}
┋🇯🇵⃟⠥ʿ⇢ *Prefixo*: ${prefix}
┋🇯🇵⃟⠥ʿ⇢ *Versão*: ${pkg.version}
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐃𝐎𝐍𝐎﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢ /exec
┋🇯🇵⃟⠥ʿ⇢ /testing
┋🇯🇵⃟⠥ʿ⇢ /ilimitado
┋🇯🇵⃟⠥ʿ⇢ /desilimitado
┋🇯🇵⃟⠥ʿ⇢ /alugar
┋🇯🇵⃟⠥ʿ⇢ /addvideo
┋🇯🇵⃟⠥ʿ⇢ /get-group-id
┋🇯🇵⃟⠥ʿ⇢ /off
┋🇯🇵⃟⠥ʿ⇢ /on
┋🇯🇵⃟⠥ʿ⇢ /set-menu-image
┋🇯🇵⃟⠥ʿ⇢ /set-prefix
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐀𝐃𝐌𝐈𝐍𝐒﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢${prefix}abrir
┋🇯🇵⃟⠥ʿ⇢${prefix}add-auto-responder
┋🇯🇵⃟⠥ʿ⇢${prefix}agendar-mensagem
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-audio (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-call (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-document (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-event (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-image (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-link (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-lottie-sticker (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-payment (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-product (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-sticker (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-status-grupo (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-video (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}auto-responder (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}auto-sticker (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}ban
┋🇯🇵⃟⠥ʿ⇢${prefix}delete
┋🇯🇵⃟⠥ʿ⇢${prefix}delete-auto-responder
┋🇯🇵⃟⠥ʿ⇢${prefix}exit (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}fechar
┋🇯🇵⃟⠥ʿ⇢${prefix}hidetag
┋🇯🇵⃟⠥ʿ⇢${prefix}hide-tag
┋🇯🇵⃟⠥ʿ⇢${prefix}limpar
┋🇯🇵⃟⠥ʿ⇢${prefix}link-grupo
┋🇯🇵⃟⠥ʿ⇢${prefix}list-auto-responder
┋🇯🇵⃟⠥ʿ⇢${prefix}mute
┋🇯🇵⃟⠥ʿ⇢${prefix}only-admin (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}promover
┋🇯🇵⃟⠥ʿ⇢${prefix}rebaixar
┋🇯🇵⃟⠥ʿ⇢${prefix}revelar
┋🇯🇵⃟⠥ʿ⇢${prefix}saldo
┋🇯🇵⃟⠥ʿ⇢${prefix}set-proxy
┋🇯🇵⃟⠥ʿ⇢${prefix}unmute
┋🇯🇵⃟⠥ʿ⇢${prefix}bem-vindo (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-bot (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}anti-mention (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}advertencia @membro
┋🇯🇵⃟⠥ʿ⇢${prefix}afk
┋🇯🇵⃟⠥ʿ⇢${prefix}block-wpp
┋🇯🇵⃟⠥ʿ⇢${prefix}set-name
┋🇯🇵⃟⠥ʿ⇢${prefix}unwarn
┋🇯🇵⃟⠥ʿ⇢${prefix}warn-reactivate
┋🇯🇵⃟⠥ʿ⇢${prefix}antiflood (1/0)
┋🇯🇵⃟⠥ʿ⇢${prefix}blacklist número | remover | lista | 1/0
┋🇯🇵⃟⠥ʿ⇢${prefix}msg-horario
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐏𝐑𝐈𝐍𝐂𝐈𝐏𝐀𝐋﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢${prefix}attp
┋🇯🇵⃟⠥ʿ⇢${prefix}brat
┋🇯🇵⃟⠥ʿ⇢${prefix}bratvid
┋🇯🇵⃟⠥ʿ⇢${prefix}cep
┋🇯🇵⃟⠥ʿ⇢${prefix}exemplos-de-mensagens
┋🇯🇵⃟⠥ʿ⇢${prefix}fake-chat
┋🇯🇵⃟⠥ʿ⇢${prefix}gerar-link
┋🇯🇵⃟⠥ʿ⇢${prefix}info
┋🇯🇵⃟⠥ʿ⇢${prefix}meu-lid
┋🇯🇵⃟⠥ʿ⇢${prefix}perfil
┋🇯🇵⃟⠥ʿ⇢${prefix}rankativo
┋🇯🇵⃟⠥ʿ⇢${prefix}ping
┋🇯🇵⃟⠥ʿ⇢${prefix}raw-message
┋🇯🇵⃟⠥ʿ⇢${prefix}rename
┋🇯🇵⃟⠥ʿ⇢${prefix}removebg
┋🇯🇵⃟⠥ʿ⇢${prefix}sticker
┋🇯🇵⃟⠥ʿ⇢${prefix}suporte
┋🇯🇵⃟⠥ʿ⇢${prefix}to-gif
┋🇯🇵⃟⠥ʿ⇢${prefix}to-image
┋🇯🇵⃟⠥ʿ⇢${prefix}transcrever
${prefix}to-mp3
┋🇯🇵⃟⠥ʿ⇢${prefix}ttp
┋🇯🇵⃟⠥ʿ⇢${prefix}yt-search
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐒﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢${prefix}facebook — baixa vídeo do Facebook
┋🇯🇵⃟⠥ʿ⇢${prefix}instagram — baixa mídia do Instagram
┋🇯🇵⃟⠥ʿ⇢${prefix}pinterest — baixa mídia do Pinterest
┋🇯🇵⃟⠥ʿ⇢${prefix}tik-tok — baixa vídeo do TikTok
┋🇯🇵⃟⠥ʿ⇢${prefix}tik-tok-audio — baixa apenas o áudio do TikTok
┋🇯🇵⃟⠥ʿ⇢${prefix}xtwitter — baixa mídia do X/Twitter
┋🇯🇵⃟⠥ʿ⇢${prefix}play-audio — pesquisa e baixa áudio do YouTube
┋🇯🇵⃟⠥ʿ⇢${prefix}play-video — pesquisa e baixa vídeo do YouTube
┋🇯🇵⃟⠥ʿ⇢${prefix}yt-mp3 — baixa áudio do YouTube por link
┋🇯🇵⃟⠥ʿ⇢${prefix}yt-mp4 — baixa vídeo do YouTube por link
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐁𝐑𝐈𝐍𝐂𝐀𝐃𝐄𝐈𝐑𝐀𝐒﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢${prefix}abracar
┋🇯🇵⃟⠥ʿ⇢${prefix}beijar
┋🇯🇵⃟⠥ʿ⇢${prefix}dado
┋🇯🇵⃟⠥ʿ⇢${prefix}jantar
┋🇯🇵⃟⠥ʿ⇢${prefix}lutar
┋🇯🇵⃟⠥ʿ⇢${prefix}matar
┋🇯🇵⃟⠥ʿ⇢${prefix}tapa
${prefix}socar
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐂𝐀𝐍𝐕𝐀𝐒﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┋🇯🇵⃟⠥ʿ⇢${prefix}blur
┋🇯🇵⃟⠥ʿ⇢${prefix}cadeia
┋🇯🇵⃟⠥ʿ⇢${prefix}contraste
┋🇯🇵⃟⠥ʿ⇢${prefix}espelhar
┋🇯🇵⃟⠥ʿ⇢${prefix}gray
┋🇯🇵⃟⠥ʿ⇢${prefix}inverter
┋🇯🇵⃟⠥ʿ⇢${prefix}pixel
┋🇯🇵⃟⠥ʿ⇢${prefix}rip
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛` : "";

  return ownerMenu;
}
