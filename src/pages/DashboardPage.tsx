import { useState } from 'react'
import {
  Card,
  Col,
  Row,
  DatePicker,
  Alert,
} from 'antd'
import {
  ShoppingOutlined,
  WarningOutlined,
  RiseOutlined,
  InboxOutlined,
  ExportOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  BellOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageHeader } from '../components/PageHeader'
import { SalesTrendChart } from '../components/dashboard/SalesTrendChart'
import { LowStockChart } from '../components/dashboard/LowStockChart'
import { SupplierPurchasesChart } from '../components/dashboard/SupplierPurchasesChart'
import { PurchasesVsSalesChart } from '../components/dashboard/PurchasesVsSalesChart'
import { RotationChart } from '../components/dashboard/RotationChart'
import { InventorySummaryTable } from '../components/dashboard/InventorySummaryTable'
import { ReplenishmentAlertsTable } from '../components/dashboard/ReplenishmentAlertsTable'
import { StockGaugeChart } from '../components/dashboard/StockGaugeChart'
import { dashboardService } from '../services/dashboardService'
import type {
  InventorySummaryStat,
  LowStockStat,
  ReplenishmentAlertStat,
  SalesTrendStat,
  SupplierPurchaseStat,
  TopProductStat,
} from '../interfaces/dashboard'
import { formatCurrency, formatNumber } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'
import { DashboardWelcomeBanner } from '../components/dashboard/DashboardWelcomeBanner'
import { StatCard } from '../components/dashboard/StatCard'

interface DashboardData {
  salesDay: number
  salesMonth: number
  purchasesMonth: number
  salesTrend: SalesTrendStat[]
  purchasesTrend: SalesTrendStat[]
  topProductsHigh: TopProductStat[]
  topProductsLow: TopProductStat[]
  lowStock: LowStockStat[]
  supplierPurchases: SupplierPurchaseStat[]
  totalProducts: number
  totalStock: number
  inventoryEntries: number
  inventoryExits: number
  inventorySummary: InventorySummaryStat[]
  replenishmentAlerts: ReplenishmentAlertStat[]
}

const emptyDashboard: DashboardData = {
  salesDay: 0,
  salesMonth: 0,
  purchasesMonth: 0,
  salesTrend: [],
  purchasesTrend: [],
  topProductsHigh: [],
  topProductsLow: [],
  lowStock: [],
  supplierPurchases: [],
  totalProducts: 0,
  totalStock: 0,
  inventoryEntries: 0,
  inventoryExits: 0,
  inventorySummary: [],
  replenishmentAlerts: [],
}

