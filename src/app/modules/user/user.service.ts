import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { generatedUserId } from './user.utils';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<IUser | null> => {
  const id = await generatedUserId();
  user.id = id;

  if (!user.password) {
    user.password = config.default_user_pass as string;
  }
  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new ApiError(400, 'Failed to created user');
  }
  return createdUser;
};

export const UserService = {
  createUser,
};
