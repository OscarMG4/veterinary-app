import { Empty, Skeleton } from 'antd'
import { Column } from '@ant-design/plots'
import type { LowStockStat } from '../../interfaces/dashboard'

interface LowStockChartProps {
  data: LowStockStat[]
  loading?: boolean
}

export function LowStockChart({ data, loading }: LowStockChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description="Todos los productos tienen stock suficiente"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const chartData = data.flatMap((item) => [
    { product: item.product, type: 'Stock actual', value: item.stock },
    { product: item.product, type: 'Stock mínimo', value: item.minStock },
  ])

  return (
    <Column
      data={chartData}
      xField="product"
      yField="value"
      colorField="type"
      group
      height={300}
      scale={{
        color: {
          range: ['#ff4d4f', '#faad14'],
        },
      }}
      axis={{
        x: { labelTransform: 'rotate(-30deg)' },
        y: { title: 'Unidades' },
      }}
      legend={{ position: 'top' }}
      tooltip={{
        title: (d: { product: string }) => d.product,
        items: [{ field: 'value', name: 'Unidades' }],
      }}
    />
  )
}
