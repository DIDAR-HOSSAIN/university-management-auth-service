import { Request, Response } from 'express'
import usersService from './users.service'

export const createUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body
    const result = await usersService.createUser(user)
    res.status(200).json({
      success: true,
      message: 'Create user Successfully',
      data: result,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create user',
    })
  }
}

export default {
  createUser,
}
