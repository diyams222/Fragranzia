import axios from "axios";

// const apiUrl = import.meta.env.VITE_BACKEND_URL;
const apiUrl = "https://fragranzia-8wte.onrender.com";


export const BASE_URL = apiUrl;
export const MEDIA_URL = "";


export const axiosPrivate = axios.create({
  baseURL: BASE_URL
});