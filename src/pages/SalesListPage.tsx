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
import { saleService } from '../services/saleService'
import { exportService } from '../services/exportService'
import type { SaleListResponse } from '../interfaces/sale'
import { ROUTES, salesEditPath } from '../constants/routes'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { formatCurrency, formatDateTime } from '../utils/format'
import { buildExportFilename, downloadBlob } from '../utils/downloadBlob'
import { handleApiError } from '../utils/errorHandler'

export function SalesListPage() {
  const navigate = useNavigate()
  const { canDelete, canExport } = usePermissions()
  const [search, setSearch] = useState('')
  const [exportLoading, setExportLoading] = useState(false)

  const {
    data: sales = [],
    loading,
    reload: loadSales,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await saleService.getAll()
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
    if (!term) return sales

    return sales.filter((sale) => {
      const haystack = [
        sale.documentNumber,
        sale.customerName,
        sale.createdBy,
        ...sale.products,
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(term)
    })
  }, [sales, search])

  const onDelete = (record: SaleListResponse) => {
    Modal.confirm({
      title: '¿Eliminar venta?',
      content: `Se eliminará ${record.documentNumber} y se revertirá el stock.`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await saleService.delete(record.id)
          message.success('Venta eliminada')
          void loadSales()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const onExport = async () => {
    setExportLoading(true)
    try {
      const { data } = await exportService.downloadSales()
      downloadBlob(data, buildExportFilename('ventas'))
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
      dataIndex: 'saleDate',
      key: 'saleDate',
      width: 180,
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Cliente',
      dataIndex: 'customerName',
      key: 'customerName',
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
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      width: 130,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Descuento',
      dataIndex: 'discount',
      key: 'discount',
      align: 'right' as const,
      width: 120,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      width: 130,
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
      render: (_: unknown, record: SaleListResponse) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label="Editar venta"
            onClick={() => navigate(salesEditPath(record.id))}
          />
          {canDelete && (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label="Eliminar venta"
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
        title="Listado de ventas"
        subtitle="Consulta el historial de ventas registradas"
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
            <Button icon={<ReloadOutlined />} onClick={() => void loadSales()}>
              Actualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(ROUTES.SALES_REGISTER)}
            >
              Registrar venta
            </Button>
          </Space>
        }
      />

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Input.Search
          allowClear
          placeholder="Buscar por documento, cliente o producto..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 420 }}
        />

        <Table<SaleListResponse>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: 'No hay ventas registradas' }}
          scroll={{ x: 1200 }}
        />
      </Space>
    </div>
  )
}
