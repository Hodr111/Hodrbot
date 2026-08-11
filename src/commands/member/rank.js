import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { getMessageRank } from "../../utils/database.js";
import { isGroup } from "../../utils/index.js";

export default {
  name: "rank",
  description: "Mostra os membros mais ativos do grupo",
  commands: ["rank", "ranking", "rankativo"],
  usage: `${PREFIX}rank ou ${PREFIX}rank 10`,

  handle: async ({
    args,
    remoteJid,
    sendErrorReply,
    sendSuccessReact,
  }) => {
    if (!isGroup(remoteJid)) {
      throw new InvalidParameterError(
        "Este comando só pode ser usado em grupo."
      );
    }

    const limit = Math.min(
      Math.max(parseInt(args[0], 10) || 10, 1),
      10
    );

    try {
      const ranking = getMessageRank(remoteJid, limit);

      if (!ranking.length) {
        await sendSuccessReact();

        return sendErrorReply(
          "📊 Ainda não há mensagens registradas para montar o ranking."
        );
      }

      const medals = ["🥇", "🥈", "🥉"];

      const mentions = ranking.map((item) => item.memberId);

      const linhas = ranking.map((item) => {
        const medal =
          medals[item.position - 1] || `🏅 ${item.position}º`;

        const nome = `@${item.memberId.split("@")[0]}`;

        const palavra =
          item.messages === 1 ? "mensagem" : "mensagens";

        return [
          `┋°‧․ˑ🇯🇵⃟⠥ʿ⇢ ${medal} *${nome}*`,
          `┋°‧․ˑ🇯🇵⃟⠥ʿ⇢ 💬 ${item.messages} ${palavra}`,
        ].join("\n");
      });

      const mensagem = `
🤖

⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝑹𝑨𝑵𝑲 𝑨𝑻𝑰𝑽𝑶﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
┣┉∴°𝄪⠡∝┅┈°.ᩚ⠤⠩⠥⠠⠦⠫⠰⠰
┋°‧․ˑ🇯🇵⃟⠥ʿ⇢ *Membros mais ativos*
┋°‧․ˑ🇯🇵⃟⠥ʿ⇢ Ranking baseado nas mensagens
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
╎
┏┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┓
┋𝄪°⠡⸗𝄪﹝𝐓𝐎𝐏 ${ranking.length}﹞
┣┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
${linhas.join("\n┋\n")}
┗┉∴°𝄪⸗.⠡∝┅┈°.ᰔᩚ.°┈┅∝⠡.⸗𝄪°∴┉┛
`;

      await sendSuccessReact();

      return {
        text: mensagem.trim(),
        mentions,
      };
    } catch (error) {
      console.error(error);

      await sendErrorReply(
        "❌ Ocorreu um erro ao carregar o ranking."
      );
    }
  },
};
