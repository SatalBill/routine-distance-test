interface City {
    name: string;
    latitude: number;
    longitude: number;
}
interface error {
    messaage: string;
}


interface DistanceResponse {
    distanceBtnOriginAndDestination: number,
    distanceBtnCities: DistanceBtnCities[],
    passengers: number;
    date: string;
}

interface DistanceBtnCities {
    city1: City;
    city2: City;
    routeDistance: number
}


interface formErrors {
    origin: string,
    destination: string,
    date: string,
    passengers: string,
}

export type {
    City,
    formErrors,
    DistanceResponse,
    error
}