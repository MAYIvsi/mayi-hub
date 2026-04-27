export type PixelCrop = { x: number; y: number; width: number; height: number };

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export async function cropImageToBlob(
  imageSrc: string,
  crop: PixelCrop,
  options?: { mimeType?: string; quality?: number; size?: number },
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  const outputSize = options?.size ?? 512;
  canvas.width = outputSize;
  canvas.height = outputSize;

  // Map crop pixels from rendered image to natural pixels
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const sx = Math.max(0, crop.x * scaleX);
  const sy = Math.max(0, crop.y * scaleY);
  const sWidth = Math.max(1, crop.width * scaleX);
  const sHeight = Math.max(1, crop.height * scaleY);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, outputSize, outputSize);

  const mimeType = options?.mimeType ?? "image/jpeg";
  const quality = options?.quality ?? 0.92;

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) reject(new Error("Failed to create blob"));
        else resolve(b);
      },
      mimeType,
      quality,
    );
  });

  return blob;
}

