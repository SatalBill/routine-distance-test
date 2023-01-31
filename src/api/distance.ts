import { calculateDistance } from '../utils/distance';
import { City, DistanceResponse } from '../utils/types';


export const getDistance = async (origin: City | any, destination: City | any, intermidiateCities: City[] | any, passengers: number | any, date: string | any): Promise<DistanceResponse> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            var distanceResponse: DistanceResponse = {
                distanceBtnCities: [],
                distanceBtnOriginAndDestination: 0,
                passengers: passengers,
                date: date
            };
            if (intermidiateCities.length === 0) {
                finalDistance = calculateDistance(origin, destination);

                distanceResponse.distanceBtnOriginAndDestination = finalDistance;
                distanceResponse.distanceBtnCities.push({
                    city1: origin,
                    city2: destination,
                    routeDistance: finalDistance
                })
            }
            else {
                //final distance
                var finalDistance: number = 0;

                //distance between the origin city and the first intermidiate city only
                var firstDistance: number = calculateDistance(origin, intermidiateCities[0]);
                distanceResponse.distanceBtnCities.push({
                    city1: origin,
                    city2: intermidiateCities[0],
                    routeDistance: firstDistance
                })
                finalDistance += firstDistance;

                if (intermidiateCities?.length !== 1) {
                    //distance between the intermidiate cities only

                    for (var i: number = 0; i < intermidiateCities.length - 1; i++) {
                        var intermidiateCityRouteDistance: number = calculateDistance(intermidiateCities[i], intermidiateCities[i + 1]);
                        distanceResponse.distanceBtnCities.push(
                            {
                                city1: intermidiateCities[i],
                                city2: intermidiateCities[i + 1],
                                routeDistance: intermidiateCityRouteDistance
                            }
                        )
                        finalDistance += intermidiateCityRouteDistance;
                    }
                }

                //distance between the last intermidiate city and the destination
                var lastDistance: number = calculateDistance(destination, intermidiateCities[intermidiateCities.length - 1]);
                finalDistance += lastDistance;
                distanceResponse.distanceBtnCities.push({
                    city1: intermidiateCities[intermidiateCities.length - 1],
                    city2: destination,
                    routeDistance: lastDistance
                })

                distanceResponse.distanceBtnOriginAndDestination = finalDistance;
            }
            resolve(distanceResponse);
        }, 200);
    });
};
