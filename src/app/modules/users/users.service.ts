import config from '../../../config'
import { generatedUserId } from './user.utils'
import { IUser } from './users.interface'
import { User } from './users.model'

const createUser = async (user: IUser): Promise<IUser | null> => {
  const id = await generatedUserId()
  user.id = id

  if (!user.password) {
    user.password = config.default_user_pass as string
  }
  const createdUser = await User.create(user)

  if (!createdUser) {
    throw new Error('Failed to created user')
  }
  return createdUser
}

export default {
  createUser,
}
