import React, { useEffect, useState } from "react";
import { fetchWeather } from "../api/weatherApi.js";
import { Cloud, Wind, Thermometer, Search } from "lucide-react";

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState("Karachi");
    const [search, setSearch] = useState("Karachi");

    // Fetch weather data
    const getWeather = async () => {
        try {
            const response = await fetchWeather(search);
            setWeather(response.data);
            setLocation(response.data.name); // Set location dynamically
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    };

    useEffect(() => {
        getWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Convert Kelvin → Celsius
    const convertToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
            <div className="bg-white shadow-2xl rounded-2xl w-80 h-80 flex flex-col items-center justify-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-3">
                    Weather in <span className="text-blue-600">{location}</span>
                </h1>

                <div className="border-b border-gray-300 w-full mb-4"></div>

                {weather ? (
                    <div className="flex flex-col items-center gap-3 text-gray-700">
                        <div className="flex items-center gap-2 text-lg font-medium">
                            <Cloud className="text-blue-500" size={22} />
                            <span className="capitalize">{weather.weather[0].description}</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-medium">
                            <Wind className="text-green-500" size={22} />
                            <span>{weather.wind.speed} km/h</span>
                        </div>
                        <div className="flex items-center gap-2 text-lg font-medium">
                            <Thermometer className="text-red-500" size={22} />
                            <span>{convertToCelsius(weather.main.temp)}°C</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-gray-500 text-lg animate-pulse">Loading...</span>
                )}

                {/* Search input + button */}
                <div className="mt-5 flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Enter location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-40"
                    />
                    <button
                        onClick={getWeather}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition duration-200"
                    >
                        <Search size={18} />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Weather;
