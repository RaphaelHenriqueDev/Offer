import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// Definir a interface para o Request para incluir o user
interface AuthRequest extends Request {
  userId?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Formato de token inválido.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number }
    req.userId = decoded.id
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' })
  }
}
