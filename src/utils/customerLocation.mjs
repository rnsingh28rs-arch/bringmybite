export function createMapLocationLink(latitude, longitude) {
  return `https://www.google.com/maps?q=${Number(latitude).toFixed(6)},${Number(longitude).toFixed(6)}`;
}

export function normalizeCustomerLocation(location) {
  if (!location) return { latitude: undefined, longitude: undefined, mapLocationLink: undefined };
  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);
  const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
  const mapLocationLink = String(location.mapLocationLink || '').trim() || (hasCoordinates ? createMapLocationLink(latitude, longitude) : undefined);
  return {
    latitude: hasCoordinates ? latitude : undefined,
    longitude: hasCoordinates ? longitude : undefined,
    mapLocationLink
  };
}
