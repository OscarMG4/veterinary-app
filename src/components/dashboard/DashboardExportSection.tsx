import { useState } from 'react'
import { Button, Card, Typography, message } from 'antd'
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { exportService } from '../../services/exportService'
import { handleApiError } from '../../utils/errorHandler'

const { Paragraph, Text } = Typography

export function DashboardExportSection() {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { data } = await exportService.downloadSales()
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ventas.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      message.success('Archivo descargado correctamente')
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="content-card dashboard-export-card" title="Exportar ventas">
      <div className="dashboard-export-content">
        <FileExcelOutlined className="dashboard-export-icon" />
        <div>
          <Paragraph style={{ marginBottom: 4 }}>
            Descarga un reporte Excel con todas las ventas a tutores registradas
            en la clínica.
          </Paragraph>
          <Text type="secondary">Solo disponible para administradores.</Text>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          loading={loading}
          onClick={() => void handleDownload()}
        >
          Descargar ventas.xlsx
        </Button>
      </div>
    </Card>
  )
}
