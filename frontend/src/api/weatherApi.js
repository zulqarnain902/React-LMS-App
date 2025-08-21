import axios from "axios"

const api = axios.create({
    baseURL: "https://goweather.xyz/",
    headers: {
        "Content-Type": "application/json",
    },
})


export const fetchWeather = async (location) => {
    try {
        const response = await api.get(`weather/${location}`);
        return response;
    } catch (error) {
        return error;
    }
}