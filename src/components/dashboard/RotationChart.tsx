import { Empty, Skeleton } from 'antd'
import { Pie } from '@ant-design/plots'
import type { TopProductStat } from '../../interfaces/dashboard'
import { formatNumber } from '../../utils/format'

interface RotationChartProps {
  data: TopProductStat[]
  loading?: boolean
  title?: string
  variant: 'high' | 'low'
}

const COLORS_HIGH = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0']
const COLORS_LOW = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']

export function RotationChart({
  data,
  loading,
  title,
  variant,
}: RotationChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description={
          variant === 'high'
            ? 'Sin datos de rotación alta'
            : 'Sin datos de rotación baja'
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  const chartData = data.map((item) => ({
    product: item.product,
    quantity: Number(item.quantity),
  }))

  return (
    <div>
      {title && <p className="chart-subtitle">{title}</p>}
      <Pie
        data={chartData}
        angleField="quantity"
        colorField="product"
        radius={0.9}
        innerRadius={0.62}
        height={300}
        scale={{
          color: {
            range: variant === 'high' ? COLORS_HIGH : COLORS_LOW,
          },
        }}
        label={{
          text: (d: { product: string; quantity: number }) =>
            `${d.product.length > 12 ? d.product.slice(0, 12) + '…' : d.product}: ${formatNumber(d.quantity)}`,
          style: { fontSize: 10, fontWeight: 500 },
        }}
        legend={{ position: 'bottom', layout: { justifyContent: 'center' } }}
        tooltip={{
          title: (d: { product: string }) => d.product,
          items: [{ field: 'quantity', name: 'Unidades' }],
        }}
      />
    </div>
  )
}
