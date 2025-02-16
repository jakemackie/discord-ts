export function getSpotifySongUrl(trackId: string, partyId: string): string {
	return `https://open.spotify.com/track/${trackId}?si=${partyId}`;
}
