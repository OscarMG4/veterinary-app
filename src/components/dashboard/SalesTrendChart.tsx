import { Empty, Skeleton } from 'antd'
import { Line } from '@ant-design/plots'
import type { SalesTrendStat } from '../../interfaces/dashboard'
import { formatCurrency } from '../../utils/format'

interface SalesTrendChartProps {
  data: SalesTrendStat[]
  loading?: boolean
  monthLabel: string
}

export function SalesTrendChart({
  data,
  loading,
  monthLabel,
}: SalesTrendChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description={`Sin ventas registradas en ${monthLabel}`}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const chartData = data.map((item) => ({
    day: `Día ${item.day}`,
    total: Number(item.total),
  }))

  return (
    <Line
      data={chartData}
      xField="day"
      yField="total"
      height={300}
      smooth
      color="#059669"
      point={{ size: 4, shape: 'circle' }}
      axis={{
        y: {
          labelFormatter: (v: string) => formatCurrency(Number(v)),
        },
      }}
      tooltip={{
        title: (d: { day: string }) => d.day,
        items: [
          {
            field: 'total',
            name: 'Ventas',
            valueFormatter: (v: number) => formatCurrency(v),
          },
        ],
      }}
    />
  )
}
