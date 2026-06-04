import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Table,
  Tabs,
  Tag,
  message,
} from 'antd'
import { PageHeader } from '../components/PageHeader'
import { inventoryService } from '../services/inventoryService'
import { productService } from '../services/productService'
import type { ProductResponse } from '../interfaces/product'
import type {
  InventoryAdjustmentRequest,
  InventoryMovementResponse,
} from '../interfaces/inventory'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { formatDateTime } from '../utils/format'
import { handleApiError } from '../utils/errorHandler'

const movementTypeLabels: Record<string, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  ADJUSTMENT_POSITIVE: 'Ajuste +',
  ADJUSTMENT_NEGATIVE: 'Ajuste -',
}

export function InventoryPage() {
  const { canAdjustInventory } = usePermissions()
  const { data: products = [] } = useAsyncData(
    async () => {
      try {
        const { data } = await productService.getAll()
        return data
      } catch (error) {
        handleApiError(error)
        return []
      }
    },
    [],
    [] as ProductResponse[],
  )
  const [history, setHistory] = useState<InventoryMovementResponse[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [adjustLoading, setAdjustLoading] = useState(false)
  const [positiveForm] = Form.useForm<InventoryAdjustmentRequest>()
  const [negativeForm] = Form.useForm<InventoryAdjustmentRequest>()

  const loadHistory = async (productId: number) => {
    setSelectedProductId(productId)
    setHistoryLoading(true)
    try {
      const { data } = await inventoryService.getHistory(productId)
      setHistory(data)
    } catch (error) {
      handleApiError(error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const submitAdjustment = async (
    values: InventoryAdjustmentRequest,
    type: 'positive' | 'negative',
  ) => {
    setAdjustLoading(true)
    try {
      if (type === 'positive') {
        await inventoryService.adjustmentPositive(values)
        positiveForm.resetFields()
        message.success('Ajuste positivo registrado')
      } else {
        await inventoryService.adjustmentNegative(values)
        negativeForm.resetFields()
        message.success('Ajuste negativo registrado')
      }
      if (selectedProductId === values.productId) {
        void loadHistory(values.productId)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setAdjustLoading(false)
    }
  }

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} (stock: ${p.stock})`,
  }))

  const tabItems = [
    {
      key: 'history',
      label: 'Historial',
      children: (
        <>
          <Select
            showSearch
            placeholder="Seleccionar producto"
            style={{ width: 320, marginBottom: 16 }}
            options={productOptions}
            onChange={(id) => void loadHistory(id)}
          />
          <Table
            rowKey="id"
            loading={historyLoading}
            dataSource={history}
            columns={[
              { title: 'Producto', dataIndex: 'productName' },
              {
                title: 'Tipo',
                dataIndex: 'type',
                render: (t: string) => (
                  <Tag>{movementTypeLabels[t] ?? t}</Tag>
                ),
              },
              { title: 'Cantidad', dataIndex: 'quantity', align: 'center' },
              { title: 'Antes', dataIndex: 'stockBefore', align: 'center' },
              { title: 'Después', dataIndex: 'stockAfter', align: 'center' },
              { title: 'Motivo', dataIndex: 'reason' },
              { title: 'Usuario', dataIndex: 'createdBy' },
              {
                title: 'Fecha',
                dataIndex: 'movementDate',
                render: (v: string) => formatDateTime(v),
              },
            ]}
          />
        </>
      ),
    },
  ]

  if (canAdjustInventory) {
    tabItems.unshift({
      key: 'adjustments',
      label: 'Ajustes (Admin)',
      children: (
        <div className="inventory-adjustments">
          <Card title="Ajuste positivo" size="small">
            <Form
              form={positiveForm}
              layout="vertical"
              onFinish={(v) => void submitAdjustment(v, 'positive')}
            >
              <Form.Item name="productId" label="Producto" rules={[{ required: true }]}>
                <Select options={productOptions} />
              </Form.Item>
              <Form.Item name="quantity" label="Cantidad" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="reason" label="Motivo" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={adjustLoading}>
                Aplicar ajuste +
              </Button>
            </Form>
          </Card>
          <Card title="Ajuste negativo" size="small">
            <Form
              form={negativeForm}
              layout="vertical"
              onFinish={(v) => void submitAdjustment(v, 'negative')}
            >
              <Form.Item name="productId" label="Producto" rules={[{ required: true }]}>
                <Select options={productOptions} />
              </Form.Item>
              <Form.Item name="quantity" label="Cantidad" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="reason" label="Motivo" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Button danger htmlType="submit" loading={adjustLoading}>
                Aplicar ajuste -
              </Button>
            </Form>
          </Card>
        </div>
      ),
    })
  }

  return (
    <div>
      <PageHeader
        title="Inventario"
        subtitle="Historial y ajustes de inventario"
      />
      <Tabs items={tabItems} />
    </div>
  )
}
