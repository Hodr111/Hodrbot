import { BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
import { DangerError, InvalidParameterError } from "../../errors/index.js";
import { onlyNumbers, getRandomName, removeFileIfExists } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "ban",
  description: "Removo um membro do grupo",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @marcar_membro

ou

${PREFIX}ban (mencionando uma mensagem)

Você também pode enviar um áudio com ${PREFIX}ban @membro na legenda.`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    isReply,
    isAudio,
    webMessage,
    downloadAudio,
    socket,
    remoteJid,
    replyLid,
    sendReply,
    userLid,
    sendSuccessReact,
    sendErrorReply,
    sendAudioFromFile,
  }) => {
    let audioPath = null;

    try {
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "Você precisa mencionar ou marcar um membro!",
        );
      }

      if (args.length && !args[0].includes("@")) {
        throw new InvalidParameterError(
          'Você precisa mencionar um membro com "@"!',
        );
      }

      const userId = args[0] ? `${onlyNumbers(args[0])}@lid` : null;

      const memberToRemoveLid = isReply ? replyLid : userId;

      if (!memberToRemoveLid) {
        throw new InvalidParameterError("Membro inválido!");
      }

      if (memberToRemoveLid === userLid) {
        throw new DangerError("Você não pode remover você mesmo!");
      }

      if (OWNER_LID && memberToRemoveLid === OWNER_LID) {
        throw new DangerError("Você não pode remover o dono do bot!");
      }

      if (BOT_LID && memberToRemoveLid === BOT_LID) {
        throw new DangerError("Você não pode me remover!");
      }

      // Se o comando vier junto com um áudio, salva o áudio temporariamente.
      if (isAudio) {
        audioPath = await downloadAudio(
          webMessage,
          getRandomName("mp3"),
        );
      }

      await socket.groupParticipantsUpdate(
        remoteJid,
        [memberToRemoveLid],
        "remove",
      );

      await sendSuccessReact();
      await sendReply("Membro removido com sucesso!");

      // Envia o áudio que veio junto com o comando.
      if (audioPath) {
        await sendAudioFromFile(audioPath);
      }
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));

      await sendErrorReply(
        `Ocorreu um erro ao remover o membro: ${error.message}`,
      );
    } finally {
      if (audioPath) {
        removeFileIfExists(audioPath);
      }
    }
  },
};
