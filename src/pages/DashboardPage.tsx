import { useState } from 'react'
import {
  Card,
  Col,
  Row,
  Skeleton,
  Statistic,
  Table,
  Tag,
  DatePicker,
} from 'antd'
import {
  DollarOutlined,
  ShoppingOutlined,
  WarningOutlined,
  RiseOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageHeader } from '../components/PageHeader'
import { dashboardService } from '../services/dashboardService'
import type {
  LowStockStat,
  SupplierPurchaseStat,
  TopProductStat,
} from '../interfaces/dashboard'
import { formatCurrency } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

interface DashboardData {
  salesDay: number
  salesMonth: number
  topProducts: TopProductStat[]
  lowStock: LowStockStat[]
  supplierPurchases: SupplierPurchaseStat[]
}

const emptyDashboard: DashboardData = {
  salesDay: 0,
  salesMonth: 0,
  topProducts: [],
  lowStock: [],
  supplierPurchases: [],
}

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs())
  const monthKey = selectedMonth.format('YYYY-MM')

  const { data, loading } = useAsyncData<DashboardData>(
    async () => {
      try {
        const [dayRes, monthRes, topRes, lowRes, supplierRes] =
          await Promise.all([
            dashboardService.salesDay(),
            dashboardService.salesMonth(
              selectedMonth.month() + 1,
              selectedMonth.year(),
            ),
            dashboardService.topProducts(),
            dashboardService.lowStock(),
            dashboardService.purchasesBySupplier(),
          ])
        return {
          salesDay: Number(dayRes.data),
          salesMonth: Number(monthRes.data),
          topProducts: topRes.data,
          lowStock: lowRes.data,
          supplierPurchases: supplierRes.data,
        }
      } catch (error) {
        handleApiError(error)
        return emptyDashboard
      }
    },
    [monthKey],
    emptyDashboard,
  )

  const salesDay = data?.salesDay ?? 0
  const salesMonth = data?.salesMonth ?? 0
  const topProducts = data?.topProducts ?? []
  const lowStock = data?.lowStock ?? []
  const supplierPurchases = data?.supplierPurchases ?? []

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen operativo de la clínica veterinaria"
        extra={
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(value) => value && setSelectedMonth(value)}
            allowClear={false}
          />
        }
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-primary">
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title="Ventas hoy"
                value={salesDay}
                prefix={<DollarOutlined />}
                formatter={(v) => formatCurrency(Number(v))}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-info">
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title="Ventas del mes"
                value={salesMonth}
                prefix={<RiseOutlined />}
                formatter={(v) => formatCurrency(Number(v))}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-warning">
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title="Productos bajo stock"
                value={lowStock.length}
                prefix={<WarningOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card stat-card-success">
            {loading ? (
              <Skeleton active paragraph={false} />
            ) : (
              <Statistic
                title="Proveedores activos"
                value={supplierPurchases.length}
                prefix={<ShoppingOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top productos vendidos">
            <Table
              rowKey="product"
              loading={loading}
              dataSource={topProducts}
              pagination={false}
              size="small"
              columns={[
                { title: 'Producto', dataIndex: 'product' },
                {
                  title: 'Cantidad',
                  dataIndex: 'quantity',
                  align: 'right',
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Stock bajo">
            <Table
              rowKey="product"
              loading={loading}
              dataSource={lowStock}
              pagination={false}
              size="small"
              columns={[
                { title: 'Producto', dataIndex: 'product' },
                {
                  title: 'Stock',
                  dataIndex: 'stock',
                  align: 'center',
                  render: (stock: number, record: LowStockStat) => (
                    <Tag color="error">
                      {stock} / {record.minStock}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Compras por proveedor">
            <Table
              rowKey="supplier"
              loading={loading}
              dataSource={supplierPurchases}
              pagination={{ pageSize: 5 }}
              columns={[
                { title: 'Proveedor', dataIndex: 'supplier' },
                {
                  title: 'Total comprado',
                  dataIndex: 'total',
                  align: 'right',
                  render: (v: number) => formatCurrency(v),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
