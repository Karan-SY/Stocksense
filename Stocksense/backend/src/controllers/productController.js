import prisma from '../prisma.js'

// ── GET ALL PRODUCTS ─────────────────────────────────────────
export async function getProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      include: {
        manufacturer: true,  // also fetch manufacturer details
        inventory: true,     // also fetch stock details
      }
    })
    res.json({ success: true, data: products })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ── GET ONE PRODUCT ──────────────────────────────────────────
export async function getProduct(req, res) {
  try {
    const { id } = req.params

    const product = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        manufacturer: true,
        inventory: true,
      }
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({ success: true, data: product })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ── CREATE PRODUCT ───────────────────────────────────────────
export async function createProduct(req, res) {
  try {
    console.log('Received data:', req.body)
    const {
      name,
      category,
      price,
      supplier,        // ← name typed by user e.g. "ABC Foods"
      quantity,
      min_stock_level
    } = req.body

    // 1. Find manufacturer by name OR create it automatically
    let manufacturer = await prisma.manufacturer.findFirst({
  where: {
    name: supplier
  }
})

    // If manufacturer doesn't exist, create it automatically
    if (!manufacturer) {
      manufacturer = await prisma.manufacturer.create({
        data: { name: supplier }
      })
    }

    // 2. Create the product with the found/created manufacturer
    const product = await prisma.product.create({
      data: {
        name,
        category,
        price,
        manufacturer_id: manufacturer.manufacturer_id,
      }
    })

    // 3. Create inventory record
    await prisma.inventory.create({
      data: {
        product_id: product.product_id,
        quantity: quantity || 0,
        min_stock_level: min_stock_level || 0,
      }
    })

    // 4. Return complete product
    const fullProduct = await prisma.product.findUnique({
      where: { product_id: product.product_id },
      include: {
        manufacturer: true,
        inventory: true,
      }
    })

    res.status(201).json({ success: true, data: fullProduct })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ── UPDATE PRODUCT ───────────────────────────────────────────
export async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const {
      name,
      category,
      price,
      supplier,        // ← name typed by user
      quantity,
      min_stock_level
    } = req.body

    // 1. Check product exists
    const existing = await prisma.product.findUnique({
      where: { product_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // 2. Find or create manufacturer by name
    let manufacturer = await prisma.manufacturer.findFirst({
      where: { name: supplier }
    })
    if (!manufacturer) {
      manufacturer = await prisma.manufacturer.create({
        data: { name: supplier }
      })
    }

    // 3. Update product
    await prisma.product.update({
      where: { product_id: id },
      data: {
        name,
        category,
        price,
        manufacturer_id: manufacturer.manufacturer_id
      }
    })

    // 4. Update inventory
    await prisma.inventory.update({
      where: { product_id: id },
      data: { quantity, min_stock_level }
    })

    // 5. Return updated product
    const updated = await prisma.product.findUnique({
      where: { product_id: id },
      include: {
        manufacturer: true,
        inventory: true,
      }
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

// ── DELETE PRODUCT ───────────────────────────────────────────
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params

    // 1. Check product exists
    const existing = await prisma.product.findUnique({
      where: { product_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // 2. Delete inventory first (because it depends on product)
    await prisma.inventory.delete({
      where: { product_id: id }
    })

    // 3. Now delete the product
    await prisma.product.delete({
      where: { product_id: id }
    })

    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}