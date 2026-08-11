import { setUnlimited } from "../../utils/rental.js";

export default {
  name: "ilimitado",
  description: "Deixa o aluguel do grupo ilimitado.",
  commands: ["ilimitado"],
  usage: "/ilimitado",

  handle: async ({
    remoteJid,
    sendSuccessReply,
  }) => {
    setUnlimited(remoteJid);

    await sendSuccessReply(
      `♾️ *ALUGUEL ILIMITADO ATIVADO!*\n\n` +
      `🇯🇵 Este grupo agora possui acesso ilimitado ao Höðrbot.\n\n` +
      `🔓 Comandos: *Liberados*\n` +
      `⏳ Expiração: *Nunca*\n` +
      `💰 Renovação: *Desnecessária*`
    );
  },
};
