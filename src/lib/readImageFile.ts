// Only Safari can decode HEIC/HEIF natively, which is the default format of
// photos taken with an iPhone. On every other browser these files have to be
// converted to JPEG before they can be shown, cropped or exported.
const HEIC_BRANDS = [
  "mif1",
  "msf1",
  "heic",
  "heix",
  "hevc",
  "hevx",
  "heim",
  "heis",
  "hevm",
  "hevs",
];

import { diagSession } from "./diagnostics";

const JPEG_QUALITY = 0.92;

// The brand of an ISO base media file lives in the `ftyp` box, right after its
// 4-byte size and 4-byte type. Sniffing it is more reliable than looking at
// `file.type`, which is empty on some browsers for `.heic` files.
const isHeic = async (file: File) => {
  const header = await file.slice(8, 12).arrayBuffer();
  if (header.byteLength < 4) {
    return false;
  }

  const brand = new TextDecoder("utf-8")
    .decode(header)
    .replace("\0", " ")
    .trim();

  return HEIC_BRANDS.includes(brand);
};

const readAsDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

/**
 * Reads an image file as a data URL, converting it to JPEG first when the
 * browser can't decode it on its own. The HEIC decoder weighs a few megabytes,
 * so it is only downloaded when a HEIC file actually shows up.
 */
export const readImageFile = async (file: File): Promise<string> => {
  diagSession.bump("imagesLoaded");

  if (await isHeic(file)) {
    const startedAt = performance.now();
    const { heicTo } = await import("heic-to");
    const jpeg = await heicTo({
      blob: file,
      type: "image/jpeg",
      quality: JPEG_QUALITY,
    });
    diagSession.bump("heicConversions");
    diagSession.setLastHeic({
      ms: Math.round(performance.now() - startedAt),
      inBytes: file.size,
      outBytes: jpeg.size,
    });
    return readAsDataUrl(jpeg);
  }

  return readAsDataUrl(file);
};
