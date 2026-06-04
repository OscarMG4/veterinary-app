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
import { categoryService } from '../services/categoryService'
import type { CategoryRequest, CategoryResponse } from '../interfaces/category'
import { useAsyncData } from '../hooks/useAsyncData'
import { usePermissions } from '../hooks/usePermissions'
import { handleApiError } from '../utils/errorHandler'

export function CategoriesPage() {
  const { canManageCategories, canDelete } = usePermissions()
  const {
    data: categories = [],
    loading,
    reload: loadCategories,
  } = useAsyncData(
    async () => {
      try {
        const { data } = await categoryService.getAll()
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
  const [editing, setEditing] = useState<CategoryResponse | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm<CategoryRequest>()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: CategoryResponse) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const onSubmit = async (values: CategoryRequest) => {
    try {
      if (editing) {
        await categoryService.update(editing.id, values)
        message.success('Categoría actualizada')
      } else {
        await categoryService.create(values)
        message.success('Categoría creada')
      }
      setModalOpen(false)
      void loadCategories()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDelete = (record: CategoryResponse) => {
    Modal.confirm({
      title: '¿Eliminar categoría?',
      content: `Se eliminará "${record.name}"`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await categoryService.remove(record.id)
          message.success('Categoría eliminada')
          void loadCategories()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        title="Categorías"
        subtitle="Clasificación de productos"
        extra={
          canManageCategories ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Nueva categoría
            </Button>
          ) : undefined
        }
      />
      <Input.Search
        placeholder="Buscar categoría..."
        allowClear
        onSearch={setSearch}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: 280, marginBottom: 16 }}
      />
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        columns={[
          { title: 'Nombre', dataIndex: 'name' },
          { title: 'Descripción', dataIndex: 'description' },
          {
            title: 'Estado',
            dataIndex: 'active',
            render: (active: boolean) => (
              <Tag color={active ? 'success' : 'default'}>
                {active ? 'Activa' : 'Inactiva'}
              </Tag>
            ),
          },
          ...(canManageCategories
            ? [
                {
                  title: 'Acciones',
                  width: 120,
                  render: (_: unknown, record: CategoryResponse) => (
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
              ]
            : []),
        ]}
      />
      {canManageCategories && (
        <Modal
          title={editing ? 'Editar categoría' : 'Nueva categoría'}
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Descripción">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}
