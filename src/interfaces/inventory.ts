export type InventoryMovementType =
  | 'ENTRY'
  | 'EXIT'
  | 'ADJUSTMENT_POSITIVE'
  | 'ADJUSTMENT_NEGATIVE'

export interface InventoryAdjustmentRequest {
  productId: number
  quantity: number
  reason: string
}

export interface InventoryMovementResponse {
  id: number
  productId: number
  productName: string
  type: InventoryMovementType
  quantity: number
  stockBefore: number
  stockAfter: number
  reason: string
  createdBy: string
  movementDate: string
}
