import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import { LockOutlined, MedicineBoxOutlined, UserOutlined } from '@ant-design/icons'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import type { LoginRequest } from '../interfaces/auth'
import { handleApiError } from '../utils/errorHandler'

const { Title, Text } = Typography

export function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm<LoginRequest>()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const onFinish = async (values: LoginRequest) => {
    setLoading(true)
    try {
      await login(values)
      message.success('Bienvenido al sistema veterinario')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch (error) {
      handleApiError(error, true)
      message.error('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card" bordered={false}>
        <div className="login-brand">
          <MedicineBoxOutlined className="login-logo" />
          <Title level={2}>VetERP</Title>
          <Text type="secondary">Sistema de Gestión Veterinaria</Text>
        </div>
        <Form form={form} layout="vertical" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            label="Usuario"
            rules={[{ required: true, message: 'Ingrese su usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: 'Ingrese su contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Iniciar sesión
            </Button>
          </Form.Item>
        </Form>
        <Text type="secondary" className="login-hint">
          Usuario demo: admin / Admin123*
        </Text>
      </Card>
    </div>
  )
}
