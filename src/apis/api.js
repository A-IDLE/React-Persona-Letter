import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;


// axios 기본 인스턴스 생성
export const request = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // 기본 옵션으로 설정
});


// Use an interceptor to add the token to each request
request.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);