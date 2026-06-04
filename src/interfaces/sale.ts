export interface SaleItemRequest {
  productId: number
  quantity: number
  price: number
}

export interface SaleRequest {
  customerId: number
  discount?: number
  items: SaleItemRequest[]
}

export interface SaleResponse {
  id: number
  documentNumber: string
  subtotal: number
  discount: number
  total: number
  products: string[]
}
