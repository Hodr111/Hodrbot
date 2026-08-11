import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { downloadVideo } from "../../../services/media-downloader.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "facebook",
  description: "Faço o download de vídeos do Facebook",
  commands: ["facebook", "face", "fb"],
  usage: `${PREFIX}facebook https://www.facebook.com/reel/123456789012345`,

  handle: async ({
    sendVideoFromFile,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa enviar uma URL do Facebook!",
      );
    }

    await sendWaitReact();

    if (!fullArgs.includes("facebook.com") && !fullArgs.includes("fb.watch")) {
      throw new WarningError("O link não é do Facebook!");
    }

    let videoPath = null;

    try {
      videoPath = await downloadVideo(fullArgs);

      if (!videoPath) {
        await sendErrorReply("Nenhum resultado encontrado!");
        return;
      }

      await sendSuccessReact();
      await sendVideoFromFile(videoPath);
    } catch (error) {
      await sendErrorReply(
        error?.message || "Não foi possível baixar o vídeo.",
      );
    } finally {
      if (videoPath) {
        removeFileIfExists(videoPath);
      }
    }
  },
};
