import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './auth.interface';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { id, password } = payload;

  // const user = new User();
  // const isUserExists = await User.findOne({id},{id:1, password:1, needsPasswordChange:1}).lean();

  const isUserExists = await User.isUserExists(id);

  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists');
  }

  //match password
  // const isPasswordMatched = await bcrypt.compare(password, isUserExists?.password);

  if (
    isUserExists.password &&
    !(await User.isPasswordMatched(password, isUserExists.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token
  const { id: userId, role, needsPasswordChange } = isUserExists;

  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  //create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  const { userId } = verifiedToken;

  const isUserExists = await User.isUserExists(userId);
  if (!isUserExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists');
  }
  //generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExists.id,
      role: isUserExists.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
