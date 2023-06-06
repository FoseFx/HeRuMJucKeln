import { AnySourceData, LngLat } from "mapbox-gl";

// Radius of earth
const R = 6371000;

// https://stackoverflow.com/questions/23115375/determine-if-a-longitude-latitude-co-ordinate-is-inside-a-radius-in-miles-and
// This function takes in latitude and longitude of two locations
// and returns the distance between them as the crow flies (Luftlinie) in kilometers
export function calcDist(
  coords1: Pick<LngLat, "lng" | "lat">,
  coords2: Pick<LngLat, "lng" | "lat">
) {
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d / 1000;
}

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}

export function createGeoJSONCircle(
  center: [number, number],
  radiusInKm: number,
  points?: number
): AnySourceData {
  if (!points) points = 64;

  const coords = {
    latitude: center[1],
    longitude: center[0],
  };

  const km = radiusInKm;

  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);

    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          properties: {},
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [ret],
          },
        },
      ],
    },
  };
}
