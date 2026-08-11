import fs from "node:fs";
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { errorLog } from "../../utils/logger.js";

const VIDEOS = {
  abracar: "abracar.mp4",
  beijar: "beijar.mp4",
  jantar: "jantar.mp4",
  lutar: "lutar.mp4",
  matar: "matar.mp4",
  socar: "some-guy-getting-punch-anime-punching-some-guy-anime.mp4",
  tapa: "tapa.mp4",
};

export default {
  name: "addvideo",
  description: "Altera o vídeo de uma brincadeira",
  commands: ["addvideo"],
  usage: `${PREFIX}addvideo <brincadeira> (respondendo a um vídeo)`,

  handle: async ({
    isReply,
    isVideo,
    downloadVideo,
    sendSuccessReply,
    sendErrorReply,
    webMessage,
    args,
  }) => {
    if (!isReply || !isVideo) {
      throw new InvalidParameterError(
        "Responda a uma mensagem que contenha um vídeo!"
      );
    }

    const brincadeira = args[0]?.toLowerCase();

    if (!brincadeira || !VIDEOS[brincadeira]) {
      throw new InvalidParameterError(
        "Brincadeira inválida!\n\n" +
        "Disponíveis:\n" +
        "• abracar\n" +
        "• beijar\n" +
        "• jantar\n" +
        "• lutar\n" +
        "• matar\n" +
        "• socar\n" +
        "• tapa"
      );
    }

    try {
      const videoPath = path.join(
        ASSETS_DIR,
        "images",
        "funny",
        VIDEOS[brincadeira]
      );

      const tempPath = await downloadVideo(
        webMessage,
        `novo-${brincadeira}-video`
      );

      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }

      fs.renameSync(tempPath, videoPath);

      await sendSuccessReply(
        `🎬 Vídeo do /${brincadeira} atualizado com sucesso!`
      );
    } catch (error) {
      errorLog(
        `Erro ao alterar vídeo do ${brincadeira}: ${error}`
      );

      await sendErrorReply(
        `❌ Não consegui alterar o vídeo do /${brincadeira}.`
      );
    }
  },
};
