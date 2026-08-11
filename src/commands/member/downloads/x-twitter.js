import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { downloadVideo } from "../../../services/media-downloader.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "x-twitter",
  description: "Faço o download de vídeos ou imagens do X (Twitter)",
  commands: ["xtwitter", "twitter", "x"],
  usage: `${PREFIX}xtwitter https://x.com/usuario/status/1234567890`,

  handle: async ({
    sendVideoFromFile,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa enviar uma URL do X (Twitter)!",
      );
    }

    if (!fullArgs.includes("x.com") && !fullArgs.includes("twitter.com")) {
      throw new WarningError("O link não é do X (Twitter)!");
    }

    let videoPath = null;

    try {
      await sendWaitReact();

      videoPath = await downloadVideo(fullArgs);

      if (!videoPath) {
        await sendErrorReply("Nenhum resultado encontrado!");
        return;
      }

      await sendSuccessReact();
      await sendVideoFromFile(videoPath);
    } catch (error) {
      await sendErrorReply(
        error?.message || "Não foi possível baixar o vídeo do X.",
      );
    } finally {
      if (videoPath) {
        removeFileIfExists(videoPath);
      }
    }
  },
};
