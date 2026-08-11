import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { downloadVideo } from "../../../services/media-downloader.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "instagram",
  description: "Faço o download de vídeos/reels do Instagram",
  commands: ["instagram", "ig", "inst", "insta"],
  usage: `${PREFIX}instagram https://www.instagram.com/reel/Cx789012345/`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendVideoFromFile,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs?.length) {
      throw new InvalidParameterError(
        "Você precisa enviar uma URL do Instagram!",
      );
    }

    if (!fullArgs.includes("instagram.com")) {
      throw new WarningError("O link não é do Instagram!");
    }

    let videoPath = null;

    try {
      await sendWaitReact();

      videoPath = await downloadVideo(fullArgs);

      if (!videoPath) {
        await sendErrorReply("Nenhum vídeo encontrado!");
        return;
      }

      await sendSuccessReact();

      await sendVideoFromFile(videoPath);
    } catch (error) {
      await sendErrorReply(
        error?.message || "Não foi possível baixar o vídeo do Instagram.",
      );
    } finally {
      if (videoPath) {
        removeFileIfExists(videoPath);
      }
    }
  },
};
