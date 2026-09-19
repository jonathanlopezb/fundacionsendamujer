/** Provider boundary for protected media and live rooms.
 * Set SENDA_VIDEO_PROVIDER=blob|cloudflare and SENDA_LIVE_PROVIDER=mock|livekit
 * in Vercel. The UI remains usable in mock mode while credentials are configured.
 */
export const videoProvider = process.env.SENDA_VIDEO_PROVIDER || 'blob';
export const liveProvider = process.env.SENDA_LIVE_PROVIDER || 'mock';

export function getMediaPolicy() {
  return { videoProvider, liveProvider, privateVideo: videoProvider === 'cloudflare', liveRooms: liveProvider === 'livekit', signedUrlsRequired: videoProvider === 'cloudflare' };
}
