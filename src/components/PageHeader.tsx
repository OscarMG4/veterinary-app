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
      <div className="page-header-main">
        <div className="page-header-accent" aria-hidden />
        <div>
          <Title level={3} className="page-header-title">
            {title}
          </Title>
          {subtitle && (
            <Paragraph className="page-header-subtitle">{subtitle}</Paragraph>
          )}
        </div>
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  )
}
