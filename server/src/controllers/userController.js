import { User } from '../db/models/index.js'

const excludeFields = '-_id -__v -password -email'

class UserController {
  async getUser(req, res) {
    try {
      const username = req.params.username
      const user = await User.getUserByUsername(username)
        .populate('roles', excludeFields)
        .populate('favorites.movies', excludeFields)
        .exec()

      if (!user) {
        return res.status(400).json({
          message: `Пользователя не существует`,
        })
      }
      res.status(200).json(user).end()
    } catch (e) {
      console.log('getUser:', e)
      res.sendStatus(500)
    }
  }

  async getUserAll(req, res) {
    try {
      const users = await User.getUserAll()
        .populate('roles', excludeFields)
        .populate('favorites.movies', excludeFields)
        .exec()
      const totalCount = await User.getUsersCount()
      const response = { items: users, total_items: totalCount }
      res.status(200).json(response).end()
    } catch (e) {
      console.log('getUserAll:', e)
      res.sendStatus(400)
    }
  }

  async updateUser(req, res) {
    try {
      const nickname = req.params.username
      const { gender } = req.body
      if (!gender) {
        return res.sendStatus(400)
      }
      const user = await User.getUserByUsername(nickname)

      user.gender = gender
      await user?.save()

      res.status(200).json(user).end()
    } catch (e) {
      console.log('getUserAll:', e)
      res.sendStatus(400)
    }
  }
}

export default new UserController()
