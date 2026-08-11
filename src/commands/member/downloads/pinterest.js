import { delay } from "baileys";
import { PREFIX } from "../../../config.js";
import { InvalidParameterError, WarningError } from "../../../errors/index.js";
import {
  getPinterestImageFromPin,
  searchPinterestImages,
} from "../../../services/media-downloader.js";
import { errorLog } from "../../../utils/logger.js";

export default {
  name: "pinterest",
  description: "Busco imagens no Pinterest ou envio imagens de Pins",
  commands: ["pinterest", "pin"],
  usage: `${PREFIX}pinterest gatos fofos`,

  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
    sendImageFromURL,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError(
        "Você precisa informar o que deseja buscar no Pinterest!",
      );
    }

    const input = fullArgs.trim();

    const isPinterestUrl =
      input.includes("pin.it") ||
      input.includes("pinterest.com");

    await sendWaitReact();

    try {
      // 🔗 Link de Pin
      if (isPinterestUrl) {
        const imageUrl = await getPinterestImageFromPin(input);

        await sendSuccessReact();

        await sendImageFromURL(
          imageUrl,
          "📌 Imagem encontrada no Pinterest",
        );

        return;
      }

      // 🔎 Pesquisa por texto
      const images = await searchPinterestImages(input);

      if (!images.length) {
        await sendErrorReply(
          `Nenhuma imagem encontrada para: ${input}`,
        );
        return;
      }

      await sendSuccessReact();

      const results = images.slice(0, 3);

      for (const [index, imageUrl] of results.entries()) {
        await sendImageFromURL(
          imageUrl,
          `📌 Resultado ${index + 1} para: ${input}`,
        );

        if (index < results.length - 1) {
          await delay(500);
        }
      }
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));

      await sendErrorReply(
        error?.message ||
          "Não foi possível buscar imagens no Pinterest.",
      );
    }
  },
};
