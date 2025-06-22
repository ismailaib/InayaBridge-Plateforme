import axios from "axios";

const api = axios.create({
  baseURL: "https://inayabridge.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.response.use(
  (res: any) => res,
  (err: { response: { data: any; }; message: any; }) => {
    console.error("API error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
