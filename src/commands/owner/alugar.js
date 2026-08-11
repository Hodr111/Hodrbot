import { PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import {
  getRental,
  getRentalDaysLeft,
  getRentalExpiration,
  removeRental,
  setRental,
} from "../../utils/rental.js";

export default {
  name: "alugar",
  description: "Define o período de aluguel do bot no grupo.",
  commands: ["alugar"],
  usage: `${PREFIX}alugar 30`,

  handle: async ({
    remoteJid,
    fullArgs,
    sendReply,
    sendSuccessReply,
  }) => {
    if (!fullArgs.length) {
      const rental = getRental(remoteJid);

      if (!rental) {
        await sendReply(
          "⚠️ Este grupo não possui aluguel configurado."
        );
        return;
      }

      const days = getRentalDaysLeft(remoteJid);
      const expiration = getRentalExpiration(remoteJid);

      await sendReply(
        `📦 *Aluguel do grupo*\n\n` +
        `⏳ Dias restantes: *${days}*\n` +
        `📅 Vencimento: *${expiration.toLocaleString("pt-BR")}*`
      );

      return;
    }

    const days = Number(fullArgs.trim());

    if (!Number.isInteger(days) || days < 0) {
      throw new InvalidParameterError(
        `Use: ${PREFIX}alugar 7\n` +
        `Exemplo: ${PREFIX}alugar 30`
      );
    }

    if (days === 0) {
      const removed = removeRental(remoteJid);

      await sendReply(
        removed
          ? "🗑️ Aluguel removido deste grupo."
          : "⚠️ Este grupo não possuía aluguel."
      );

      return;
    }

    const rental = setRental(remoteJid, days);
    const expiration = new Date(rental.expiresAt);

    await sendSuccessReply(
      `✅ *Aluguel ativado!*\n\n` +
      `⏳ Duração: *${days} dias*\n` +
      `📅 Vencimento: *${expiration.toLocaleString("pt-BR")}*`
    );
  },
};
