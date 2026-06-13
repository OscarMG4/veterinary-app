import { Empty, Skeleton, Table, Tag } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import type { ReplenishmentAlertStat } from '../../interfaces/dashboard'
import { formatNumber } from '../../utils/format'

interface ReplenishmentAlertsTableProps {
  data: ReplenishmentAlertStat[]
  loading?: boolean
}

export function ReplenishmentAlertsTable({
  data,
  loading,
}: ReplenishmentAlertsTableProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description="No hay alertas de reposición"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <Table
      size="small"
      rowKey="product"
      dataSource={data}
      pagination={false}
      scroll={{ x: 520 }}
      columns={[
        {
          title: 'Producto',
          dataIndex: 'product',
          ellipsis: true,
          render: (name: string, record: ReplenishmentAlertStat) => (
            <span>
              {record.priority === 'CRITICAL' && (
                <WarningOutlined style={{ color: '#ef4444', marginRight: 6 }} />
              )}
              {name}
            </span>
          ),
        },
        {
          title: 'Stock',
          dataIndex: 'stock',
          align: 'center',
          render: (v: number) => formatNumber(v),
        },
        {
          title: 'Mínimo',
          dataIndex: 'minStock',
          align: 'center',
        },
        {
          title: 'Faltante',
          dataIndex: 'deficit',
          align: 'center',
          render: (v: number) => (
            <Tag color={v > 0 ? 'red' : 'default'}>{formatNumber(v)}</Tag>
          ),
        },
        {
          title: 'Sugerido',
          dataIndex: 'suggestedReorder',
          align: 'center',
          render: (v: number) => (
            <Tag color="orange">{formatNumber(v)} uds.</Tag>
          ),
        },
        {
          title: 'Prioridad',
          dataIndex: 'priority',
          align: 'center',
          render: (p: string) => (
            <Tag color={p === 'CRITICAL' ? 'red' : 'gold'}>
              {p === 'CRITICAL' ? 'Crítica' : 'Baja'}
            </Tag>
          ),
        },
      ]}
    />
  )
}
