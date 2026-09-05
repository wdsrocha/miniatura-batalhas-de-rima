export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

// Mobile Safari (and Chrome on iOS, which is also WebKit) silently renders a
// blank – i.e. black once encoded as JPEG – canvas as soon as its total area
// goes past ~16.7 MP. A modern iPhone photo (24 MP by default, 48 MP on the Pro)
// already crosses that line. The exported thumbnail is only 1280x720, so there
// is nothing to gain from working at the photo's native resolution anyway.
const MAX_OUTPUT_EDGE = 2560;

/**
 * Crops `imageSrc` to `pixelCrop` (coordinates in natural image pixels) and
 * returns a JPEG data URL.
 *
 * This function was adapted from the one in the ReadMe of
 * https://github.com/DominicTobias/react-image-crop and then hardened against
 * two failure modes that produced an all-black photo on export:
 *
 *  1. An out-of-bounds crop rectangle. react-easy-crop can hand us a rectangle
 *     that is rounded a pixel past the edges, stale from a previously loaded
 *     image, or computed while the cropper was still laying out (zero-sized
 *     container). Reading outside the source fills the gap with transparent
 *     pixels, which become solid black in a JPEG. We now clamp the rectangle to
 *     the image and refuse an empty one.
 *  2. Allocating a canvas at the source photo's native resolution, which blows
 *     past WebKit's canvas-area limit. We now only ever allocate the (capped)
 *     output canvas and copy straight from the decoded image.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<string> {
  const image = await createImage(imageSrc);

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  const maxX = Math.floor(bBoxWidth);
  const maxY = Math.floor(bBoxHeight);
  const cropX = clamp(Math.round(pixelCrop.x), 0, maxX);
  const cropY = clamp(Math.round(pixelCrop.y), 0, maxY);
  const cropWidth = clamp(Math.round(pixelCrop.width), 0, maxX - cropX);
  const cropHeight = clamp(Math.round(pixelCrop.height), 0, maxY - cropY);

  if (cropWidth < 1 || cropHeight < 1) {
    throw new Error("Área de recorte inválida");
  }

  const scale = Math.min(
    1,
    MAX_OUTPUT_EDGE / Math.max(cropWidth, cropHeight)
  );
  const outWidth = Math.max(1, Math.round(cropWidth * scale));
  const outHeight = Math.max(1, Math.round(cropHeight * scale));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível obter o contexto 2D do canvas");
  }

  canvas.width = outWidth;
  canvas.height = outHeight;

  const isTransformed = rotation !== 0 || flip.horizontal || flip.vertical;

  if (!isTransformed) {
    // Fast path (the only one reachable from the UI today): copy just the crop
    // straight out of the decoded image. No native-resolution canvas is ever
    // created, so the source photo can be arbitrarily large.
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outWidth,
      outHeight
    );
  } else {
    // Rotation / flip path, kept for the public API. Compose the crop offset and
    // output scale on top of the rotate-around-center transform so the cropped
    // region still lands at the origin.
    ctx.scale(outWidth / cropWidth, outHeight / cropHeight);
    ctx.translate(-cropX, -cropY);
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
    ctx.drawImage(image, 0, 0);
  }

  return canvas.toDataURL("image/jpeg");
}
