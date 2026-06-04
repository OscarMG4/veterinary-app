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
import { supplierService } from '../services/supplierService'
import type { SupplierRequest, SupplierResponse } from '../interfaces/supplier'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { handleApiError } from '../utils/errorHandler'

export function SuppliersPage() {
  const { canDelete } = usePermissions()
  const {
    data: suppliers = [],
    loading,
    reload: loadSuppliers,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await supplierService.getAll()
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
  const [editing, setEditing] = useState<SupplierResponse | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm<SupplierRequest>()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: SupplierResponse) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const onSubmit = async (values: SupplierRequest) => {
    try {
      if (editing) {
        await supplierService.update(editing.id, values)
        message.success('Proveedor actualizado')
      } else {
        await supplierService.create(values)
        message.success('Proveedor creado')
      }
      setModalOpen(false)
      void loadSuppliers()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDelete = (record: SupplierResponse) => {
    Modal.confirm({
      title: '¿Eliminar proveedor?',
      content: `Se eliminará "${record.businessName}"`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await supplierService.remove(record.id)
          message.success('Proveedor eliminado')
          void loadSuppliers()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const filtered = suppliers.filter(
    (s) =>
      s.businessName.toLowerCase().includes(search.toLowerCase()) ||
      s.documentNumber.includes(search),
  )

  return (
    <div>
      <PageHeader
        title="Proveedores"
        subtitle="Gestión de proveedores"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Nuevo proveedor
          </Button>
        }
      />
      <Input.Search
        placeholder="Buscar proveedor..."
        allowClear
        onSearch={setSearch}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 280, marginBottom: 16 }}
      />
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        scroll={{ x: 1000 }}
        columns={[
          { title: 'Razón social', dataIndex: 'businessName' },
          { title: 'Documento', dataIndex: 'documentNumber' },
          { title: 'Contacto', dataIndex: 'contactName' },
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
        title={editing ? 'Editar proveedor' : 'Nuevo proveedor'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Space style={{ width: '100%' }} size="middle">
            <Form.Item name="documentType" label="Tipo documento" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="documentNumber" label="Número" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item name="businessName" label="Razón social" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="contactName" label="Contacto">
            <Input />
          </Form.Item>
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
