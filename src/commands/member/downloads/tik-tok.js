import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { downloadVideo } from "../../../services/media-downloader.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "tik-tok",
  description: "Faço o download de vídeos do TikTok",
  commands: ["tik-tok", "ttk", "tik"],
  usage: `${PREFIX}tik-tok https://www.tiktok.com/@usuario/video/123456789`,
  handle: async ({
    sendVideoFromFile,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa enviar uma URL do TikTok!"
      );
    }

    if (!fullArgs.includes("tiktok.com") && !fullArgs.includes("vm.tiktok.com")) {
      throw new WarningError("O link não é do TikTok!");
    }

    let filePath = null;

    try {
      await sendWaitReact();

      filePath = await downloadVideo(fullArgs);

      if (!filePath) {
        await sendErrorReply("Nenhum resultado encontrado!");
        return;
      }

      await sendSuccessReact();
      await sendVideoFromFile(filePath);
    } catch (error) {
      console.error("[TikTok]", error);
      await sendErrorReply(
        error?.message || "Não foi possível baixar o vídeo do TikTok."
      );
    } finally {
      if (filePath) {
        removeFileIfExists(filePath);
      }
    }
  },
};
