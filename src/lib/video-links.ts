import type { LinkedVideo, LinkedVideoProvider } from "@/types/content";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const FACEBOOK_HOSTS = new Set([
  "facebook.com",
  "www.facebook.com",
  "m.facebook.com",
  "web.facebook.com",
]);

const LINKED_VIDEO_PROVIDERS = ["youtube", "facebook", "file"] as const;

function httpsUrl(value: string): URL | undefined {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

function youtubeVideoId(value: string): string | undefined {
  const url = httpsUrl(value);
  if (!url || !YOUTUBE_HOSTS.has(url.hostname)) return undefined;

  const parts = url.pathname.split("/").filter(Boolean);
  const id =
    url.hostname.endsWith("youtu.be")
      ? parts[0]
      : url.pathname === "/watch"
        ? url.searchParams.get("v") ?? undefined
        : ["embed", "shorts", "live"].includes(parts[0])
          ? parts[1]
          : undefined;

  return id && /^[A-Za-z0-9_-]{6,20}$/.test(id) ? id : undefined;
}

function isFacebookVideo(value: string): boolean {
  const url = httpsUrl(value);
  return Boolean(url && FACEBOOK_HOSTS.has(url.hostname));
}

/** MIME type for a direct HTTPS video URL, or undefined when it is unsupported. */
export function directVideoMimeType(value: string): "video/mp4" | "video/webm" | undefined {
  const url = httpsUrl(value);
  if (!url) return undefined;

  const path = url.pathname.toLowerCase();
  if (path.endsWith(".mp4")) return "video/mp4";
  if (path.endsWith(".webm")) return "video/webm";
  return undefined;
}

export function isLinkedVideoProvider(value: unknown): value is LinkedVideoProvider {
  return (
    typeof value === "string" &&
    (LINKED_VIDEO_PROVIDERS as readonly string[]).includes(value)
  );
}

/** Reject unsupported links both in the CMS and at the public data boundary. */
export function isSupportedLinkedVideo(
  value: string,
  provider: LinkedVideoProvider,
): boolean {
  switch (provider) {
    case "youtube":
      return Boolean(youtubeVideoId(value));
    case "facebook":
      return isFacebookVideo(value);
    case "file":
      return Boolean(directVideoMimeType(value));
  }
}

/** A provider's safe, canonical iframe source. Direct file links need no iframe. */
export function linkedVideoEmbedUrl(video: LinkedVideo): string | undefined {
  if (video.provider === "youtube") {
    const id = youtubeVideoId(video.url);
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : undefined;
  }

  if (video.provider === "facebook" && isFacebookVideo(video.url)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=false`;
  }

  return undefined;
}
