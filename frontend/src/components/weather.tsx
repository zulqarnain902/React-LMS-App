import React, { useEffect, useState } from "react";
import { fetchWeather } from "../api/weatherApi.js";
import { Cloud, Wind, Thermometer, Search, Droplets, Sun, Moon } from "lucide-react";
import Layout from "@/Layout.js";

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [location, setLocation] = useState("Karachi");
    const [search, setSearch] = useState("Karachi");
    const [loading, setLoading] = useState(true);

    // Fetch weather data
    const getWeather = async () => {
        try {
            setLoading(true);
            const response = await fetchWeather(search);
            setWeather(response.data);
            setLocation(response.data.name);
        } catch (error) {
            console.error("Error fetching weather:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Convert Kelvin → Celsius
    const convertToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

    // Convert UNIX timestamp → Readable time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <Layout>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
                <div className="backdrop-blur-lg bg-white/20 shadow-2xl rounded-2xl w-96 min-h-[480px] flex flex-col items-center p-6 transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                    
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-3 tracking-wide">
                        Weather in <span className="text-yellow-300">{location}</span>
                    </h1>
                    <div className="border-b border-white/20 w-full mb-4"></div>

                    {/* Weather Content */}
                    {loading ? (
                        <span className="text-gray-200 text-lg animate-pulse">Fetching weather...</span>
                    ) : weather ? (
                        <div className="flex flex-col items-center gap-4 text-white text-center">
                            {/* Weather Icon */}
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather-icon"
                                className="w-24 h-24"
                            />

                            {/* Description */}
                            <p className="capitalize text-xl font-semibold">{weather.weather[0].description}</p>

                            {/* Temperature */}
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <Thermometer className="text-red-400" size={22} />
                                <span>{convertToCelsius(weather.main.temp)}°C</span>
                            </div>

                            {/* Wind */}
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <Wind className="text-green-400" size={22} />
                                <span>{weather.wind.speed} km/h</span>
                            </div>

                            {/* Humidity */}
                            <div className="flex items-center gap-2 text-lg font-medium">
                                <Droplets className="text-blue-300" size={22} />
                                <span>{weather.main.humidity}% Humidity</span>
                            </div>

                            {/* Sunrise & Sunset */}
                            <div className="flex items-center justify-center gap-6 mt-3">
                                <div className="flex flex-col items-center">
                                    <Sun className="text-yellow-300" size={22} />
                                    <span className="text-sm">{formatTime(weather.sys.sunrise)}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Moon className="text-orange-300" size={22} />
                                    <span className="text-sm">{formatTime(weather.sys.sunset)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <span className="text-red-300 text-lg">No weather data available</span>
                    )}

                    {/* Search input + button */}
                    <div className="mt-6 flex items-center gap-2 w-full justify-center">
                        <input
                            type="text"
                            placeholder="Enter location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-transparent bg-white/20 text-white placeholder-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 w-44"
                        />
                        <button
                            onClick={getWeather}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition duration-300"
                        >
                            <Search size={18} />
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Weather;
