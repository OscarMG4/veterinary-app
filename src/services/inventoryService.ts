import { apiClient } from '../api/client'
import { API_ENDPOINTS } from '../constants/api'
import type {
  InventoryAdjustmentRequest,
  InventoryMovementResponse,
} from '../interfaces/inventory'

export const inventoryService = {
  adjustmentPositive: (data: InventoryAdjustmentRequest) =>
    apiClient.post<InventoryMovementResponse>(
      API_ENDPOINTS.INVENTORY.ADJUSTMENT_POSITIVE,
      data,
    ),
  adjustmentNegative: (data: InventoryAdjustmentRequest) =>
    apiClient.post<InventoryMovementResponse>(
      API_ENDPOINTS.INVENTORY.ADJUSTMENT_NEGATIVE,
      data,
    ),
  getHistory: (productId?: number) =>
    apiClient.get<InventoryMovementResponse[]>(API_ENDPOINTS.INVENTORY.HISTORY, {
      params: productId != null ? { productId } : undefined,
    }),
}
