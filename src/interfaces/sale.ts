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

export interface SaleDetailResponse {
  id: number
  documentNumber: string
  customerId: number
  discount: number
  items: SaleItemRequest[]
}

export interface SaleListResponse {
  id: number
  documentNumber: string
  saleDate: string
  customerName: string
  subtotal: number
  discount: number
  total: number
  createdBy: string
  products: string[]
}

export interface SaleResponse {
  id: number
  documentNumber: string
  subtotal: number
  discount: number
  total: number
  products: string[]
}
