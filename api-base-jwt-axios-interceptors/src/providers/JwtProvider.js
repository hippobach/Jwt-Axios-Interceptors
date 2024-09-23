import JWT from 'jsonwebtoken';

/**
 * Function generateToken tạo mới một token - Cần 3 tham số đầu vào
 * userInfo: những thông tin muốn đính kèm vào token
 * secretSignature: chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên là privateKey
 * tokenLife: thời gian sống của token
 */
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện Jwt - Thuật toán mặc định là HS256
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife,
    });
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Function verifyToken kiểm tra một token có hợp lệ hay không
 * Hợp lệ là khi cái token được tạo ra có đúng với chữ ký bí mật secretSignature trong dự án hay không
 */
const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify của thư viện Jwt
    return JWT.verify(token, secretSignature);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 */
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP';
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL';

export const JwtProvider = {
  generateToken,
  verifyToken,
};
