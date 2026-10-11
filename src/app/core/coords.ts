export function formatCoords(lat: number, lng: number): string {
  const ns = lat < 0 ? 'S' : 'N';
  const ew = lng < 0 ? 'W' : 'E';
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}
