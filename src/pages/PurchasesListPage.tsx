import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Modal, Space, Table, Tag, message } from 'antd'
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { purchaseService } from '../services/purchaseService'
import { exportService } from '../services/exportService'
import type { PurchaseListResponse } from '../interfaces/purchase'
import { ROUTES, purchasesEditPath } from '../constants/routes'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { formatCurrency, formatDateTime } from '../utils/format'
import { buildExportFilename, downloadBlob } from '../utils/downloadBlob'
import { handleApiError } from '../utils/errorHandler'

export function PurchasesListPage() {
  const navigate = useNavigate()
  const { canDelete, canExport } = usePermissions()
  const [search, setSearch] = useState('')
  const [exportLoading, setExportLoading] = useState(false)

  const {
    data: purchases = [],
    loading,
    reload: loadPurchases,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await purchaseService.getAll()
        return data
      } catch (error) {
        handleApiError(error)
        return []
      }
    },
    [],
    [],
  )

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return purchases

    return purchases.filter((purchase) => {
      const haystack = [
        purchase.documentNumber,
        purchase.supplierName,
        purchase.createdBy,
        ...purchase.products,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [purchases, search])

  const onDelete = (record: PurchaseListResponse) => {
    Modal.confirm({
      title: '¿Eliminar compra?',
      content: `Se eliminará ${record.documentNumber} y se revertirá el stock.`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await purchaseService.delete(record.id)
          message.success('Compra eliminada')
          void loadPurchases()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const onExport = async () => {
    setExportLoading(true)
    try {
      const { data } = await exportService.downloadPurchases()
      downloadBlob(data, buildExportFilename('compras'))
      message.success('Reporte descargado correctamente')
    } catch (error) {
      handleApiError(error)
    } finally {
      setExportLoading(false)
    }
  }

  const columns = [
    {
      title: 'Documento',
      dataIndex: 'documentNumber',
      key: 'documentNumber',
      width: 160,
    },
    {
      title: 'Fecha',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (products: string[]) => (
        <Space size={[4, 4]} wrap>
          {products.slice(0, 3).map((name, index) => (
            <Tag key={`${name}-${index}`}>{name}</Tag>
          ))}
          {products.length > 3 && <Tag>+{products.length - 3} más</Tag>}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      width: 140,
      render: (value: number) => <strong>{formatCurrency(value)}</strong>,
    },
    {
      title: 'Registrado por',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 140,
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: PurchaseListResponse) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label="Editar compra"
            onClick={() => navigate(purchasesEditPath(record.id))}
          />
          {canDelete && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Eliminar compra"
              onClick={() => onDelete(record)}
            />
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Listado de compras"
        subtitle="Consulta el historial de compras a proveedores"
        extra={
          <Space wrap>
            {canExport && (
              <Button
                icon={<FileExcelOutlined />}
                loading={exportLoading}
                onClick={() => void onExport()}
              >
                Exportar Excel
              </Button>
            )}
            <Button
              icon={<ReloadOutlined />}
              onClick={() => void loadPurchases()}
            >
              Actualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.PURCHASES_REGISTER)}
            >
              Registrar compra
            </Button>
          </Space>
        }
      />

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          allowClear
          placeholder="Buscar por documento, proveedor o producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 420 }}
        />

        <Table<PurchaseListResponse>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: 'No hay compras registradas' }}
          scroll={{ x: 1080 }}
        />
      </Space>
    </div>
  )
}
