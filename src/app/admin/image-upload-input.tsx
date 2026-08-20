"use client";

import type { CustomInputProps } from "@premieroctet/next-admin";
import { BaseInput } from "@premieroctet/next-admin/inputs";
import { useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MEDIA_BUCKET = "media";

function publicMediaUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

type ImageUploadInputProps = CustomInputProps & {
  /** Folder inside the `media` bucket uploads are stored under, e.g. "podcasts". */
  folder: string;
};

/**
 * Custom input for image fields (`Podcast.thumbnailUrl`, `StudyGroup.imageUrl`):
 * Next Admin's own text input for pasting a URL or bucket path directly, a
 * file picker that uploads to the public `media` bucket, and a preview of
 * whatever the field currently resolves to.
 */
const ImageUploadInput = ({
  value,
  onChange,
  readonly,
  rawErrors,
  name,
  required,
  disabled,
  folder,
}: ImageUploadInputProps) => {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const hasErrors = !!rawErrors?.length || !!uploadError;

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const extension = file.name.includes(".")
        ? `.${file.name.split(".").pop()}`
        : "";
      const path = `${folder}/${crypto.randomUUID()}${extension}`;
      const { error } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { contentType: file.type });
      if (error) throw error;
      onChange?.({
        target: { value: path },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <BaseInput
        id={name}
        name={name}
        type="text"
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disabled || uploading}
        readOnly={readonly}
        placeholder="https://... or a path inside the media bucket"
        className={hasErrors ? "ring-red-600 dark:ring-red-400" : ""}
        aria-invalid={hasErrors || undefined}
      />

      {!readonly && (
        <label
          htmlFor={inputId}
          className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex items-center gap-2 text-sm"
        >
          <input
            id={inputId}
            type="file"
            accept="image/*"
            disabled={disabled || uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void handleFile(file);
            }}
          />
          {uploading && <span>Uploading…</span>}
        </label>
      )}

      {uploadError && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {uploadError}
        </p>
      )}

      <div className="ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong aspect-video w-full max-w-xl overflow-hidden rounded-md bg-black/5 ring-1 ring-inset">
        {value ? (
          // Previewing a user-uploaded or pasted URL, not a static asset next/image can optimize.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicMediaUrl(value)}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <p className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex h-full items-center justify-center px-4 text-center text-sm">
            Upload an image or paste a URL to preview it here.
          </p>
        )}
      </div>
    </div>
  );
};

export default ImageUploadInput;
