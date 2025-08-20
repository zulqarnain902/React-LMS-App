import React, { useEffect, useState } from 'react'
import { fetchWeather } from "../api/weatherApi.js";

const Weather = () => {

    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState("kashmir");

    useEffect(() => {
        const getWeather = async () => {
            const response = await fetchWeather(location);
            console.log(response.data);
            setWeather(response.data);
        };

        getWeather();
    }, []);


    return (
        // <div>Weather: {weather ? weather : "Loading..."}</div>
        <div className='ml-2 flex justify-between items-center gap-2 bg-gray-800 p-4 text-white rounded-lg'>

            Weather in {location}
            <div className='border-l-2 border-blue-500 pl-2  flex flex-col items-center'>
                {weather ? (
                    <>
                        <span>{weather.description}</span>
                        <span>{weather.wind} km/h</span>
                        <span>{weather.temperature}°C</span>
                    </>
                ) : (
                    <span>Loading...</span>
                )}
            </div>


        </div>
    )
}

export default Weather;