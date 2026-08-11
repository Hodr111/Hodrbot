import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import {
  getAudioFromUrl,
  formatDuration,
  formatViews,
  formatDate,
} from "../../../services/youtube.js";
import { removeFileIfExists } from "../../../utils/index.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "yt-mp3",
  description: "Faço o download de áudios do YouTube pelo link!",
  commands: ["yt-mp3", "youtube-mp3", "yt-audio", "youtube-audio", "mp3"],
  usage: `${PREFIX}yt-mp3 https://www.youtube.com/watch?v=mW8o_WDL91o`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendAudioFromFile,
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

    let audioPath = null;

    try {
      await sendWaitReact();

      const data = await getAudioFromUrl(url);

      if (!data) {
        await sendErrorReply("Não foi possível encontrar esse vídeo!");
        return;
      }

      audioPath = data.path;

      await sendSuccessReact();

      const caption = `*Título*: ${data.title}
*Canal*: ${data.channel}
*Visualizações*: ${formatViews(data.views)}
*Publicado em*: ${formatDate(data.uploadDate)}
*Duração*: ${formatDuration(data.duration)}`;

      if (data.thumbnail) {
        await sendImageFromURL(data.thumbnail, caption);
      }

      await sendAudioFromFile(audioPath);
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendErrorReply(
        error?.message || "Não foi possível baixar o áudio."
      );
    } finally {
      if (audioPath) {
        removeFileIfExists(audioPath);
      }
    }
  },
};
