import express from 'express'
const router = express.Router()
import { 
    getProducts,
    getCustomers,
    getTransactions,
    getGeography,
    createProduct,
    updateProduct,
    deleteProduct 
} from '../controllers/clients.js'

router.get('/products', getProducts)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)

router.get('/customers', getCustomers)
router.get('/transactions', getTransactions)
router.get('/geography', getGeography)

export default router