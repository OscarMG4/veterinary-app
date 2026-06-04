import { Typography } from 'antd'
import type { ReactNode } from 'react'

const { Title, Paragraph } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: ReactNode
}

export function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <Title level={3} style={{ margin: 0 }}>
          {title}
        </Title>
        {subtitle && (
          <Paragraph type="secondary" style={{ margin: '4px 0 0' }}>
            {subtitle}
          </Paragraph>
        )}
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  )
}
