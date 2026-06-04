import { useState } from 'react'
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import type { ProductRequest, ProductResponse } from '../interfaces/product'
import type { CategoryResponse } from '../interfaces/category'
import { formatCurrency } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

interface ProductsPageData {
  products: ProductResponse[]
  categories: CategoryResponse[]
}

export function ProductsPage() {
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const {
    data,
    loading,
    reload: loadData,
  } = useAsyncData<ProductsPageData>(
    async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          lowStockOnly
            ? productService.getLowStock()
            : productService.getAll(),
          categoryService.getAll(),
        ])
        return {
          products: productsRes.data,
          categories: categoriesRes.data,
        }
      } catch (error) {
        handleApiError(error)
        return { products: [], categories: [] }
      }
    },
    [lowStockOnly],
    { products: [], categories: [] },
  )
  const products = data?.products ?? []
  const categories = data?.categories ?? []
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ProductResponse | null>(null)
  const [search, setSearch] = useState('')
  const [form] = Form.useForm<ProductRequest>()

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: ProductResponse) => {
    setEditing(record)
    const category = categories.find((c) => c.name === record.categoryName)
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      barcode: record.barcode,
      price: record.price,
      stock: record.stock,
      minStock: record.minStock,
      categoryId: category?.id,
    })
    setModalOpen(true)
  }

  const onSubmit = async (values: ProductRequest) => {
    try {
      if (editing) {
        await productService.update(editing.id, values)
        message.success('Producto actualizado')
      } else {
        await productService.create(values)
        message.success('Producto creado')
      }
      setModalOpen(false)
      void loadData()
    } catch (error) {
      handleApiError(error)
    }
  }

  const onDelete = (record: ProductResponse) => {
    Modal.confirm({
      title: '¿Eliminar producto?',
      content: `Se eliminará "${record.name}"`,
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await productService.remove(record.id)
          message.success('Producto eliminado')
          void loadData()
        } catch (error) {
          handleApiError(error)
        }
      },
    })
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode ?? '').toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Catálogo e inventario de productos"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Nuevo producto
          </Button>
        }
      />
      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Buscar producto..."
          allowClear
          onSearch={setSearch}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
        <Space>
          <span>Solo bajo stock</span>
          <Switch checked={lowStockOnly} onChange={setLowStockOnly} />
        </Space>
      </Space>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        scroll={{ x: 900 }}
        columns={[
          { title: 'Nombre', dataIndex: 'name' },
          { title: 'Categoría', dataIndex: 'categoryName' },
          { title: 'Código', dataIndex: 'barcode' },
          {
            title: 'Precio',
            dataIndex: 'price',
            render: (v: number) => formatCurrency(v),
          },
          { title: 'Stock', dataIndex: 'stock', align: 'center' },
          { title: 'Mín.', dataIndex: 'minStock', align: 'center' },
          {
            title: 'Estado',
            render: (_, r) =>
              r.lowStock ? (
                <Tag color="error">Bajo stock</Tag>
              ) : (
                <Tag color="success">OK</Tag>
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
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="barcode" label="Código de barras">
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="Categoría" rules={[{ required: true }]}>
            <Select
              options={categories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            />
          </Form.Item>
          <Space style={{ width: '100%' }} size="large">
            <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="minStock" label="Stock mínimo" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}
