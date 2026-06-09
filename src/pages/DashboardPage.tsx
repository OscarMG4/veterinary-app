import { useState } from 'react'
import {
  Card,
  Col,
  Row,
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
import { SalesTrendChart } from '../components/dashboard/SalesTrendChart'
import { TopProductsChart } from '../components/dashboard/TopProductsChart'
import { LowStockChart } from '../components/dashboard/LowStockChart'
import { SupplierPurchasesChart } from '../components/dashboard/SupplierPurchasesChart'
import { dashboardService } from '../services/dashboardService'
import type {
  LowStockStat,
  SalesTrendStat,
  SupplierPurchaseStat,
  TopProductStat,
} from '../interfaces/dashboard'
import { formatCurrency } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'
import { DashboardWelcomeBanner } from '../components/dashboard/DashboardWelcomeBanner'
import { StatCard } from '../components/dashboard/StatCard'

interface DashboardData {
  salesDay: number
  salesMonth: number
  salesTrend: SalesTrendStat[]
  topProducts: TopProductStat[]
  lowStock: LowStockStat[]
  supplierPurchases: SupplierPurchaseStat[]
}

const emptyDashboard: DashboardData = {
  salesDay: 0,
  salesMonth: 0,
  salesTrend: [],
  topProducts: [],
  lowStock: [],
  supplierPurchases: [],
}

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs())
  const monthKey = selectedMonth.format('YYYY-MM')
  const monthLabel = selectedMonth.format('MMMM YYYY')

  const { data, loading } = useAsyncData<DashboardData>(
    async () => {
      try {
        const month = selectedMonth.month() + 1
        const year = selectedMonth.year()

        const [dayRes, monthRes, trendRes, topRes, lowRes, supplierRes] =
          await Promise.all([
            dashboardService.salesDay(),
            dashboardService.salesMonth(month, year),
            dashboardService.salesTrend(month, year),
            dashboardService.topProducts(),
            dashboardService.lowStock(),
            dashboardService.purchasesBySupplier(),
          ])
        return {
          salesDay: Number(dayRes.data),
          salesMonth: Number(monthRes.data),
          salesTrend: trendRes.data,
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
  const salesTrend = data?.salesTrend ?? []
  const topProducts = data?.topProducts ?? []
  const lowStock = data?.lowStock ?? []
  const supplierPurchases = data?.supplierPurchases ?? []

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Panel de control de tu clínica veterinaria"
        extra={
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(value) => value && setSelectedMonth(value)}
            allowClear={false}
          />
        }
      />

      <DashboardWelcomeBanner />

      <Row gutter={[20, 20]} className="dashboard-stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Ventas hoy"
            value={salesDay}
            icon={<DollarOutlined />}
            loading={loading}
            variant="primary"
            formatter={(v) => formatCurrency(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Ventas del mes"
            value={salesMonth}
            icon={<RiseOutlined />}
            loading={loading}
            variant="info"
            formatter={(v) => formatCurrency(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Productos bajo stock"
            value={lowStock.length}
            icon={<WarningOutlined />}
            loading={loading}
            variant="warning"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Proveedores activos"
            value={supplierPurchases.length}
            icon={<ShoppingOutlined />}
            loading={loading}
            variant="success"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="dashboard-charts-row">
        <Col xs={24} lg={14}>
          <Card
            className="content-card"
            title={`Tendencia de ventas — ${monthLabel}`}
          >
            <SalesTrendChart
              data={salesTrend}
              loading={loading}
              monthLabel={monthLabel}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="content-card" title="Compras por proveedor">
            <SupplierPurchasesChart
              data={supplierPurchases}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card className="content-card" title="Top productos vendidos">
            <TopProductsChart data={topProducts} loading={loading} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card className="content-card" title="Alertas de stock bajo">
            <LowStockChart data={lowStock} loading={loading} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
