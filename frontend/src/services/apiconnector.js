import axios from "axios";
export const axiosInstance = axios.create({
  VITE_BASE_URL: "https://codevolvex.onrender.com/api/v1/",

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
