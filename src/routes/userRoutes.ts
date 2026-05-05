import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js' // Importar o middleware

const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.put('/:id', authMiddleware, UserController.update)    // Protegida
router.delete('/:id', authMiddleware, UserController.delete)  // Protegida

export { router as userRoutes }
