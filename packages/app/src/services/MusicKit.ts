declare const MusicKit: any;

interface MusicKitService {
  FormatArtwork: (artwork: MusicKit.Artwork, size: number) => string;
}

const FormatArtwork = (artwork: MusicKit.Artwork, size: number): string => {
  if (typeof artwork === 'string' || artwork instanceof String) {
    artwork = GenerateArtwork(String(artwork));
  }

  if (!artwork) {
    return '';
  }

  return MusicKit.formatArtworkURL(artwork, size, size);
};

const GenerateArtwork = (url: string): MusicKit.Artwork => {
  const artwork = {
    url: url,
    bgColor: '000000',
    height: 1000,
    width: 1000,
    textColor1: '000000',
    textColor2: '000000',
    textColor3: '000000',
    textColor4: '000000'
  };

  return artwork;
};

const MusicKitService: MusicKitService = {
  FormatArtwork
};

export default MusicKitService;
