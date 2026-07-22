import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import Button from "./Button";
import Card from "./Card";

const ACCEPTED_TYPES = (
  import.meta.env.VITE_UPLOAD_ACCEPTED_TYPES ||
  "image/jpeg,image/jpg,image/png,image/webp"
).split(",");
const MAX_SIZE_BYTES =
  Number(import.meta.env.VITE_UPLOAD_MAX_SIZE_MB || 8) * 1024 * 1024;
const MAX_DIMENSION = Number(import.meta.env.VITE_UPLOAD_MAX_DIMENSION || 1920);
const WEBP_QUALITY = Number(import.meta.env.VITE_UPLOAD_WEBP_QUALITY || 0.8);
const MAX_FILES = Number(import.meta.env.VITE_UPLOAD_MAX_FILES || 4);
const MAX_TOTAL_IMAGES = Number(
  import.meta.env.VITE_UPLOAD_MAX_TOTAL_IMAGES || 20,
);

// Downscales (if needed) and re-encodes an image file to a compressed WebP blob.
function compressToWebp(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const scale = MAX_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/webp",
        WEBP_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image"));
    };

    img.src = objectUrl;
  });
}

export default function VendorImageUploader({
  vendorId,
  endpoint = "/vendor/upload-images",
  multiple = true,
  onUploaded,
}) {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]); // { id, name, previewUrl, blob, sizeKb }
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]); // { id, imageUrl, createdAt }
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!vendorId) return;
    let cancelled = false;

    api
      .get("/vendor/images")
      .then((res) => {
        if (!cancelled) setExistingImages(res.data?.data?.images ?? []);
      })
      .catch(() => {
        // ignore — cap enforcement just falls back to 0 existing images
      });

    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const existingCount = existingImages.length;
  const totalUsed = existingCount + images.length;
  const canSelectMore = images.length < MAX_FILES && totalUsed < MAX_TOTAL_IMAGES;

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    let remainingSlots = Math.min(
      MAX_FILES - images.length,
      MAX_TOTAL_IMAGES - totalUsed,
    );

    for (const file of files) {
      if (remainingSlots <= 0) {
        if (totalUsed >= MAX_TOTAL_IMAGES) {
          toast.error(`You've reached the maximum of ${MAX_TOTAL_IMAGES} images total`);
        } else {
          toast.error(`You can only upload up to ${MAX_FILES} images at once`);
        }
        break;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: only JPEG, PNG or WEBP images are allowed`);
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`${file.name}: exceeds the 8MB limit`);
        continue;
      }

      try {
        const blob = await compressToWebp(file);
        setImages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${file.name}`,
            name: file.name.replace(/\.[^.]+$/, ".webp"),
            previewUrl: URL.createObjectURL(blob),
            blob,
            sizeKb: Math.round(blob.size / 1024),
          },
        ]);
        remainingSlots -= 1;
      } catch {
        toast.error(`${file.name}: failed to process image`);
      }
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files?.length) handleFiles(e.target.files);
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleUpload = async () => {
    if (!vendorId) return toast.error("Missing vendor account");
    if (images.length === 0) return toast.error("Select at least one image");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("vendorId", vendorId);
      images.forEach((img) => formData.append("images", img.blob, img.name));

      const res = await api.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Images uploaded successfully!");
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setExistingImages((prev) => [...(res.data?.data ?? []), ...prev]);
      setImages([]);
      onUploaded?.(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/vendor/images/${id}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Image deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="p-6">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onClick={() => canSelectMore && inputRef.current?.click()}
        className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-zinc-50 dark:bg-zinc-900/30 transition-colors ${
          canSelectMore
            ? "cursor-pointer border-zinc-300 dark:border-zinc-700 hover:border-[#8cb800] dark:hover:border-[#d4ff00]"
            : "cursor-not-allowed opacity-50 border-zinc-300 dark:border-zinc-700"
        }`}
      >
        <p className="font-bold text-zinc-700 dark:text-zinc-300">
          {totalUsed >= MAX_TOTAL_IMAGES
            ? `Maximum ${MAX_TOTAL_IMAGES} images reached`
            : images.length >= MAX_FILES
              ? `Maximum ${MAX_FILES} images selected`
              : "Click to select images"}
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
          JPEG, PNG or WEBP · up to 8MB each · max {MAX_FILES} at once ·{" "}
          {totalUsed}/{MAX_TOTAL_IMAGES} used
        </p>
      </div>

      {images.length > 0 && (
        <>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-6 mb-2">
            Ready to upload
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square"
              >
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${img.name}`}
                >
                  ✕
                </button>
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-black/60 text-white">
                  {img.sizeKb}KB
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            loading={uploading}
            className="mt-6"
            fullWidth
          >
            {uploading
              ? "Uploading..."
              : `Upload ${images.length} Image${images.length > 1 ? "s" : ""}`}
          </Button>
        </>
      )}

      {existingImages.length > 0 && (
        <>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mt-6 mb-2">
            Uploaded images ({existingImages.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 aspect-square"
              >
                <img
                  src={img.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deletingId === img.id}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs md:opacity-0 md:group-hover:opacity-100 transition-opacity disabled:opacity-100 disabled:cursor-not-allowed"
                  aria-label="Delete image"
                >
                  {deletingId === img.id ? (
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "✕"
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}
