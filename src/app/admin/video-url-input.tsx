"use client";

import type { CustomInputProps } from "@premieroctet/next-admin";
import { BaseInput } from "@premieroctet/next-admin/inputs";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

/**
 * Mounting a player on every keystroke would hit YouTube/Vimeo once per
 * character, so the preview trails the field by a beat.
 */
const PREVIEW_DEBOUNCE_MS = 400;

const useDebounced = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
};

/**
 * Custom input for `Podcast.videoUrl`: Next Admin's own text input, with a
 * react-player preview underneath that follows whatever is typed or pasted.
 */
const VideoUrlInput = ({
  value,
  onChange,
  readonly,
  rawErrors,
  name,
  required,
  disabled,
}: CustomInputProps) => {
  // Keyed by src rather than a boolean so a new URL starts out un-failed.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = useDebounced(value ?? "", PREVIEW_DEBOUNCE_MS);
  const hasErrors = !!rawErrors?.length;

  const message = !src
    ? "Paste a video URL to preview it here."
    : failedSrc === src
      ? "This video could not be loaded."
      : ReactPlayer.canPlay?.(src)
        ? null
        : "No player matches this URL.";

  return (
    <div className="flex flex-col gap-2">
      <BaseInput
        id={name}
        name={name}
        // Plain text, like Next Admin renders for any other string field:
        // `type="url"` would add native validation the rest of the form lacks.
        type="text"
        value={value ?? ""}
        onChange={onChange}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        placeholder="https://www.youtube.com/watch?v=..."
        className={hasErrors ? "ring-red-600 dark:ring-red-400" : ""}
        aria-invalid={hasErrors || undefined}
      />

      <div className="ring-nextadmin-border-default dark:ring-dark-nextadmin-border-strong aspect-video w-full max-w-xl overflow-hidden rounded-md bg-black ring-1 ring-inset">
        {message ? (
          <p className="text-nextadmin-content-subtle dark:text-dark-nextadmin-content-subtle flex h-full items-center justify-center px-4 text-center text-sm">
            {message}
          </p>
        ) : (
          <ReactPlayer
            key={src}
            src={src}
            controls
            width="100%"
            height="100%"
            onError={() => setFailedSrc(src)}
          />
        )}
      </div>
    </div>
  );
};

export default VideoUrlInput;
