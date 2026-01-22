import axios from "axios";
import { ErrorToast } from "./components/Toaster";
// import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const baseUrl = "https://www.api.chubbsarmy.com";
// export const baseUrl = "https://0jxxmx1m-5000.inc1.devtunnels.ms/";

// async function getDeviceFingerprint() {
//   const fp = await FingerprintJS.load();
//   const result = await fp.get();
//   console.log(result.visitorId); // Unique device ID
//   return result.visitorId;
// }

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    devicemodel: navigator.userAgent,
    deviceuniqueid: navigator.userAgent,
  },
  timeout: 10000, // 10 seconds timeout
});

instance.interceptors.request.use((request) => {
  const token = localStorage.getItem("token");
  if (!navigator.onLine) {
    // No internet connection
    ErrorToast(
      "No internet connection. Please check your network and try again.",
    );
    return Promise.reject(new Error("No internet connection"));
  }

  // Merge existing headers with token
  request.headers = {
    ...request.headers, // Keep existing headers like devicemodel and deviceuniqueid
    Accept: "application/json, text/plain, */*",
    ...(token && { Authorization: `Bearer ${token}` }), // Add Authorization only if token exists
  };

  return request;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      // Slow internet or request timeout
      ErrorToast("Your internet connection is slow. Please try again.");
    }

    if (error.response && error.response.status === 401) {
      // Unauthorized error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      ErrorToast("Session expired. Please relogin");
      // window.location.href = "/";s
    }

    return Promise.reject(error);
  },
);

export default instance;
