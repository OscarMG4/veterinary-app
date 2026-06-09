export interface PurchaseItemRequest {
  productId: number
  quantity: number
  price: number
}

export interface PurchaseRequest {
  supplierId: number
  items: PurchaseItemRequest[]
}

export interface PurchaseDetailResponse {
  id: number
  documentNumber: string
  supplierId: number
  items: PurchaseItemRequest[]
}

export interface PurchaseListResponse {
  id: number
  documentNumber: string
  purchaseDate: string
  supplierName: string
  total: number
  createdBy: string
  products: string[]
}

export interface PurchaseResponse {
  id: number
  documentNumber: string
  total: number
  products: string[]
}
