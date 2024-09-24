import { API_ROOT } from '~/utils/constants';
import authorizedAxiosInstance from '~/utils/authorizedAxios';

export const handleLogoutAPI = async () => {
  // Với trường hợp dùng localStorage thì chỉ cần xóa thông tin user trong localStorage phía FE
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userInfo');
  // Với trường hợp dùng httpOnlyCookie thì sẽ gọi api để remove cookies
  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
};

export const refreshTokenAPI = async (refreshToken) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/refresh_token`,
    {
      refreshToken,
    }
  );
};
