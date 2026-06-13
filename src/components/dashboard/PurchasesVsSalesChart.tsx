import { Empty, Skeleton } from 'antd'
import { Column } from '@ant-design/plots'
import { formatCurrency } from '../../utils/format'

interface PurchasesVsSalesChartProps {
  salesData: { day: number; total: number }[]
  purchasesData: { day: number; total: number }[]
  loading?: boolean
  monthLabel: string
}

export function PurchasesVsSalesChart({
  salesData,
  purchasesData,
  loading,
  monthLabel,
}: PurchasesVsSalesChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />
  }

  const daysSet = new Set<number>()
  salesData.forEach((d) => daysSet.add(d.day))
  purchasesData.forEach((d) => daysSet.add(d.day))
  const days = Array.from(daysSet).sort((a, b) => a - b)

  const salesMap = new Map(salesData.map((d) => [d.day, Number(d.total)]))
  const purchasesMap = new Map(
    purchasesData.map((d) => [d.day, Number(d.total)]),
  )

  const chartData = days.flatMap((day) => [
    { day: `Día ${day}`, type: 'Ventas', amount: salesMap.get(day) ?? 0 },
    { day: `Día ${day}`, type: 'Compras', amount: purchasesMap.get(day) ?? 0 },
  ])

  if (chartData.length === 0) {
    return (
      <Empty
        description={`Sin movimientos de compras/ventas en ${monthLabel}`}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <Column
      data={chartData}
      xField="day"
      yField="amount"
      colorField="type"
      group
      height={340}
      scale={{
        color: {
          range: ['#059669', '#6366f1'],
        },
      }}
      style={{
        radiusTopLeft: 6,
        radiusTopRight: 6,
      }}
      axis={{
        y: {
          labelFormatter: (v: string) => formatCurrency(Number(v)),
        },
        x: { labelTransform: 'rotate(-35deg)' },
      }}
      legend={{ position: 'top' }}
      tooltip={{
        title: (d: { day: string }) => d.day,
        items: [
          {
            field: 'amount',
            name: 'Monto',
            valueFormatter: (v: number) => formatCurrency(v),
          },
        ],
      }}
    />
  )
}
