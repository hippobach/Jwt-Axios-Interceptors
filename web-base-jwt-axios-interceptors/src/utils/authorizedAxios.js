import axios from 'axios';
import { toast } from 'react-toastify';

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của một request: để 10 mins
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: sẽ cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE (phục vụ trường hợp nếu sử dụng JWT Tokens (refresh & access) theo cơ chế httpOnly Cookie)
authorizedAxiosInstance.defaults.withCredentials = true;

// Cấu hình Interceptors (bộ đánh chặn vào giữa mọi request và response)
// Add a request interceptor: can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Lấy access token từ local storage và đính kèm vào header
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Nếu có access token, thêm vào header Authorization với phương thức Bearer và token
      // Cần thêm 'Bearer' vì cần tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor: can thiệp vào những response API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ cho việc tự động refresh lại token
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
