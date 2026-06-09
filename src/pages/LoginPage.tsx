import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Form, Input, Typography, message } from 'antd'
import {
  LockOutlined,
  UserOutlined,
  HeartOutlined,
  ExperimentOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { PawIcon } from '../components/icons/PawIcon'
import { PET_IMAGES } from '../constants/images'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import type { LoginRequest } from '../interfaces/auth'
import { handleApiError } from '../utils/errorHandler'

const { Title, Text, Paragraph } = Typography

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
      message.success('Bienvenido a tu clínica veterinaria')
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
      <div className="login-shell">
        <section
          className="login-hero"
          style={{ backgroundImage: `url(${PET_IMAGES.loginHero})` }}
        >
          <div className="login-hero-overlay" aria-hidden />
          <div className="login-hero-paws" aria-hidden />
          <div className="login-hero-content">
            <div className="login-hero-icon">
              <PawIcon size={44} />
            </div>
            <Title level={1} className="login-hero-title">
              VetERP
            </Title>
            <Text className="login-hero-badge">Clínica veterinaria</Text>
            <Paragraph className="login-hero-text">
              Gestiona medicamentos, insumos, ventas a tutores y el stock de tu
              consultorio con un sistema pensado para el día a día veterinario.
            </Paragraph>
            <div className="login-hero-features">
              <span>
                <HeartOutlined /> Historial y atención a mascotas
              </span>
              <span>
                <ExperimentOutlined /> Control de medicamentos e insumos
              </span>
              <span>
                <ShoppingOutlined /> Ventas y facturación a tutores
              </span>
            </div>
          </div>
        </section>

        <section className="login-form-section">
          <Card className="login-card" variant="borderless">
            <div className="login-form-header">
              <div className="login-form-icon">
                <PawIcon size={36} />
              </div>
              <Title level={3}>Acceso al consultorio</Title>
              <Text type="secondary">
                Ingresa con tu cuenta de veterinario o personal
              </Text>
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
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="••••••••"
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  size="large"
                  className="login-submit-btn"
                >
                  Entrar a la clínica
                </Button>
              </Form.Item>
            </Form>
            <Text type="secondary" className="login-hint">
              Demo: admin / Admin123*
            </Text>
          </Card>
        </section>
      </div>
    </div>
  )
}
