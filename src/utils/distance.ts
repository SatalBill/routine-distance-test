import { City } from "./types";

export const calculateDistance = (city1: City | any, city2: City | any): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (city2?.latitude - city1?.latitude) * (Math.PI / 180);
  const dLon = (city2?.longitude - city1?.longitude) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(city1?.latitude * (Math.PI / 180)) * Math.cos(city2?.latitude * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.ceil(R * c); // distance in km
};
