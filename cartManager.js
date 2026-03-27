class CartManager {
  constructor() {
    this.items = []
    this.discount = 0
  }

  addItem(name, price, quantity = 1) {
    if (!name || typeof name !== "string") throw new Error("Invalid item name")
    if (typeof price !== "number" || price <= 0)
      throw new Error("Invalid price")
    if (!Number.isInteger(quantity) || quantity <= 0)
      throw new Error("Invalid quantity")
    const existing = this.items.find((i) => i.name === name)
    if (existing) {
      existing.quantity += quantity
    } else {
      this.items.push({ name, price, quantity })
    }
  }


  removeItem(name) {
    const index = this.items.findIndex((i) => i.name === name)
    if (index === -1) throw new Error("Item not found")
    this.items.splice(index, 1)
  }


  getTotal() {
    const subtotal = this.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    )
    return Math.round(subtotal * (1 - this.discount / 100) * 100) / 100
  }


  applyDiscount(code) {
    const codes = { SAVE10: 10, SAVE20: 20, HALF: 50 }
    if (!codes[code]) throw new Error("Invalid discount code")
    this.discount = codes[code]
  }

  validateCart() {
    if (this.items.length === 0)
      return { valid: false, reason: "Cart is empty" }
    if (this.getTotal() <= 0)
      return { valid: false, reason: "Total must be positive" }
    return { valid: true, reason: null }
  }

  getItemCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0)
  }
  
  clear() {
    this.items = []
    this.discount = 0
  }
}

module.exports = CartManager
