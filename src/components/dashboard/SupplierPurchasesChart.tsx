import { Empty, Skeleton } from 'antd'
import { Pie } from '@ant-design/plots'
import type { SupplierPurchaseStat } from '../../interfaces/dashboard'
import { formatCurrency } from '../../utils/format'

interface SupplierPurchasesChartProps {
  data: SupplierPurchaseStat[]
  loading?: boolean
}

export function SupplierPurchasesChart({
  data,
  loading,
}: SupplierPurchasesChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description="Sin compras registradas por proveedor"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const chartData = data.map((item) => ({
    supplier: item.supplier,
    total: Number(item.total),
  }))

  return (
    <Pie
      data={chartData}
      angleField="total"
      colorField="supplier"
      radius={0.85}
      innerRadius={0.55}
      height={300}
      label={{
        text: (d: { supplier: string; total: number }) =>
          `${d.supplier}: ${formatCurrency(d.total)}`,
        style: { fontSize: 11 },
      }}
      legend={{ position: 'bottom' }}
      tooltip={{
        title: (d: { supplier: string }) => d.supplier,
        items: [
          {
            field: 'total',
            name: 'Total comprado',
            valueFormatter: (v: number) => formatCurrency(v),
          },
        ],
      }}
    />
  )
}
