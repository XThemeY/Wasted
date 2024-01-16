import jwt from 'jsonwebtoken'
import { secret } from '../../config.js'
import { User } from '../../db/models/index.js'

export default async function (req, res, next) {
  try {
    const sessionToken = req.cookies['WASTED-AUTH']
    if (!sessionToken) {
      return res.status(403).json({
        message: `Пользователь не авторизован`,
      })
    }

    const existingUser = await User.getUserBySessionToken(sessionToken)
    if (!existingUser) {
      return res.status(403).json({
        message: `Пользователь не найден`,
      })
    }
    const decodedData = jwt.verify(sessionToken, secret)

    req.user = decodedData

    next()
  } catch (e) {
    return res.status(403).json({
      message: `Пользователь не авторизован`,
    })
  }
}

export async function isOwner(req, res, next) {
  try {
    const { username } = req.params

    const currentUserName = req.user.username
    if (!currentUserName) {
      return res.sendStatus(403)
    }

    if (currentUserName !== username) {
      return res.sendStatus(403)
    }

    next()
  } catch (e) {
    console.log(e)
    return res.sendStatus(403)
  }
}
