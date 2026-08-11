import {
  isBlacklistActive,
  listBlacklistNumbers,
} from "../utils/database.js";
import { extractUserLid, onlyNumbers } from "../utils/index.js";
import { OWNER_LID } from "../config.js";
import { errorLog } from "../utils/logger.js";

export async function customMiddleware({
  socket,
  type,
  action,
  data,
  webMessage,
}) {
  if (type !== "participant" || action !== "add") {
    return;
  }

  const remoteJid = webMessage?.key?.remoteJid;

  if (!remoteJid?.endsWith("@g.us")) {
    return;
  }

  if (!isBlacklistActive(remoteJid)) {
    return;
  }

  try {
    const userLid = extractUserLid(data);

    if (!userLid || userLid === OWNER_LID) {
      return;
    }

    const metadata = await socket.groupMetadata(remoteJid);

    const participant = metadata.participants.find(
      (member) => member.id === userLid
    );

    if (!participant) {
      return;
    }

    if (
      participant.admin === "admin" ||
      participant.admin === "superadmin"
    ) {
      return;
    }

    const blacklist = listBlacklistNumbers(remoteJid);

    if (!blacklist.length) {
      return;
    }

    const possibleNumbers = [
      participant.phoneNumber,
      participant.id,
      participant.lid,
    ]
      .filter(Boolean)
      .map((value) => onlyNumbers(value));

    const blocked = blacklist.some((number) =>
      possibleNumbers.includes(onlyNumbers(number))
    );

    if (!blocked) {
      return;
    }

    await socket.groupParticipantsUpdate(
      remoteJid,
      [userLid],
      "remove"
    );

    await socket.sendMessage(remoteJid, {
      text: "🚫 Usuário removido automaticamente pela blacklist.",
    });
  } catch (error) {
    errorLog(`Erro na blacklist automática: ${error.message}`);
  }
}
