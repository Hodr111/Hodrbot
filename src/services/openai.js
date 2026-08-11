import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config.js";

function getClient() {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "seu_token_aqui") {
    throw new Error(
      "A chave da OpenAI não está configurada em src/config.js."
    );
  }

  return new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

export async function gpt5Mini(text) {
  if (!text || !String(text).trim()) {
    throw new Error("Você precisa informar o texto para a IA.");
  }

  const openai = getClient();

  const response = await openai.responses.create({
    model: "gpt-5-mini",
    input: String(text).trim(),
  });

  return response.output_text;
}

export async function transcribe(
  audioBuffer,
  mimeType = "audio/ogg",
  fileName = "audio.ogg",
) {
  if (!audioBuffer || !Buffer.isBuffer(audioBuffer)) {
    throw new Error("Você precisa informar um buffer de áudio válido.");
  }

  const openai = getClient();

  const file = await openai.files.create({
    file: new File(
      [audioBuffer],
      fileName,
      { type: mimeType },
    ),
    purpose: "user_data",
  });

  const transcription = await openai.audio.transcriptions.create({
    file: file.id,
    model: "gpt-4o-mini-transcribe",
  });

  return transcription.text;
}
