import { useCallback, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  FileExcelOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { PageHeader } from '../components/PageHeader'
import { inventoryService } from '../services/inventoryService'
import { productService } from '../services/productService'
import { exportService } from '../services/exportService'
import type { ProductResponse } from '../interfaces/product'
import type {
  InventoryAdjustmentRequest,
  InventoryMovementResponse,
} from '../interfaces/inventory'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { formatDateTime } from '../utils/format'
import { buildExportFilename, downloadBlob } from '../utils/downloadBlob'
import { handleApiError } from '../utils/errorHandler'

const { Text } = Typography

const movementTypeLabels: Record<string, string> = {
  ENTRY: 'Entrada',
  EXIT: 'Salida',
  ADJUSTMENT_POSITIVE: 'Ajuste +',
  ADJUSTMENT_NEGATIVE: 'Ajuste -',
}

function getMovementLabel(type: string, reason?: string): string {
  const upperReason = reason?.toUpperCase() ?? ''
  if (upperReason.includes('VENTA')) return 'Venta'
  if (upperReason.includes('COMPRA')) return 'Compra'
  return movementTypeLabels[type] ?? type
}

function getMovementColor(type: string, reason?: string): string {
  const label = getMovementLabel(type, reason)
  if (label === 'Venta' || label === 'Salida' || label === 'Ajuste -') {
    return 'red'
  }
  if (label === 'Compra' || label === 'Entrada' || label === 'Ajuste +') {
    return 'green'
  }
  return 'green'
}

export function InventoryPage() {
  const { canAdjustInventory, canExport } = usePermissions()
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
  const [filterProductId, setFilterProductId] = useState<number | null>(null)
  const [adjustLoading, setAdjustLoading] = useState(false)
  const [positiveForm] = Form.useForm<InventoryAdjustmentRequest>()
  const [negativeForm] = Form.useForm<InventoryAdjustmentRequest>()

  const [exportLoading, setExportLoading] = useState<string | null>(null)

  const handleExport = async (
    key: 'entries' | 'exits' | 'balances' | 'rotation',
  ) => {
    setExportLoading(key)
    try {
      const exporters = {
        entries: {
          fn: exportService.downloadInventoryEntries,
          prefix: 'entradas_inventario' as const,
          label: 'Entradas',
        },
        exits: {
          fn: exportService.downloadInventoryExits,
          prefix: 'salidas_inventario' as const,
          label: 'Salidas',
        },
        balances: {
          fn: exportService.downloadInventoryBalances,
          prefix: 'saldos_inventario' as const,
          label: 'Saldos',
        },
        rotation: {
          fn: exportService.downloadProductRotation,
          prefix: 'rotacion_productos' as const,
          label: 'Rotación',
        },
      }

      const { fn, prefix, label } = exporters[key]
      const { data } = await fn()
      downloadBlob(data, buildExportFilename(prefix))
      message.success(`Reporte de ${label} descargado`)
    } catch (error) {
      handleApiError(error)
    } finally {
      setExportLoading(null)
    }
  }

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'entries',
      icon: <FileExcelOutlined />,
      label: 'Entradas de inventario',
      onClick: () => void handleExport('entries'),
    },
    {
      key: 'exits',
      icon: <FileExcelOutlined />,
      label: 'Salidas de inventario',
      onClick: () => void handleExport('exits'),
    },
    {
      key: 'balances',
      icon: <FileExcelOutlined />,
      label: 'Saldos actuales',
      onClick: () => void handleExport('balances'),
    },
    {
      key: 'rotation',
      icon: <FileExcelOutlined />,
      label: 'Rotación de productos',
      onClick: () => void handleExport('rotation'),
    },
  ]

  const loadHistory = useCallback(async (productId?: number | null) => {
    setHistoryLoading(true)
    try {
      const { data } = await inventoryService.getHistory(
        productId ?? undefined,
      )
      setHistory(data)
    } catch (error) {
      handleApiError(error)
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadHistory(filterProductId)
  }, [filterProductId, loadHistory])

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
      void loadHistory(filterProductId)
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

  const kardexTable = (
    <>
      <div className="kardex-toolbar">
        <Select
          showSearch
          allowClear
          placeholder="Filtrar por producto (todos)"
          suffixIcon={<SearchOutlined />}
          style={{ minWidth: 320 }}
          options={productOptions}
          value={filterProductId ?? undefined}
          onChange={(id) => setFilterProductId(id ?? null)}
        />
        <Space wrap>
          {canExport && (
            <Dropdown
              menu={{ items: exportMenuItems }}
              trigger={['click']}
            >
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                loading={exportLoading !== null}
              >
                Reportes Excel
              </Button>
            </Dropdown>
          )}
          <Button
            icon={<ReloadOutlined />}
            loading={historyLoading}
            onClick={() => void loadHistory(filterProductId)}
          >
            Actualizar
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        loading={historyLoading}
        dataSource={history}
        locale={{
          emptyText: (
            <Empty
              description={
                filterProductId
                  ? 'Sin movimientos para este producto'
                  : 'Sin movimientos registrados en el kardex'
              }
            />
          ),
        }}
        pagination={{ pageSize: 10, showSizeChanger: true }}
        columns={[
          {
            title: 'Fecha',
            dataIndex: 'movementDate',
            width: 170,
            render: (v: string) => formatDateTime(v),
          },
          { title: 'Producto', dataIndex: 'productName' },
          {
            title: 'Tipo',
            dataIndex: 'type',
            render: (t: string, record: InventoryMovementResponse) => (
              <Tag color={getMovementColor(t, record.reason)}>
                {getMovementLabel(t, record.reason)}
              </Tag>
            ),
          },
          { title: 'Cantidad', dataIndex: 'quantity', align: 'center' },
          { title: 'Stock antes', dataIndex: 'stockBefore', align: 'center' },
          { title: 'Stock después', dataIndex: 'stockAfter', align: 'center' },
          { title: 'Motivo', dataIndex: 'reason', ellipsis: true },
          { title: 'Usuario', dataIndex: 'createdBy', width: 120 },
        ]}
      />
      {!historyLoading && history.length > 0 && (
        <Text type="secondary">
          {history.length} movimiento{history.length === 1 ? '' : 's'} en el
          kardex
          {filterProductId ? ' del producto seleccionado' : ''}.
        </Text>
      )}
    </>
  )

  const tabItems = [
    {
      key: 'kardex',
      label: 'Kardex',
      children: kardexTable,
    },
  ]

  if (canAdjustInventory) {
    tabItems.push({
      key: 'adjustments',
      label: 'Ajustes manuales',
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
        title="Ajustes de stock"
        subtitle="Kardex de medicamentos e insumos de la clínica"
      />
      <Tabs defaultActiveKey="kardex" items={tabItems} />
    </div>
  )
}
