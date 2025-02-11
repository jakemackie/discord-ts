export function getSpotifySongUrl(
  trackId: string,
  partyId: string
): string | null {
  if (!trackId) return null;

  return `https://open.spotify.com/track/${trackId}?si=${partyId}`;
}
