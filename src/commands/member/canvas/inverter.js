import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { Ffmpeg } from "../../../services/ffmpeg.js";

export default {
  name: "inverter",
  description: "Inverte as cores da imagem que você enviar",
  commands: ["invert", "inverter"],
  usage: `${PREFIX}inverter (marque a imagem) ou ${PREFIX}inverter (responda a imagem)`,

  handle: async ({
    isImage,
    downloadImage,
    sendSuccessReact,
    sendWaitReact,
    sendImageFromFile,
    webMessage,
  }) => {
    if (!isImage) {
      throw new InvalidParameterError(
        "Você precisa marcar uma imagem ou responder a uma imagem"
      );
    }

    await sendWaitReact();

    const filePath = await downloadImage(webMessage);
    const ffmpeg = new Ffmpeg();

    try {
      const outputPath = await ffmpeg.invertColors(filePath);

      await sendSuccessReact();
      await sendImageFromFile(outputPath);

      await ffmpeg.cleanup(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao inverter as cores da imagem");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
