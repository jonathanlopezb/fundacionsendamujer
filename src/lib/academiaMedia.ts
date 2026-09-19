/**
 * Video delivery is intentionally configurable. In production set
 * NEXT_PUBLIC_SENDA_ACADEMIA_VIDEO_URL to a Vercel Blob URL (or a signed
 * provider URL). During design/demo it falls back to a public MP4 sample.
 */
export const ACADEMIA_VIDEO_URL = process.env.NEXT_PUBLIC_SENDA_ACADEMIA_VIDEO_URL || 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4';

export function resolveAcademiaVideo(url?: string) {
  return url || ACADEMIA_VIDEO_URL;
}
