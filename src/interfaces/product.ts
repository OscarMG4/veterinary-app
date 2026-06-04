export interface ProductRequest {
  name: string
  description?: string
  barcode?: string
  price: number
  stock: number
  minStock: number
  categoryId: number
}

export interface ProductResponse {
  id: number
  name: string
  description?: string
  barcode?: string
  price: number
  stock: number
  minStock: number
  categoryName: string
  lowStock: boolean
}
