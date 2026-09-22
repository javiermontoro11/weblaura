(() => {
  "use strict";

  const STORAGE_BUCKET = "recuerdos";
  const MAX_PHOTOS = 8;
  const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
  const MAX_DIMENSION = 1600;
  const TARGET_BYTES = 700 * 1024;
  const SIGNED_URL_SECONDS = 60 * 60;
  const SIGNED_URL_REFRESH_MARGIN_MS = 5 * 60 * 1000;

  const signedUrlCache = new Map();

  async function ensureSignedUrls(client, paths) {
    const now = Date.now();
    const uniquePaths = [...new Set((paths || []).filter(Boolean))];
    const missing = uniquePaths.filter(path => {
      const cached = signedUrlCache.get(path);
      return !cached || cached.expiresAt - now <= SIGNED_URL_REFRESH_MARGIN_MS;
    });

    if (!missing.length) return;

    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .createSignedUrls(missing, SIGNED_URL_SECONDS);
    if (error) throw error;

    (data || []).forEach((item, index) => {
      const path = item?.path || missing[index];
      if (!path || !item?.signedUrl) return;
      signedUrlCache.set(path, {
        url: item.signedUrl,
        expiresAt: now + (SIGNED_URL_SECONDS * 1000)
      });
    });
  }

  async function fetchAll(client) {
    if (!client) throw new Error("Supabase client unavailable");

    const { data, error } = await client
      .from("recuerdos_app")
      .select("*")
      .order("fecha", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const allPaths = rows
      .flatMap(memory => Array.isArray(memory.image_paths) ? memory.image_paths : [])
      .filter(Boolean);

    await ensureSignedUrls(client, allPaths);

    return {
      memories: rows.map(memory => ({
        ...memory,
        signedUrls: (Array.isArray(memory.image_paths) ? memory.image_paths : [])
          .map(path => signedUrlCache.get(path)?.url || "")
      })),
      loadError: false
    };
  }

  function getSignedUrl(path) {
    return signedUrlCache.get(path)?.url || "";
  }

  function deleteCached(path) {
    if (path) signedUrlCache.delete(path);
  }

  function clearCache() {
    signedUrlCache.clear();
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("decode image failed"));
      };
      image.src = url;
    });
  }

  function drawImage(image, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("canvas unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas;
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
  }

  async function compressImage(file) {
    const image = await loadImage(file);
    let width = image.naturalWidth || image.width;
    let height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error("decode image failed");

    const initialScale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.max(1, Math.round(width * initialScale));
    height = Math.max(1, Math.round(height * initialScale));

    let canvas = drawImage(image, width, height);
    let quality = 0.84;
    let blob = await canvasToBlob(canvas, "image/webp", quality);
    if (!blob) blob = await canvasToBlob(canvas, "image/jpeg", 0.84);
    if (!blob) throw new Error("image format unsupported");

    while (blob.size > TARGET_BYTES && quality > 0.56) {
      quality -= 0.07;
      blob = await canvasToBlob(
        canvas,
        blob.type === "image/jpeg" ? "image/jpeg" : "image/webp",
        quality
      );
    }

    if (blob.size > TARGET_BYTES * 1.35) {
      const scale = 0.82;
      canvas = drawImage(
        image,
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale))
      );
      blob = await canvasToBlob(
        canvas,
        blob.type === "image/jpeg" ? "image/jpeg" : "image/webp",
        Math.max(0.58, quality - 0.04)
      );
    }

    return blob;
  }

  window.JaviEatsMemories = Object.freeze({
    storageBucket: STORAGE_BUCKET,
    maxPhotos: MAX_PHOTOS,
    maxSourceBytes: MAX_SOURCE_BYTES,
    fetchAll,
    getSignedUrl,
    deleteCached,
    clearCache,
    compressImage
  });
})();