import axios from "axios"
import { data } from "react-router";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})


export const register = async (data) => {
    try {
        const response = await api.post("/user/register", data);
        return response.data;
    } catch (error) {
        return error;
    }
}
export const loginWithGoogle = async (data) => {
    try {
        const response = await api.post("/user/auth/google", data);
        return response;
    } catch (error) {
        return error;
    }
}

export const login = async (data) => {
    try {
        const response = await api.post("/user/login", data);
        return response.data;
    } catch (error) {
        return error;
    }
}
export const logout = async () => {
    try {
        const response = await api.post("/user/logout");
        return response.data;
    } catch (error) {
        return error;
    }
}

export const resetPasswordEmail = async (data) => {
    try {
        const response = await api.post("/user/reset-password-email", data);
        return response;
    } catch (error) {
        return error;
    }
}

export const ResetPassword = async (token, data) => {
    try {
        const response = await api.post(`/user/reset-password/${token}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const refresh = async () => {
    try {
        const response = await api.get("/user/refresh");
        return response;
    } catch (error) {
        return error;
    }
}

export const userHasNoPass = async (userId) => {
    try {
        const response = await api.get(`/user/hasnopassword/${userId}`);
        return response;
    } catch (error) {
        return error;
    }
}

export const changeUserPassword = async (userId, data) => {
    try {
        const response = await api.put(`/user/change-password/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const updateUserById = async (userId, data) => {
    try {
        const response = await api.patch(`/user/update/${userId}`, data);
        return response;
    } catch (error) {
        return error;
    }
}

export const deleteUserAccount = async (userId) => {
    try {
        const response = await api.delete(`/user/delete/${userId}`);
        return response;
    } catch (error) {
        return error;
    }

}



// auto token refresh

// /protected-resource -> 401
// /refresh -> authenthicated state
// /protected-resource


api.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalReq = error.config;

        // extract the value of message from json response if it exists
        const errorMessage = error.response && error.response.data && error.response.data.message;

        if (
            errorMessage === 'Unauthorized' &&
            (error.response.status === 401 || error.response.status === 500) &&
            originalReq &&
            !originalReq._isRetry
        ) {
            originalReq._isRetry = true;

            try {
                await axios.get(`${process.env.REACT_APP_INTERNAL_API_PATH}/refresh`, {
                    withCredentials: true,
                });

                return api.request(originalReq);
            } catch (error) {
                return error;
            }
        }
        throw error;
    }
);