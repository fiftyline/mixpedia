import axios from "axios";

axios.defaults.baseURL = ""; // 상대경로 유지 (nginx 프록시 사용)

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
