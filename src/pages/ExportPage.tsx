import { useState } from 'react'
import { Button, Card, Typography, message } from 'antd'
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { exportService } from '../services/exportService'
import { handleApiError } from '../utils/errorHandler'

const { Paragraph } = Typography

export function ExportPage() {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const { data } = await exportService.downloadSales()
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'sales.xlsx')
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
    <div>
      <PageHeader
        title="Exportar ventas"
        subtitle="Descarga reporte Excel (GET /api/export/sales)"
      />
      <Card className="export-card">
        <FileExcelOutlined className="export-icon" />
        <Paragraph>
          Exporta todas las ventas registradas en formato Excel (.xlsx).
          Solo disponible para administradores.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          icon={<DownloadOutlined />}
          loading={loading}
          onClick={() => void handleDownload()}
        >
          Descargar ventas.xlsx
        </Button>
      </Card>
    </div>
  )
}
