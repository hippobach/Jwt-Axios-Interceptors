import { StatusCodes } from 'http-status-codes';
import {
  JwtProvider,
  ACCESS_TOKEN_SECRET_SIGNATURE,
} from '~/providers/JwtProvider';

// Middleware này sẽ đảm nhận việc quan trọng: lấy và xác thực JWT accessToken nhận được từ phía FE có hợp lệ hay  không
const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios và credentials trong CORS
  // const accessTokenFromCookie = req.cookies?.accessToken;
  // if (!accessTokenFromCookie) {
  //   res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ message: 'Unauthorized! Token not found' });
  //   return;
  // }
  // Cách 2: Lấy accessToken trong trường hợp phía FE lưu localStorage và gửi lên thông qua header authorization
  const accessTokenFromHeader = req.headers.authorization;
  if (!accessTokenFromHeader) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! Token not found' });
    return;
  }

  try {
    // Bước 1: Thực hiện giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      // accessTokenFromCookie,
      accessTokenFromHeader.substring('Bearer '.length),
      ACCESS_TOKEN_SECRET_SIGNATURE
    );
    // Bước 2: Nếu như token hợp lệ, thì sẽ cần phải lưu thông tin giải mã được vào req.jwtDecoded, để sử dụng cho các tầng xử lý phía sau
    req.jwtDecoded = accessTokenDecoded;
    // Bước 3: Cho phép cái request đi tiếp
    next();
  } catch (error) {
    // Trường hợp lỗi 1: nếu cái accessToken bị hết hạn (expired) thì mình cần trả về một cái mã lỗi là GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Token expired' });
      return;
    }
    // Trường hợp lỗi 2: nếu cái accessToken không hợp lệ do bất kỳ điều gì khác thì trả về mã lỗi 401 cho phía FE logout hoặc gọi api logout tùy trường hợp
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Invalid token! Please Log In' });
  }
};

export const authMiddleware = { isAuthorized };
