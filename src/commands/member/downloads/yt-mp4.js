import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import { getVideoFromUrl, formatDuration } from "../../../services/youtube.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "yt-mp4",
  description: "Faço o download de vídeos do YouTube pelo link!",
  commands: ["yt-mp4", "youtube-mp4", "yt-video", "youtube-video", "mp4"],
  usage: `${PREFIX}yt-mp4 https://www.youtube.com/watch?v=mW8o_WDL91o`,

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
        "Você precisa enviar uma URL do YouTube!"
      );
    }

    const url = fullArgs.trim();

    if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(url)) {
      throw new WarningError("O link não é do YouTube!");
    }

    let videoPath = null;

    try {
      await sendWaitReact();

      const data = await getVideoFromUrl(url);

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

*📺 Canal:* ${data.channel?.name || data.channel || "Desconhecido"}
*⏱️ Duração:* ${formatDuration(data.duration)}`
      );
      }

      await sendVideoFromFile(videoPath);
    } catch (error) {
      await sendErrorReply(
        error?.message || "Não foi possível baixar o vídeo."
      );
    } finally {
      if (videoPath) {
        removeFileIfExists(videoPath);
      }
    }
  },
};
