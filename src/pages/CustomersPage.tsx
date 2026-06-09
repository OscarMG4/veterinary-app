import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { customerService } from '../services/customerService'
import type { CustomerRequest, CustomerResponse } from '../interfaces/customer'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { handleApiError } from '../utils/errorHandler'

export function CustomersPage() {
  const { canDelete } = usePermissions()
  const {
    data: customers = [],
    loading,
    reload: loadCustomers,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await customerService.getAll()
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
  const [editing, setEditing] = useState<CustomerResponse | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm<CustomerRequest>()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: CustomerResponse) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const onSubmit = async (values: CustomerRequest) => {
    try {
      if (editing) {
        await customerService.update(editing.id, values)
        message.success('Cliente actualizado')
      } else {
        await customerService.create(values)
        message.success('Cliente creado')
      }
      setModalOpen(false)
      void loadCustomers()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDelete = (record: CustomerResponse) => {
    Modal.confirm({
      title: '¿Eliminar cliente?',
      content: `Se eliminará ${record.firstName} ${record.lastName}`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await customerService.remove(record.id)
          message.success('Cliente eliminado')
          void loadCustomers()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const filtered = customers.filter(
    (c) =>
      c.documentNumber.includes(search) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle="Tutores y responsables de mascotas"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Nuevo cliente
          </Button>
        }
      />
      <Input.Search
        placeholder="Buscar por documento o nombre..."
        allowClear
        onSearch={setSearch}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 320, marginBottom: 16 }}
      />
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        scroll={{ x: 1000 }}
        columns={[
          { title: 'Tipo doc.', dataIndex: 'documentType', width: 90 },
          { title: 'Número', dataIndex: 'documentNumber' },
          {
            title: 'Nombre',
            render: (_, r) => `${r.firstName} ${r.lastName}`,
          },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Teléfono', dataIndex: 'phone' },
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
            fixed: 'right',
            render: (_, record) => (
              <Space>
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openEdit(record)}
                />
                {canDelete && (
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(record)}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? 'Editar cliente' : 'Nuevo cliente'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Space style={{ width: '100%' }} size="middle">
            <Form.Item name="documentType" label="Tipo documento" rules={[{ required: true }]}>
              <Input placeholder="CC, CE, NIT..." />
            </Form.Item>
            <Form.Item name="documentNumber" label="Número" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Space>
          <Space style={{ width: '100%' }} size="middle">
            <Form.Item name="firstName" label="Nombres" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Apellidos" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phone" label="Teléfono">
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Dirección">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
