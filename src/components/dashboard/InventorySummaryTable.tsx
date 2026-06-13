import { Empty, Skeleton, Table, Tag } from 'antd'
import type { InventorySummaryStat } from '../../interfaces/dashboard'
import { formatNumber } from '../../utils/format'

interface InventorySummaryTableProps {
  data: InventorySummaryStat[]
  loading?: boolean
}

export function InventorySummaryTable({
  data,
  loading,
}: InventorySummaryTableProps) {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />
  }

  if (data.length === 0) {
    return (
      <Empty
        description="Sin productos registrados"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <Table
      size="small"
      rowKey="product"
      dataSource={data}
      pagination={{ pageSize: 6, showSizeChanger: false }}
      scroll={{ x: 480 }}
      columns={[
        {
          title: 'Producto',
          dataIndex: 'product',
          ellipsis: true,
        },
        {
          title: 'Entradas',
          dataIndex: 'entries',
          align: 'center',
          render: (v: number) => (
            <Tag color="green">{formatNumber(v)}</Tag>
          ),
        },
        {
          title: 'Salidas',
          dataIndex: 'exits',
          align: 'center',
          render: (v: number) => (
            <Tag color="red">{formatNumber(v)}</Tag>
          ),
        },
        {
          title: 'Saldo',
          dataIndex: 'balance',
          align: 'center',
          render: (v: number) => (
            <Tag color="blue">{formatNumber(v)}</Tag>
          ),
        },
      ]}
    />
  )
}
