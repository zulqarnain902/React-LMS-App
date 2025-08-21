import axios from "axios"

const api = axios.create({
    // baseURL: "https://goweather.xyz/",
    baseURL: "https://api.openweathermap.org/data/2.5/",
    headers: {
        "Content-Type": "application/json",
    },
})


export const fetchWeather = async (location) => {
    try {
        // const response = await api.get(`weather/${location}`);
        const response = await api.get(`weather?q=${location},pk&appid=5d877018b14afb7aa749d658cff4a88b`);
        return response;
    } catch (error) {
        return error;
    }
}