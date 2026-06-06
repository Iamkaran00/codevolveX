import axios from "axios";
export const axiosInstance = axios.create({
  VITE_BASE_URL: "http://localhost:5502/api/v1/",

  headers: {
    "Content-Type": "application/json", // Default headers
  },
});

export const apiConnector = (method, url, bodyData, params, headers) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
