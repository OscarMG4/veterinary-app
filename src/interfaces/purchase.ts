export interface PurchaseItemRequest {
  productId: number
  quantity: number
  price: number
}

export interface PurchaseRequest {
  supplierId: number
  items: PurchaseItemRequest[]
}

export interface PurchaseResponse {
  id: number
  documentNumber: string
  total: number
  products: string[]
}
