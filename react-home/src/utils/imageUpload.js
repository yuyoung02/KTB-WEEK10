export const MAX_POST_IMAGE_SIZE = 20 * 1024 * 1024;

const isHeicImage = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return file.type === "image/heic"
    || file.type === "image/heif"
    || extension === "heic"
    || extension === "heif";
};

const assertSize = (file) => {
  if (file.size > MAX_POST_IMAGE_SIZE) {
    throw new Error("이미지는 최대 20MB까지 업로드할 수 있습니다.");
  }
};

export async function prepareImageUpload(file) {
  if (!file) return null;

  assertSize(file);

  if (!isHeicImage(file)) return file;

  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.9,
  });
  const jpegBlob = Array.isArray(converted) ? converted[0] : converted;
  const jpegName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
  const jpegFile = new File([jpegBlob], jpegName, {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });

  assertSize(jpegFile);
  return jpegFile;
}
