const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper to get token from localStorage
function getToken() {
  const user = localStorage.getItem('stocksense_user')
  if (!user) return null
  return JSON.parse(user).token
}

// Helper for headers
function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  }
}

// ── GET ALL PRODUCTS ─────────────────────────────────────────
export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products`, {
    headers: headers()
  })
  const data = await res.json()
  return data.data
}

// ── CREATE PRODUCT ───────────────────────────────────────────
export async function addProduct(product) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(product)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.data
}

// ── UPDATE PRODUCT ───────────────────────────────────────────
export async function editProduct(id, product) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(product)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data.data
}

// ── DELETE PRODUCT ───────────────────────────────────────────
export async function removeProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: headers()
  })
//   const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}