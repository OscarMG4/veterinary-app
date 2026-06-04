import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { userService } from '../services/userService'
import type { UserRequest, UserResponse } from '../interfaces/user'
import type { UserRole } from '../interfaces/auth'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

export function UsersPage() {
  const {
    data: users = [],
    loading,
    reload: loadUsers,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await userService.getAll()
        return data
      } catch (error) {
        handleApiError(error)
        return []
      }
    },
    [],
    [],
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<UserResponse | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm<UserRequest>()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: UserResponse) => {
    setEditing(record)
    form.setFieldsValue({
      ...record,
      password: undefined,
    })
    setModalOpen(true)
  }

  const onSubmit = async (values: UserRequest) => {
    try {
      if (editing) {
        await userService.update(editing.id, values)
        message.success('Usuario actualizado')
      } else {
        await userService.create(values)
        message.success('Usuario creado')
      }
      setModalOpen(false)
      void loadUsers()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDelete = (record: UserResponse) => {
    Modal.confirm({
      title: '¿Eliminar usuario?',
      content: `Se eliminará "${record.username}"`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await userService.remove(record.id)
          message.success('Usuario eliminado')
          void loadUsers()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle="Gestión de cuentas del sistema"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Nuevo usuario
          </Button>
        }
      />
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar usuario..."
          allowClear
          onSearch={setSearch}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        columns={[
          { title: 'Usuario', dataIndex: 'username' },
          { title: 'Email', dataIndex: 'email' },
          {
            title: 'Nombre',
            render: (_, r) => `${r.firstName} ${r.lastName}`,
          },
          {
            title: 'Rol',
            dataIndex: 'role',
            render: (role: UserRole) => (
              <Tag color={role === 'ADMIN' ? 'blue' : 'cyan'}>{role}</Tag>
            ),
          },
          {
            title: 'Estado',
            dataIndex: 'active',
            render: (active: boolean) => (
              <Tag color={active ? 'success' : 'default'}>
                {active ? 'Activo' : 'Inactivo'}
              </Tag>
            ),
          },
          {
            title: 'Acciones',
            width: 120,
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openEdit(record)}
                />
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(record)}
                />
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? 'Editar usuario' : 'Nuevo usuario'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={editing ? [] : [{ required: true }]}
          >
            <Input.Password placeholder={editing ? 'Dejar vacío para no cambiar' : ''} />
          </Form.Item>
          <Form.Item name="firstName" label="Nombres" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Apellidos" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'ADMIN', label: 'Administrador' },
                { value: 'STAFF', label: 'Personal' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
