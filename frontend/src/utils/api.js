import axios from "axios";

const API = axios.create({

    baseURL: "https://crop-disease-detection-2-ox1q.onrender.com"
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
