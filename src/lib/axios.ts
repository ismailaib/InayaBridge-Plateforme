import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "https://inayabridge.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default axiosInstance
