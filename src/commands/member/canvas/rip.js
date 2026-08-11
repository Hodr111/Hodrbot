import { PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { Ffmpeg } from "../../../services/ffmpeg.js";

export default {
  name: "rip",
  description: "Aplica um efeito R.I.P. na imagem",
  commands: ["rip"],
  usage: `${PREFIX}rip (marque ou responda uma imagem)`,

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
      const outputPath = await ffmpeg.applyRipEffect(filePath);

      await sendSuccessReact();
      await sendImageFromFile(outputPath);

      await ffmpeg.cleanup(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao aplicar o efeito R.I.P.");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
