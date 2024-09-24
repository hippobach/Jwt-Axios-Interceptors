import axios from 'axios';
import { toast } from 'react-toastify';
import { handleLogoutAPI, refreshTokenAPI } from '~/apis';

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
    // Xử lý refresh token tự động
    // Nếu như nhận mã 401 từ BE thì gọi api logout luôn
    if (error.response?.status === 401) {
      handleLogoutAPI().then(() => {
        // Trường hợp dùng cookie thì nhớ xóa userInfo trong localStorage
        // localStorage.removeItem('userInfo');
        // Điều hướng tới trang login sau khi logout thành công
        location.href = '/login';
      });
    }
    // Nếu như nhận mã 410 từ BE thì gọi api refresh token
    // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
    const originalRequest = error.config;
    if (error.response?.status === 410 && !originalRequest._retry) {
      // Gán thêm một giá trị _retry luôn  = true trong khoảng thời gian chờ, để việc refresh token chỉ luôn gọi 1 lần tại 1 thời điểm
      originalRequest._retry = true;
      // Lấy refreshToken từ localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      //  Gọi api refresh token
      return refreshTokenAPI(refreshToken)
        .then((res) => {
          // Lấy và gán lại access token vào localStorage
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken);
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;

          // Trường hợp dùng cookie, return lại axios instance của chúng ta kết hợp với cái originalRequest để gọi lại những api ban đầu bị lỗi
          return authorizedAxiosInstance(originalRequest);
        })
        .catch((_error) => {
          // Nếu như nhận bất kỳ lỗi nào từ api refreshToken thì logout luôn
          handleLogoutAPI().then(() => {
            // Trường hợp dùng cookie thì nhớ xóa userInfo trong localStorage
            // localStorage.removeItem('userInfo');
            // Điều hướng tới trang login sau khi logout thành công
            location.href = '/login';
          });
          return Promise.reject(_error);
        });
    }
    // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ cho việc tự động refresh lại token
    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
