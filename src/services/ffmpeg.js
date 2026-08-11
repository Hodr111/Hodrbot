/**
 * Serviços de processamento de imagens usando ffmpeg.
 *
 * @author MRX
 */
import { exec } from "child_process";
import path from "node:path";
import { TEMP_DIR } from "../config.js";
import { getRandomNumber, removeFileIfExists } from "../utils/index.js";
import { errorLog } from "../utils/logger.js";

class Ffmpeg {
  constructor() {
    this.tempDir = TEMP_DIR;
  }

  async _executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          errorLog(`Command error: ${stderr}`);
          return reject(error);
        }
        resolve(stdout);
      });
    });
  }

  async _createTempFilePath(extension = "png") {
    return path.join(
      this.tempDir,
      `${getRandomNumber(10_000, 99_999)}.${extension}`,
    );
  }

  async applyBlur(inputPath, intensity = "7:5") {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -i ${inputPath} -vf boxblur=${intensity} ${outputPath}`;
    await this._executeCommand(command);
    return outputPath;
  }

  async convertToGrayscale(inputPath) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -i ${inputPath} -vf format=gray ${outputPath}`;
    await this._executeCommand(command);
    return outputPath;
  }

  async mirrorImage(inputPath) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -i "${inputPath}" -vf hflip "${outputPath}"`;
    await this._executeCommand(command);
    return outputPath;
  }

  async invertColors(inputPath) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -y -i "${inputPath}" -vf negate "${outputPath}"`;
    await this._executeCommand(command);
    return outputPath;
  }

  async adjustContrast(inputPath, contrast = 1.2) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -i ${inputPath} -vf eq=contrast=${contrast} ${outputPath}`;
    await this._executeCommand(command);
    return outputPath;
  }

  async applyPixelation(inputPath) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -i ${inputPath} -vf 'scale=iw/6:ih/6, scale=iw*10:ih*10:flags=neighbor' ${outputPath}`;
    await this._executeCommand(command);
    return outputPath;
  }

  async convertStickerToImage(inputPath) {
    const outputPath = await this._createTempFilePath();
    const command = `ffmpeg -y -i "${inputPath}" "${outputPath}"`;
    await this._executeCommand(command);
    return outputPath;
  }


  async applyJailEffect(inputPath) {
    const outputPath = await this._createTempFilePath();

    const command = `ffmpeg -y -i "${inputPath}" -vf "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.25:t=20,drawbox=x=0:y=0:w=iw:h=ih:color=white@0.12:t=8,drawtext=text='CADEIA':fontcolor=white:fontsize=48:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-100" "${outputPath}"`;

    await this._executeCommand(command);
    return outputPath;
  }

  async applyRipEffect(inputPath) {
    const outputPath = await this._createTempFilePath();

    const command = `ffmpeg -y -i "${inputPath}" -vf "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=25,drawbox=x=0:y=0:w=iw:h=120:color=black@0.65:t=fill,drawtext=text='R.I.P.':fontcolor=white:fontsize=64:borderw=4:bordercolor=black:x=(w-text_w)/2:y=25,drawtext=text='DESCANSE EM PAZ':fontcolor=white:fontsize=32:borderw=2:bordercolor=black:x=(w-text_w)/2:y=90" "${outputPath}"`;

    await this._executeCommand(command);
    return outputPath;
  }

  async cleanup(filePath) {
    removeFileIfExists(filePath);
  }
}

export { Ffmpeg };
