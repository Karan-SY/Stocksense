import express from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// protect means you must be logged in to use these routes
router.get('/',     protect, getProducts)
router.get('/:id',  protect, getProduct)
router.post('/',    protect, createProduct)
router.put('/:id',  protect, updateProduct)
router.delete('/:id', protect, deleteProduct)

export default router