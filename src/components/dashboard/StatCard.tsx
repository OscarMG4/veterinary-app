import { Card, Skeleton, Statistic } from 'antd'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  loading?: boolean
  variant: 'primary' | 'info' | 'warning' | 'success' | 'danger' | 'purple'
  formatter?: (value: number | string) => string
}

export function StatCard({
  title,
  value,
  icon,
  loading,
  variant,
  formatter,
}: StatCardProps) {
  return (
    <Card className={`stat-card stat-card-${variant}`} variant="borderless">
      {loading ? (
        <Skeleton active paragraph={false} />
      ) : (
        <div className="stat-card-body">
          <div className={`stat-card-icon stat-card-icon-${variant}`}>{icon}</div>
          <Statistic
            title={title}
            value={value}
            formatter={formatter ? (v) => formatter(String(v)) : undefined}
          />
        </div>
      )}
    </Card>
  )
}
