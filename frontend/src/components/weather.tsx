import React, { useEffect, useState } from "react";
import { fetchWeather } from "../api/weatherApi.js";
import {
  Sun,
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  Sunrise,
  Sunset,
  Compass,
  Search,
  Gauge
} from "lucide-react";
import moment from "moment";

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [search, setSearch] = useState("Karachi");
  const [location, setLocation] = useState("Karachi");

  // Fetch weather from API
  const getWeather = async () => {
    try {
      const response = await fetchWeather(search);
      setWeather(response.data);
      setLocation(response.data.name);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  useEffect(() => {
    getWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Convert Kelvin → Celsius
  const toCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

  // Convert UNIX timestamp → Time
  const formatTime = (timestamp) => moment.unix(timestamp).format("hh:mm A");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl rounded-2xl w-[450px] p-6 text-white transition-transform duration-300 hover:scale-105">
        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-5">
          <input
            type="text"
            placeholder="Search city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={getWeather}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-200"
          >
            <Search size={18} /> Search
          </button>
        </div>

        {/* Location & Date */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{location}</h2>
          <p className="text-gray-200">
            {moment().format("dddd, MMMM D")}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-5">
          {/* Weather Icon */}
          {weather && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt="Weather Icon"
              className="w-28 h-28 drop-shadow-lg"
            />
          )}

          {/* Temperature & Description */}
          {weather && (
            <div>
              <h1 className="text-5xl font-bold">
                {toCelsius(weather.main.temp)}°C
              </h1>
              <p className="text-lg">
                Feels like {toCelsius(weather.main.feels_like)}°C
              </p>
              <p className="capitalize text-xl text-gray-200">
                {weather.weather[0].description}
              </p>
            </div>
          )}
        </div>

        {/* Weather Stats */}
        {weather && (
          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <Droplets size={20} className="text-blue-300" />
              <span>Humidity: {weather.main.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={20} className="text-green-300" />
              <span>Wind: {weather.wind.speed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass size={20} className="text-yellow-300" />
              <span>Direction: {weather.wind.deg}°</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge size={20} className="text-red-300" />
              <span>Pressure: {weather.main.pressure} hPa</span>
            </div>
            <div className="flex items-center gap-2">
              <Sunrise size={20} className="text-orange-300" />
              <span>Sunrise: {formatTime(weather.sys.sunrise)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sunset size={20} className="text-pink-300" />
              <span>Sunset: {formatTime(weather.sys.sunset)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
