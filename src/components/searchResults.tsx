import React from 'react';
import { getDistance } from '../api/distance';
import { getCities } from '../api/cities';
import { City, DistanceResponse } from '../utils/types'
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom'
interface Props {
}
interface smallTableCopmponent {
    desc: string,
    value: string | number
}

const SearchResults: React.FC<Props> = (props) => {
    const [loading, setLoading] = React.useState<Boolean>(true)
    var [error, setError] = React.useState<any>();

    const [searchResults, setSearchResults] = React.useState<DistanceResponse>({
        distanceBtnCities: [],
        distanceBtnOriginAndDestination: 0,
        passengers: 0,
        date: ""
    });
    const [smallTableComponents, setSmallTableComponents] = React.useState<smallTableCopmponent[]>([
        {
            desc: "Origin",
            value: searchResults?.distanceBtnCities[0]?.city1?.name
        },
        {
            desc: "Destination",
            value: searchResults?.distanceBtnCities[searchResults.distanceBtnCities.length - 1]?.city2?.name
        },
        {
            desc: "Departure",
            value: searchResults?.date.substr(searchResults?.date.length - 12)
        },
        {
            desc: "Total distance",
            value: searchResults?.distanceBtnOriginAndDestination
        },
        {
            desc: "Arrival",
            value: searchResults?.date.substr(searchResults?.date.length - 12)
        },
        {
            desc: "Passengers",
            value: searchResults?.passengers
        },
    ])
    React.useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        var destinationParam = String(params.get("destination"));
        var originParam = String(params.get("origin"));
        var passengersParam = String(params.get("passengers"));
        var dateParam = String(params.get("date"));
        var intermidiateCitiesParam = String(params.get("intermidiate_cities"))?.split(",")
        const usingParameters = async () => {
            var citiesInvolved: string[] = [];

            //add the originCity
            citiesInvolved.push(originParam);
            //add all intermidiate cities;
            intermidiateCitiesParam?.forEach(cityName => { citiesInvolved.push(cityName) })
            //add the destinationCity
            citiesInvolved.push(destinationParam);

            var validCities: City[] = [];

            await getCities(citiesInvolved).then(data => {
                validCities = data
            }).catch(error => {
                setError(error)
                setLoading(false)
            });
            const originCity: City = validCities[0];
            const destinationCity: City = validCities[validCities.length - 1];
            const intermidiateCities = validCities.filter(city => city.name !== originCity.name && city.name !== destinationCity.name);
            var passengers = parseInt(String(passengersParam));
            var date = dateParam;
            if (originParam === "") {
                alert(`Specify the city of origin`)
            }
            if (destinationParam === "") {
                alert(`'Specify the city of destination`)
            }
            else {
                const results = await getDistance(originCity, destinationCity, intermidiateCities, passengers, date)

                setSearchResults(results);
                setSmallTableComponents(
                    [
                        {
                            desc: "Origin",
                            value: searchResults?.distanceBtnCities[0]?.city1?.name
                        },
                        {
                            desc: "Destination",
                            value: searchResults?.distanceBtnCities[searchResults.distanceBtnCities.length - 1]?.city2?.name
                        },
                        {
                            desc: "Departure",
                            value: searchResults?.date.substr(searchResults?.date.length - 12)
                        },
                        {
                            desc: "Total distance",
                            value: `${searchResults?.distanceBtnOriginAndDestination} Km`
                        },
                        {
                            desc: "Arrival",
                            value: searchResults?.date.substr(searchResults?.date.length - 12)
                        },
                        {
                            desc: "Passengers",
                            value: searchResults?.passengers
                        },
                    ]
                )
                if (searchResults.distanceBtnCities.length !== 0) {
                    setLoading(false)
                }
            }
        }

        if (originParam && destinationParam && passengersParam && dateParam && intermidiateCitiesParam) {
            usingParameters()
        }

    }, [searchResults]);


    return (
        loading ? <div className="flex flex-col min-w-full justify-center items-center pt-5 space-y-3">
            <CircularProgress />
            <p>Loading</p>
        </div> : (
            error ? <div className="flex flex-col min-w-full justify-center items-center pt-5 space-y-5">
                <p className="text-[150px] font-bold text-red-500">Oops!</p>
                <p>{error?.message}</p>
                <Link to={"/"}>
                    <button className="bg-purple-900 p-2  px-5 text-white  rounded-3xl text-lg">Return to search form</button>
                </Link>
            </div> :
                <div className=' flex w-full p-5 min-h-screen justify-center items-center bg-white'>
                    <div className="flex w-full md:w-[800px] min-h-[650px] space-y-10 p-5 rounded-md flex-col">
                        <h1 className="text-3xl font-extralight text-purple-900">Your Flight Details</h1>
                        <p className="text-xl font-semibold text-purple-900">{searchResults?.date}</p>
                        <div className="flex  bg-purple-50 flex-col w-full space-y-4">
                            <div className="flex p-5 flex-row justify-between w-full">
                                <h5 className="w-fit text-[50px] font-bold mt-10 text-purple-900">{searchResults?.distanceBtnCities[0]?.city1.name}</h5>
                                <img src={"airplane.gif"} className="w-52 h-40 object-contain rounded-md " />

                                <h5 className="w-fit text-[50px] font-bold mt-10 text-purple-900">{searchResults?.distanceBtnCities[searchResults?.distanceBtnCities.length - 1]?.city2.name}</h5>
                            </div>
                            <div className="flex flex-row p-5 justify-between">
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col space-y-2 w-fit mr-2">
                                            <p className="text-gray-500 text-sm">Departure</p>
                                            <p className="text-gray-500 text-sm">Check-in</p>
                                            <p className="text-gray-500 text-sm">Passengers</p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-gray-500 text-sm">: {searchResults?.date.substr(searchResults?.date.length - 12)}</p>
                                            <p className="text-gray-500 text-sm">: Enabled</p>
                                            <p className="text-gray-500 text-sm">: {searchResults?.passengers}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {searchResults?.distanceBtnCities.map(distanceDesc => (
                                        <div className="flex flex-row   ">
                                            <p className="w-40 mr-2 text-gray-500 text-sm">{distanceDesc?.city1?.name} - {distanceDesc?.city2?.name}</p>
                                            <p className="text-gray-500 text-sm">: &nbsp;{distanceDesc?.routeDistance} Km</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row">
                                        <div className="flex flex-col space-y-2 w-fit mr-2">
                                            <p className="text-gray-500 text-sm">Arrival</p>
                                            <p className="text-gray-500 text-sm">Total distance</p>
                                            <p className="text-gray-500 text-sm">On Time</p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-gray-500 text-sm">: {searchResults?.date.substr(searchResults?.date.length - 12)}</p>
                                            <p className="text-gray-500 text-sm">: {searchResults?.distanceBtnOriginAndDestination} Km   </p>
                                            <div className="flex flex-row space-x-2">
                                                <div className="flex w-3 h-3 mt-1.5 rounded-full bg-green-600" />
                                                <p className="text-sm">True</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-row w-full border-t border-black">
                                {smallTableComponents.map((component, index) => (

                                    <div className={`flex flex-col w-1/6  ${smallTableComponents.length - 1 !== index && "border-r"} border-black`}>
                                        <div className={`flex  justify-center items-center h-10  w-full text-purple-900  border-black   border-b font-bold`}>
                                            {component.desc} </div>
                                        <div className="flex  justify-center items-center h-10 w-full text-sm">{component.value}</div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>)
    );
};

export default SearchResults;