export function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(dayjs())
  const monthKey = selectedMonth.format('YYYY-MM')
  const monthLabel = selectedMonth.format('MMMM YYYY')

  const { data, loading } = useAsyncData<DashboardData>(
    async () => {
      const month = selectedMonth.month() + 1
      const year = selectedMonth.year()

      const results = await Promise.allSettled([
        dashboardService.salesDay(),
        dashboardService.salesMonth(month, year),
        dashboardService.purchasesMonth(month, year),
        dashboardService.salesTrend(month, year),
        dashboardService.purchasesTrend(month, year),
        dashboardService.topProductsByPeriod(month, year, 5),
        dashboardService.lowRotationProducts(month, year, 5),
        dashboardService.lowStock(),
        dashboardService.purchasesBySupplierInPeriod(month, year),
        dashboardService.totalProducts(),
        dashboardService.totalStock(),
        dashboardService.inventoryEntries(month, year),
        dashboardService.inventoryExits(month, year),
        dashboardService.inventorySummary(),
        dashboardService.replenishmentAlerts(),
      ])

      const failed = results.filter((r) => r.status === 'rejected')
      if (failed.length > 0) {
        handleApiError((failed[0] as PromiseRejectedResult).reason)
      }

      const get = <T,>(index: number, fallback: T): T => {
        const result = results[index]
        if (result.status === 'fulfilled') {
          return result.value.data as T
        }
        return fallback
      }

      return {
        salesDay: Number(get(0, 0)),
        salesMonth: Number(get(1, 0)),
        purchasesMonth: Number(get(2, 0)),
        salesTrend: get(3, []),
        purchasesTrend: get(4, []),
        topProductsHigh: get(5, []),
        topProductsLow: get(6, []),
        lowStock: get(7, []),
        supplierPurchases: get(8, []),
        totalProducts: Number(get(9, 0)),
        totalStock: Number(get(10, 0)),
        inventoryEntries: Number(get(11, 0)),
        inventoryExits: Number(get(12, 0)),
        inventorySummary: get(13, []),
        replenishmentAlerts: get(14, []),
      }
    },
    [monthKey],
    emptyDashboard,
  )

  const d = data ?? emptyDashboard

  return (
    <div className="dashboard-page">
      <PageHeader
        title="Dashboard"
        subtitle="Panel de control de inventario y ventas"
        extra={
          <DatePicker
            picker="month"
            value={selectedMonth}
            onChange={(value) => value && setSelectedMonth(value)}
            allowClear={false}
            format="MMMM YYYY"
          />
        }
      />

      <DashboardWelcomeBanner />

      {d.replenishmentAlerts.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<BellOutlined />}
          message={`${d.replenishmentAlerts.length} producto${d.replenishmentAlerts.length === 1 ? '' : 's'} requieren reposición`}
          description="Revisa las alertas al final del panel para planificar compras."
          className="dashboard-alert-banner"
        />
      )}

      <Row gutter={[16, 16]} className="dashboard-stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Productos registrados"
            value={d.totalProducts}
            icon={<AppstoreOutlined />}
            loading={loading}
            variant="primary"
            formatter={(v) => formatNumber(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Stock total disponible"
            value={d.totalStock}
            icon={<DatabaseOutlined />}
            loading={loading}
            variant="info"
            formatter={(v) => formatNumber(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Entradas de inventario"
            value={d.inventoryEntries}
            icon={<InboxOutlined />}
            loading={loading}
            variant="success"
            formatter={(v) => `${formatNumber(Number(v))} uds.`}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Salidas de inventario"
            value={d.inventoryExits}
            icon={<ExportOutlined />}
            loading={loading}
            variant="danger"
            formatter={(v) => `${formatNumber(Number(v))} uds.`}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={`Ventas — ${monthLabel}`}
            value={d.salesMonth}
            icon={<RiseOutlined />}
            loading={loading}
            variant="primary"
            formatter={(v) => formatCurrency(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title={`Compras — ${monthLabel}`}
            value={d.purchasesMonth}
            icon={<ShoppingOutlined />}
            loading={loading}
            variant="purple"
            formatter={(v) => formatCurrency(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Ventas hoy"
            value={d.salesDay}
            icon={<RiseOutlined />}
            loading={loading}
            variant="info"
            formatter={(v) => formatCurrency(Number(v))}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Productos bajo stock"
            value={d.lowStock.length}
            icon={<WarningOutlined />}
            loading={loading}
            variant="warning"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-charts-row">
        <Col xs={24} lg={16}>
          <Card
            className="content-card dashboard-chart-card"
            title={`Compras vs Ventas — ${monthLabel}`}
          >
            <PurchasesVsSalesChart
              salesData={d.salesTrend}
              purchasesData={d.purchasesTrend}
              loading={loading}
              monthLabel={monthLabel}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className="content-card dashboard-chart-card"
            title="Stock total disponible"
          >
            <StockGaugeChart
              currentStock={d.totalStock}
              totalProducts={d.totalProducts}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-charts-row">
        <Col xs={24} lg={12}>
          <Card
            className="content-card dashboard-chart-card"
            title="Top 5 — Mayor rotación"
          >
            <RotationChart
              data={d.topProductsHigh}
              loading={loading}
              variant="high"
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="content-card dashboard-chart-card"
            title="Top 5 — Menor rotación"
          >
            <RotationChart
              data={d.topProductsLow}
              loading={loading}
              variant="low"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="dashboard-charts-row">
        <Col xs={24} lg={14}>
          <Card
            className="content-card dashboard-chart-card"
            title={`Tendencia de ventas — ${monthLabel}`}
          >
            <SalesTrendChart
              data={d.salesTrend}
              loading={loading}
              monthLabel={monthLabel}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            className="content-card dashboard-chart-card"
            title={`Compras por proveedor — ${monthLabel}`}
          >
            <SupplierPurchasesChart
              data={d.supplierPurchases}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            className="content-card dashboard-chart-card"
            title="Resumen: entradas, salidas y saldos"
          >
            <InventorySummaryTable
              data={d.inventorySummary}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            className="content-card dashboard-chart-card"
            title="Productos con stock bajo"
          >
            <LowStockChart data={d.lowStock} loading={loading} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card
            className="content-card dashboard-chart-card"
            title="Alertas de reposición de productos"
          >
            <ReplenishmentAlertsTable
              data={d.replenishmentAlerts}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
