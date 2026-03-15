import prisma from '../prisma.js'

export async function getSuppliers(req, res) {
  try {
    const suppliers = await prisma.manufacturer.findMany({
      include: { products: true }
    })
    res.json({ success: true, data: suppliers })
  } catch (error) {
    console.error('Get suppliers error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getSupplier(req, res) {
  try {
    const { id } = req.params
    const supplier = await prisma.manufacturer.findUnique({
      where: { manufacturer_id: id },
      include: { products: true }
    })
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' })
    }
    res.json({ success: true, data: supplier })
  } catch (error) {
    console.error('Get supplier error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function createSupplier(req, res) {
  try {
    const { name, phone, address } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Supplier name is required' })
    }
    const supplier = await prisma.manufacturer.create({
      data: { name, phone, address }
    })
    res.status(201).json({ success: true, data: supplier })
  } catch (error) {
    console.error('Create supplier error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function updateSupplier(req, res) {
  try {
    const { id } = req.params
    const { name, phone, address } = req.body
    const existing = await prisma.manufacturer.findUnique({
      where: { manufacturer_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Supplier not found' })
    }
    const updated = await prisma.manufacturer.update({
      where: { manufacturer_id: id },
      data: { name, phone, address }
    })
    res.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update supplier error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function deleteSupplier(req, res) {
  try {
    const { id } = req.params
    const existing = await prisma.manufacturer.findUnique({
      where: { manufacturer_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Supplier not found' })
    }
    await prisma.manufacturer.delete({
      where: { manufacturer_id: id }
    })
    res.json({ success: true, message: 'Supplier deleted successfully' })
  } catch (error) {
    console.error('Delete supplier error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}