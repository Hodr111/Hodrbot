import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { downloadAudio } from "../../../services/media-downloader.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "tik-tok-audio",
  description: "Faço o download de áudios de vídeos do TikTok",
  commands: [
    "tik-tok-audio",
    "tik-tok-mp3",
    "tik-audio",
    "tik-mp3",
    "ttk-audio",
    "ttk-mp3",
  ],
  usage: `${PREFIX}tik-tok-audio https://www.tiktok.com/@usuario/video/123456789`,

  handle: async ({
    sendAudioFromFile,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa enviar uma URL do TikTok!",
      );
    }

    if (!fullArgs.includes("tiktok.com")) {
      throw new WarningError("O link não é do TikTok!");
    }

    let audioPath = null;

    try {
      await sendWaitReact();

      audioPath = await downloadAudio(fullArgs);

      await sendSuccessReact();
      await sendAudioFromFile(audioPath);
    } catch (error) {
      await sendErrorReply(
        error?.message || "Não foi possível baixar o áudio do TikTok.",
      );
    } finally {
      if (audioPath) {
        removeFileIfExists(audioPath);
      }
    }
  },
};
