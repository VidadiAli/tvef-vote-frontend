import axios from "axios";

export const api = axios.create({
  baseURL: "https://tvef-vote-backend.onrender.com/api",
  withCredentials: true,
});