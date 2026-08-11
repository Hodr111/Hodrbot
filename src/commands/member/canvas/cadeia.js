import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { Ffmpeg } from "../../../services/ffmpeg.js";

export default {
  name: "cadeia",
  description: "Coloca uma grade de cadeia sobre a imagem enviada",
  commands: ["cadeia", "jail"],
  usage: `${PREFIX}cadeia (marque a imagem) ou ${PREFIX}cadeia (responda a uma imagem)`,

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
      const outputPath = await ffmpeg.applyJailEffect(filePath);

      await sendSuccessReact();
      await sendImageFromFile(outputPath);

      await ffmpeg.cleanup(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar o efeito de cadeia");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
