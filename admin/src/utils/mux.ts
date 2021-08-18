const generateStreamUrl = (playbackId:string) => `https://stream.mux.com/${playbackId}.m3u8`;

const generateImageUrl = (playbackId:string | null) => playbackId ? `https://image.mux.com/${playbackId}/thumbnail.png` : undefined;

export {
  generateStreamUrl,
  generateImageUrl
};
