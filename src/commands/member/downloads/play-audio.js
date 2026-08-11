import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import {
  getAudioFromSearch,
  formatDuration,
  formatViews,
  formatDate,
} from "../../../services/youtube.js";
import { removeFileIfExists } from "../../../utils/index.js";

export default {
  name: "play-audio",
  description: "Faço o download de músicas do YouTube",
  commands: ["play-audio", "play", "pa"],
  usage: `${PREFIX}play-audio MC Hariel`,

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
    if (!fullArgs) {
      throw new InvalidParameterError(
        "Você precisa me dizer o que deseja buscar!",
      );
    }

    let audioPath = null;

    try {
      await sendWaitReact();

      const data = await getAudioFromSearch(fullArgs);

      if (!data) {
        await sendErrorReply("Nenhum resultado encontrado!");
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
      await sendErrorReply(
        error?.message || "Não foi possível baixar o áudio.",
      );
    } finally {
      if (audioPath) {
        removeFileIfExists(audioPath);
      }
    }
  },
};
