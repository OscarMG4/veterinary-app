export interface SupplierRequest {
  documentType: string
  documentNumber: string
  businessName: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
}

export interface SupplierResponse extends SupplierRequest {
  id: number
  active: boolean
}
