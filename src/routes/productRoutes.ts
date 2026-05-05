import { Router } from 'express'
import { ProductController } from '../controllers/ProductController.js'

const router = Router()

router.post('/', ProductController.create)
router.put('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)
router.get('/', ProductController.getAll)

export { router as productRoutes }
