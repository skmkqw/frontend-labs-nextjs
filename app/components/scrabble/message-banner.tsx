'use client';

import clsx from "clsx";

type MessageBannerProps = {
  infoMessage?: string | null;
  errorMessage?: string | null;
};

export default function MessageBanner({ infoMessage, errorMessage }: MessageBannerProps) {
  if (!infoMessage && !errorMessage) {
    return null;
  }

  return (
    <div
      className={clsx(
        "rounded-2xl border px-4 py-3 text-sm",
        infoMessage
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700",
      )}
    >
      {infoMessage ?? errorMessage}
    </div>
  );
}
