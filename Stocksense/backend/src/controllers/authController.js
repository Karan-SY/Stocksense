import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma.js'

export async function signup(req, res) {
  try {
    const { fullName, email, password, role } = req.body

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        role: (role || 'cashier').toLowerCase() 
      }
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully'
    })

  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email }
    })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
}

export async function logout(req, res) {
  res.json({ success: true, message: 'Logged out successfully' })
}