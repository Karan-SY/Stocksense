import prisma from '../prisma.js'

export async function getCustomers(req, res) {
  try {
    const customers = await prisma.customer.findMany()
    res.json({ success: true, data: customers })
  } catch (error) {
    console.error('Get customers error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function getCustomer(req, res) {
  try {
    const { id } = req.params
    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: { bills: true }
    })
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }
    res.json({ success: true, data: customer })
  } catch (error) {
    console.error('Get customer error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function createCustomer(req, res) {
  try {
    const { name, phone, email, address } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Customer name is required' })
    }

    const customer = await prisma.customer.create({
      data: { name, phone, email, address }
    })

    res.status(201).json({ success: true, data: customer })
  } catch (error) {
    console.error('Create customer error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function updateCustomer(req, res) {
  try {
    const { id } = req.params
    const { name, phone, email, address } = req.body

    const existing = await prisma.customer.findUnique({
      where: { customer_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    const updated = await prisma.customer.update({
      where: { customer_id: id },
      data: { name, phone, email, address }
    })

    res.json({ success: true, data: updated })
  } catch (error) {
    console.error('Update customer error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { id } = req.params

    const existing = await prisma.customer.findUnique({
      where: { customer_id: id }
    })
    if (!existing) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    await prisma.customer.delete({
      where: { customer_id: id }
    })

    res.json({ success: true, message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Delete customer error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}