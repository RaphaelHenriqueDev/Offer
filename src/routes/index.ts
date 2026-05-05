import { Router } from 'express'
import { userRoutes } from './userRoutes.js'
import { productRoutes } from './productRoutes.js'
import { cartRoutes } from './cartROutes.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)

export { router }
