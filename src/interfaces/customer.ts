export interface CustomerRequest {
  documentType: string
  documentNumber: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
}

export interface CustomerResponse extends CustomerRequest {
  id: number
  active: boolean
}
