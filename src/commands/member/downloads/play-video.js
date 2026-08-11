import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import {
  getVideoFromSearch,
  formatDuration,
} from "../../../services/youtube.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "play-video",
  description: "Faço o download de vídeos do YouTube",
  commands: ["play-video", "pv"],
  usage: `${PREFIX}play-video MC Hariel`,

  handle: async ({
    sendVideoFromFile,
    sendImageFromURL,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa me dizer o que deseja buscar!",
      );
    }

    if (fullArgs.includes("http://") || fullArgs.includes("https://")) {
      throw new InvalidParameterError(
        `Você não pode usar links para baixar vídeos! Use ${PREFIX}yt-mp4 link`,
      );
    }

    let videoPath = null;

    try {
      await sendWaitReact();

      const data = await getVideoFromSearch(fullArgs);

      if (!data) {
        await sendErrorReply("Nenhum resultado encontrado!");
        return;
      }

      videoPath = data.path;

      await sendSuccessReact();

      if (data.thumbnail) {
        await sendImageFromURL(
          data.thumbnail,
          `*🎬 Título:* ${data.title}

*📺 Canal:* ${data.channel || "Desconhecido"}
*⏱️ Duração:* ${formatDuration(data.duration)}`,
        );
      }

      await sendVideoFromFile(videoPath);

    } catch (error) {
      console.error("[PLAY-VIDEO] ERRO:", error);
      console.error("[PLAY-VIDEO] STDERR:", error?.stderr || "");

      await sendErrorReply(
        error?.stderr || error?.message || "Não foi possível baixar o vídeo.",
      );
    } finally {
      if (videoPath) {
        removeFileIfExists(videoPath);
      }
    }
  },
};
