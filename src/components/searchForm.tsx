import React, { useState } from 'react'
import AirplanemodeActive from '@mui/icons-material/AirplanemodeActive'
import SingleInputComboBox from './SingleInputComboBox'
import MultipleInputComboBox from './MultipleInputComboBox'
import { getCities } from '../api/cities';
import UnLoadingSingleInputComboBox from './UnLoadingSingleInputComboBox'
import { DatePickerDescktop, DatePickerMobile } from './DatePickers'
import Button from '@material-ui/core/Button';
import { City, formErrors, DistanceResponse } from '../utils/types'
import dayjs from 'dayjs'
import { getDistance } from '../api/distance';
import { Link } from 'react-router-dom'

interface Props {

}


const SearchForm: React.FC<Props> = (props) => {
    const [origin, setOrigin] = React.useState<City | null>(null);
    const [destination, setDestination] = React.useState<City | null>(null);
    const [intermediateCities, setIntermediateCities] = React.useState<City[] | null>([]);
    const [date, setDate] = React.useState<string | null>();
    const [passengers, setPassengers] = React.useState<number | null>(null);
    const [searchResults, setSearchResults] = React.useState<DistanceResponse>({
        distanceBtnCities: [],
        distanceBtnOriginAndDestination: 0,
        passengers: 0,
        date: ""
    });
    const [formErrors, setFormErrors] = React.useState<formErrors>({
        origin: '',
        destination: '',
        date: '',
        passengers: '',
    });
    const [isFormValid, setIsFormValid] = React.useState(false);
    const handleOriginSelect = (event: React.SyntheticEvent<Element, Event>, city: City | null) => {
        setOrigin(city);
    };
    const handleOriginChange = (event: any) => {
        //handleChange(event)
    }
    const handleDestinationSelect = (event: React.SyntheticEvent<Element, Event>, city: City | null) => {
        setDestination(city);
    };

    const handleDestinationChange = (event: any) => {
        const city: City = event.target.value;
        setDestination(city);
    };

    const handlePassengersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const numberOfPassengers = parseInt(event.target.value);
        setPassengers(numberOfPassengers);
    };


    const handleDateSelect = (date: dayjs.Dayjs | null) => {
        setDate(date?.toString());

    };



    const handleIntermediateCitySelect = (event: React.SyntheticEvent<Element, Event>, cities: City[] | null) => {
        setIntermediateCities(cities);
    };

    const validateForm = () => {
        let originError = '';
        let destinationError = '';
        let dateError = '';
        let passengersError = '';
        let isFormValid = true;

        if (!origin) {
            originError = 'Please select a city of origin';
            isFormValid = false;
        }

        if (!destination) {
            destinationError = 'Please select a city of destination';
            isFormValid = false;
        }

        if (!date) {
            dateError = 'Please select a date for the trip';
            isFormValid = false;
        }

        if (!passengers) {
            passengersError = 'Please enter the number of passengers';
            isFormValid = false;
        }

        setFormErrors({
            origin: originError,
            destination: destinationError,
            date: dateError,
            passengers: passengersError,
        });
        setIsFormValid(isFormValid);
    };


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isFormValid) {
         //handle form submission
        }
    }
    React.useEffect(() => {

        const params = new URLSearchParams(window.location.search);
        var destinationParam = params.get("destination");
        var originParam = params.get("origin");
        var passengersParam = params.get("passengers");
        var dateParam = params.get("date");
        var intermidiateCitiesParamSting = params.get("intermidiate_cities");
        var intermidiateCitiesParam = String(intermidiateCitiesParamSting)?.split(",")

        const usingParameters = async () => {
            var citiesInvolved: string[] = [];

            //add the originCity
            citiesInvolved.push(String(originParam));
            //add all intermidiate cities;
            intermidiateCitiesParam?.forEach(cityName => { citiesInvolved.push(cityName) })
            //add the destinationCity
            citiesInvolved.push(String(destinationParam));

            const validCities: City[] = await getCities(citiesInvolved);
            const originCity: City = validCities[0];
            const destinationCity: City = validCities[validCities.length - 1];
            const intermidiateCitiesFound = validCities.filter(city => city.name !== originCity.name && city.name !== destinationCity.name);
            var passengers = parseInt(String(passengersParam));
            var date = dateParam;

            if (originParam === "") {
                alert(`Specify the city of origin`)
            }
            if (destinationParam === "") {
                alert(`'Specify the city of destination`)
            }
            else {
                setOrigin(originCity);
                setDestination(destinationCity);
                setPassengers(parseInt(String(passengersParam)));
                setDate(dateParam);
                setIntermediateCities(intermidiateCitiesFound);

            }

            const results = await getDistance(origin, destination, intermediateCities, passengers, date)
            setSearchResults(results);
        }



        if (originParam && destinationParam && passengersParam && dateParam && intermidiateCitiesParamSting) {
            usingParameters()

        }

        validateForm();
    }, [origin, destination, date, passengers]);


    return (

        <div className=' flex w-full p-5 min-h-screen justify-center items-center bg-gray-100'>

            <form
                className="flex w-full md:w-[500px] min-h-[600px] space-y-4 p-5 bg-white rounded-md flex-col" onSubmit={handleSubmit}>

                <div className='flex w-full space-4 justify-center'>
                    <AirplanemodeActive className='rotate-90 text-purple-700' fontSize='large' />
                    <h5 className="text-3xl font-extralight">FLY</h5>
                </div>
                <p className='text-center w-full mt-5'>Analyze your destination better</p>
                <SingleInputComboBox value={origin} formError={formErrors.origin} handleSelect={handleOriginSelect} handleChange={handleOriginChange} formPartLabel={"City of origin"} />
                <SingleInputComboBox value={destination} formError={formErrors.destination} handleSelect={handleDestinationSelect} handleChange={handleDestinationChange} formPartLabel={"City of destination"} />
                <MultipleInputComboBox value={intermediateCities} handleSelect={handleIntermediateCitySelect} formPartLabel={"Intermediate cities"} />
                <UnLoadingSingleInputComboBox value={passengers} type={"number"} handleChange={handlePassengersChange} formError={formErrors.passengers} formPartLabel={"Number of passengers"} />
                <DatePickerDescktop formError={formErrors.date} handleSelect={handleDateSelect} formPartLabel={"Date of trip"} />
                {isFormValid ?
                    (
                        <Link to={`/search_results?origin=${origin?.name}&destination=${destination?.name}&date=${date}&passengers=${passengers}&intermidiate_cities=${intermediateCities?.map(city => city.name).join(',')}`}>

                            <Button style={{ color: "white", background: "rgb(126 34 206)", padding: 10 }} color="primary" variant="contained" fullWidth type="submit">
                                Submit
                            </Button>
                        </Link>
                    )
                    :
                    (
                        <Button disabled style={{ color: "white", background: "rgb(126 34 206)", padding: 10 }} color="primary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    )
                }
            </form>
        </div>

    )
}

export default SearchForm