import { InvalidParameterError } from "../../errors/index.js";
import { onlyNumbers } from "../../utils/index.js";
import {
  addBlacklistNumber,
  removeBlacklistNumber,
  listBlacklistNumbers,
  isBlacklistActive,
  setBlacklistActive,
} from "../../utils/database.js";
import { PREFIX } from "../../config.js";

export default {
  name: "blacklist",
  description: "Gerencia a blacklist automática do grupo.",
  commands: ["blacklist", "bl"],
  usage: `${PREFIX}blacklist número | remover número | lista | 1/0`,

  handle: async ({ args, remoteJid, sendReply }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        `Use:\n${PREFIX}blacklist 5511999999999\n${PREFIX}blacklist remover 5511999999999\n${PREFIX}blacklist lista\n${PREFIX}blacklist 1/0`
      );
    }

    const action = args[0].toLowerCase();

    if (action === "1" || action === "on") {
      setBlacklistActive(remoteJid, true);
      await sendReply("🛡️ Blacklist automática ativada neste grupo.");
      return;
    }

    if (action === "0" || action === "off") {
      setBlacklistActive(remoteJid, false);
      await sendReply("🛡️ Blacklist automática desativada neste grupo.");
      return;
    }

    if (action === "lista" || action === "list") {
      const numbers = listBlacklistNumbers(remoteJid);
      const status = isBlacklistActive(remoteJid)
        ? "ATIVADA"
        : "DESATIVADA";

      if (!numbers.length) {
        await sendReply(
          `📋 *BLACKLIST*\n\nStatus: *${status}*\n\nNenhum número cadastrado.`
        );
        return;
      }

      await sendReply(
        `📋 *BLACKLIST*\n\nStatus: *${status}*\n\n` +
        numbers.map((number, index) => `${index + 1}. ${number}`).join("\n")
      );
      return;
    }

    if (action === "remover" || action === "remove") {
      const number = onlyNumbers(args[1] || "");

      if (!number) {
        throw new InvalidParameterError(
          `Informe o número.\nExemplo: ${PREFIX}blacklist remover 5511999999999`
        );
      }

      const removed = removeBlacklistNumber(remoteJid, number);

      await sendReply(
        removed
          ? `✅ Número *${number}* removido da blacklist.`
          : `⚠️ O número *${number}* não estava na blacklist.`
      );
      return;
    }

    const number = onlyNumbers(action);

    if (!number || number.length < 8) {
      throw new InvalidParameterError(
        `Número inválido.\nExemplo: ${PREFIX}blacklist 5511999999999`
      );
    }

    addBlacklistNumber(remoteJid, number);

    await sendReply(
      `🚫 Número *${number}* adicionado à blacklist.`
    );
  },
};
