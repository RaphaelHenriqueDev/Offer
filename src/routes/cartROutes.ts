import { Router } from 'express'
import { CartController } from '../controllers/CartController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js' // Importar o middleware

const router = Router()

router.post('/item', authMiddleware, CartController.addItem)
router.get('/', authMiddleware, CartController.listItems) // userId virá do token
router.put('/item/:itemId', authMiddleware, CartController.updateItemQuantity) // Nova rota para atualizar quantidade
router.delete('/item/:itemId', authMiddleware, CartController.removeItem) // Usar itemId
router.delete('/', authMiddleware, CartController.clearCart) // Nova rota para limpar carrinho

export { router as cartRoutes }
