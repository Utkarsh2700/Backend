import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BACKEND_BASEURL,
  withCredentials: true,
  // headers:{
  //     Authorization:`Bearer`
  // }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orignalRequest = error.config;
    if (error.response.status === 401 && !orignalRequest._retry) {
      orignalRequest._retry = true;
      try {
        const response = await axios.post(
          `${
            import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
          }/users/refresh-token`
        );

        const { accessToken } = response.data.data;
        const encryptedToken = btoa(accessToken);
        localStorage.setItem("token", encryptedToken);

        // Update the orignal request headers with the new token
        orignalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(orignalRequest);
      } catch (refreshError) {
        // Handle refresh failure
        console.error("Failed to refresh accessToken", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        // Optionally, redirect to login page
      }
    }
    return Promise.reject(error);
  }
);
export default api;
