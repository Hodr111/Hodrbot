import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

import { TEMP_DIR } from "../config.js";
import { getRandomName, removeFileIfExists } from "../utils/index.js";

const execFileAsync = promisify(execFile);

async function runYtDlp(args) {
  const { stdout, stderr } = await execFileAsync("yt-dlp", args, {
    maxBuffer: 20 * 1024 * 1024,
  });

  return { stdout, stderr };
}

export async function downloadVideo(url) {
  const outputPath = path.join(
    TEMP_DIR,
    `${getRandomName()}.mp4`,
  );

  try {
    await runYtDlp([
      url,
      "--no-playlist",
      "--js-runtimes",
      "node",
      "-f",
      "bv*+ba/b",
      "--merge-output-format",
      "mp4",
      "--no-warnings",
      "--quiet",
      "-o",
      outputPath,
    ]);

    return outputPath;
  } catch (error) {
    removeFileIfExists(outputPath);
    throw new Error(
      error?.stderr?.trim() ||
        error?.message ||
        "Não foi possível baixar o vídeo.",
    );
  }
}

export async function downloadAudio(url) {
  const outputPath = path.join(
    TEMP_DIR,
    `${getRandomName()}.mp3`,
  );

  try {
    await runYtDlp([
      url,
      "--no-playlist",
      "--js-runtimes",
      "node",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--no-warnings",
      "--quiet",
      "-o",
      outputPath,
    ]);

    return outputPath;
  } catch (error) {
    removeFileIfExists(outputPath);
    throw new Error(
      error?.stderr?.trim() ||
        error?.message ||
        "Não foi possível baixar o áudio.",
    );
  }
}

export async function getPinterestImage(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Pinterest respondeu com HTTP ${response.status}.`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.startsWith("image/")) {
    throw new Error("Não foi possível encontrar uma imagem nesse Pin.");
  }

  return Buffer.from(await response.arrayBuffer());
}

export async function getPinterestImageFromPin(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Pinterest respondeu com HTTP ${response.status}.`);
  }

  const html = await response.text();

  // O Pinterest informa a imagem principal do Pin no og:image.
  const ogImage =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    )?.[1] ||
    html.match(
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    )?.[1];

  if (ogImage && ogImage.includes("i.pinimg.com")) {
    return ogImage;
  }

  // Fallback caso o og:image não esteja disponível.
  const matches = [
    ...html.matchAll(
      /https?:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x)\/[^"'\\\s)]+?\.(?:jpg|jpeg|png|webp)/gi,
    ),
  ];

  const imageUrl = matches[0]?.[0];

  if (!imageUrl) {
    throw new Error("Não foi possível encontrar a imagem desse Pin.");
  }

  return imageUrl;
}

export async function searchPinterestImages(search) {
  const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(search)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/131.0 Mobile Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Pinterest respondeu com HTTP ${response.status}.`);
  }

  const html = await response.text();

  const matches = [
    ...html.matchAll(
      /https?:\/\/i\.pinimg\.com\/(?:originals|736x|564x|474x|236x)\/[^"'\\\s)]+?\.(?:jpg|jpeg|png|webp)/gi,
    ),
  ];

  const urls = matches.map((match) =>
    match[0].replace(
      /\/(?:736x|564x|474x|236x)\//,
      "/originals/",
    ),
  );

  return [...new Set(urls)].slice(1, 11);
}
