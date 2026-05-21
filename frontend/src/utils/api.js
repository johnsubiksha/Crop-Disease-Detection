import axios from "axios";

const API = axios.create({

    baseURL: "http://127.0.0.1:8000"
});

export const getHealth = async () => {

    const response = await API.get("/");

    return response.data;
};

export const predictDisease = async (formData) => {

    const response = await API.post(

        "/predict",

        formData,

        {
            headers: {

                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};

export default API;