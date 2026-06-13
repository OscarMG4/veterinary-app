import { Skeleton } from 'antd'
import { Gauge } from '@ant-design/plots'
import { formatNumber } from '../../utils/format'

interface StockGaugeChartProps {
  currentStock: number
  totalProducts: number
  loading?: boolean
}

export function StockGaugeChart({
  currentStock,
  totalProducts,
  loading,
}: StockGaugeChartProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />
  }

  const capacity = Math.max(totalProducts * 50, currentStock, 100)
  const percent = Math.min(currentStock / capacity, 1)

  const getColor = () => {
    if (percent < 0.3) return '#ef4444'
    if (percent < 0.6) return '#f59e0b'
    return '#059669'
  }

  return (
    <div className="stock-gauge-wrap">
      <Gauge
        data={percent}
        scale={{
          color: {
            range: ['#ef4444', '#f59e0b', '#059669'],
          },
        }}
        style={{
          textContent: () => formatNumber(currentStock),
        }}
        height={220}
        legend={false}
      />
      <div className="stock-gauge-meta">
        <span className="stock-gauge-value" style={{ color: getColor() }}>
          {formatNumber(currentStock)}
        </span>
        <span className="stock-gauge-label">unidades disponibles</span>
      </div>
    </div>
  )
}
