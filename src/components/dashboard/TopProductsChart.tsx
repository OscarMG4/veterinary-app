import { Empty, Skeleton } from 'antd'
import { Bar } from '@ant-design/plots'
import type { TopProductStat } from '../../interfaces/dashboard'

interface TopProductsChartProps {
  data: TopProductStat[]
  loading?: boolean
}

export function TopProductsChart({ data, loading }: TopProductsChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description="Sin datos de productos vendidos"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const chartData = [...data]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(-8)
    .map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }))

  return (
    <Bar
      data={chartData}
      xField="quantity"
      yField="product"
      height={300}
      color="#0d9488"
      axis={{
        x: { title: 'Unidades vendidas' },
      }}
      tooltip={{
        title: (d: { product: string }) => d.product,
        items: [{ field: 'quantity', name: 'Cantidad' }],
      }}
    />
  )
}
