import { removeUnlimited } from "../../utils/rental.js";

export default {
  name: "desilimitado",
  description: "Remove o acesso ilimitado do grupo.",
  commands: ["desilimitado"],
  usage: "/desilimitado",

  handle: async ({
    remoteJid,
    sendReply,
  }) => {
    const removed = removeUnlimited(remoteJid);

    await sendReply(
      removed
        ? "✅ O acesso ilimitado foi removido deste grupo."
        : "⚠️ Este grupo não estava configurado como ilimitado."
    );
  },
};
