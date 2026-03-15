import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes     from './routes/auth.js'
import productRoutes  from './routes/products.js'
import supplierRoutes from './routes/suppliers.js'
import customerRoutes from './routes/customers.js'  // ← ADD

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth',      authRoutes)
app.use('/api/products',  productRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/customers', customerRoutes)  // ← ADD

app.get('/', (req, res) => {
  res.json({ message: '✅ StockSense API is running!' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})