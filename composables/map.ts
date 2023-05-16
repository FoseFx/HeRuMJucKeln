import { TripItineraryLink } from "~/swagger/Api";

export function itineraryLinksToGeoJSON(
  links: TripItineraryLink[]
): GeoJSON.LineString {
  const geoJson: GeoJSON.LineString = {
    type: "LineString",
    coordinates: [],
  };
  for (const { start, end } of links) {
    geoJson.coordinates.push(
      gpsPositionToGeoJSONCoordinate(start?.gpsPosition)
    );
    geoJson.coordinates.push(gpsPositionToGeoJSONCoordinate(end?.gpsPosition));
  }
  return geoJson;
}

export function gpsPositionToGeoJSONCoordinate(gps?: {
  latitude?: number;
  longitude?: number;
}) {
  return [gps?.longitude as number, gps?.latitude as number];
}
