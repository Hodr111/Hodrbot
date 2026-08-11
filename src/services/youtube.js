import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { TEMP_DIR } from "../config.js";
import { getRandomName, removeFileIfExists } from "../utils/index.js";

const execFileAsync = promisify(execFile);

async function ytDlp(args) {
  const { stdout } = await execFileAsync("yt-dlp", args, {
    maxBuffer: 10 * 1024 * 1024,
  });

  return stdout;
}

export async function getAudioFromSearch(search) {
  const json = await ytDlp([
    `ytsearch1:${search}`,
    "--dump-single-json",
    "--skip-download",
    "--no-warnings",
    "--quiet",
  ]);

  const data = JSON.parse(json);
  const video = data?.entries?.[0];

  if (!video?.webpage_url) {
    return null;
  }

  const outputPath = path.join(
    TEMP_DIR,
    `${getRandomName()}.mp3`,
  );

  await ytDlp([
    video.webpage_url,
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
    "-o",
    outputPath,
  ]);

  return {
    path: outputPath,
    title: video.title,
    description: video.description || "",
    channel: video.channel || video.uploader || "Desconhecido",
    views: video.view_count || 0,
    uploadDate: video.upload_date || "",
    duration: video.duration || 0,
    thumbnail: video.thumbnail || "",
    url: video.webpage_url,
  };
}

export async function getVideoFromSearch(search) {
  const json = await ytDlp([
    `ytsearch1:${search}`,
    "--dump-single-json",
    "--skip-download",
    "--no-warnings",
    "--quiet",
    "--js-runtimes",
    "node",
  ]);

  const data = JSON.parse(json);
  const video = data?.entries?.[0];

  if (!video?.webpage_url) {
    return null;
  }

  return getVideoFromUrl(video.webpage_url);
}

export function formatDuration(seconds) {
  const total = Number(seconds) || 0;
  const minutes = Math.floor(total / 60);
  const secs = total % 60;

  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function formatViews(views) {
  return new Intl.NumberFormat("pt-BR").format(Number(views) || 0);
}

export function formatDate(date) {
  if (!date || date.length !== 8) {
    return "Desconhecida";
  }

  return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`;
}

export async function getAudioFromUrl(url) {
  const json = await ytDlp([
    url,
    "--dump-single-json",
    "--skip-download",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
  ]);

  const video = JSON.parse(json);

  if (!video?.webpage_url) {
    return null;
  }

  const outputPath = path.join(
    TEMP_DIR,
    `${getRandomName()}.mp3`,
  );

  await ytDlp([
    url,
    "--extract-audio",
    "--audio-format",
    "mp3",
    "--audio-quality",
    "0",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
    "--js-runtimes",
    "node",
    "-o",
    outputPath,
  ]);

  return {
    path: outputPath,
    title: video.title || "Sem título",
    description: video.description || "",
    channel: video.channel || video.uploader || "Desconhecido",
    views: video.view_count || 0,
    uploadDate: video.upload_date || "",
    duration: video.duration || 0,
    thumbnail: video.thumbnail || "",
    url: video.webpage_url,
  };
}


export async function getVideoFromUrl(url) {
  const json = await ytDlp([
    url,
    "--dump-single-json",
    "--skip-download",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
    "--js-runtimes",
    "node",
  ]);

  const video = JSON.parse(json);

  if (!video?.webpage_url) {
    return null;
  }

  const outputPath = path.join(
    TEMP_DIR,
    `${getRandomName()}.mp4`,
  );

  await ytDlp([
    url,
    "--format",
    "bv*+ba/b",
    "--merge-output-format",
    "mp4",
    "--no-playlist",
    "--no-warnings",
    "--quiet",
    "--js-runtimes",
    "node",
    "-o",
    outputPath,
  ]);

  return {
    path: outputPath,
    title: video.title || "Sem título",
    description: video.description || "",
    channel: video.channel || video.uploader || "Desconhecido",
    views: video.view_count || 0,
    uploadDate: video.upload_date || "",
    duration: video.duration || 0,
    thumbnail: video.thumbnail || "",
    url: video.webpage_url,
  };
}
