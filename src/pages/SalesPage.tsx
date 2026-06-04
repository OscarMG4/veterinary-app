import { useState } from 'react'
import {
  Button,
  Card,
  Form,
  InputNumber,
  Select,
  Space,
  Typography,
  message,
  Divider,
} from 'antd'
import { MinusCircleOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { saleService } from '../services/saleService'
import { customerService } from '../services/customerService'
import { productService } from '../services/productService'
import type { CustomerResponse } from '../interfaces/customer'
import type { ProductResponse } from '../interfaces/product'
import type { SaleRequest } from '../interfaces/sale'
import { formatCurrency } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Text } = Typography

interface SaleFormValues {
  customerId: number
  discount?: number
  items: { productId: number; quantity: number; price: number }[]
}

interface SaleCatalogData {
  customers: CustomerResponse[]
  products: ProductResponse[]
}

export function SalesPage() {
  const { data: catalog } = useAsyncData<SaleCatalogData>(
    async () => {
      try {
        const [c, p] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
        ])
        return { customers: c.data, products: p.data }
      } catch (error) {
        handleApiError(error)
        return { customers: [], products: [] }
      }
    },
    [],
    { customers: [], products: [] },
  )
  const customers = catalog?.customers ?? []
  const products = catalog?.products ?? []
  const [submitLoading, setSubmitLoading] = useState(false)
  const [lastSale, setLastSale] = useState<string | null>(null)
  const [form] = Form.useForm<SaleFormValues>()

  const items = Form.useWatch('items', form) ?? []

  const subtotal = items.reduce(
    (sum, item) => sum + (item?.quantity ?? 0) * (item?.price ?? 0),
    0,
  )
  const discount = Form.useWatch('discount', form) ?? 0
  const total = Math.max(subtotal - discount, 0)

  const onProductChange = (productId: number, index: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const itemsValue = form.getFieldValue('items') ?? []
      itemsValue[index] = {
        ...itemsValue[index],
        productId,
        price: product.price,
      }
      form.setFieldsValue({ items: itemsValue })
    }
  }

  const onFinish = async (values: SaleFormValues) => {
    setSubmitLoading(true)
    try {
      const payload: SaleRequest = {
        customerId: values.customerId,
        discount: values.discount ?? 0,
        items: values.items,
      }
      const { data } = await saleService.create(payload)
      message.success(`Venta registrada: ${data.documentNumber}`)
      setLastSale(
        `${data.documentNumber} — Total: ${formatCurrency(data.total)}`,
      )
      form.resetFields()
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle="Registrar nueva venta (POST /api/sales)"
      />
      {lastSale && (
        <Card size="small" style={{ marginBottom: 16 }} type="inner">
          <Text type="success">Última venta: {lastSale}</Text>
        </Card>
      )}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ items: [{}], discount: 0 }}
        >
          <Form.Item
            name="customerId"
            label="Cliente"
            rules={[{ required: true, message: 'Seleccione un cliente' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Seleccionar cliente"
              options={customers.map((c) => ({
                value: c.id,
                label: `${c.firstName} ${c.lastName} — ${c.documentNumber}`,
              }))}
            />
          </Form.Item>

          <Divider>Productos</Divider>

          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 12 }}
                    wrap
                  >
                    <Form.Item
                      {...rest}
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Producto' }]}
                    >
                      <Select
                        style={{ width: 220 }}
                        placeholder="Producto"
                        options={products.map((p) => ({
                          value: p.id,
                          label: `${p.name} (stock: ${p.stock})`,
                        }))}
                        onChange={(id) => onProductChange(id, name)}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'quantity']}
                      rules={[{ required: true, message: 'Cant.' }]}
                    >
                      <InputNumber min={1} placeholder="Cant." />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'price']}
                      rules={[{ required: true, message: 'Precio' }]}
                    >
                      <InputNumber min={0} placeholder="Precio" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                  Agregar producto
                </Button>
              </>
            )}
          </Form.List>

          <Divider />

          <Form.Item name="discount" label="Descuento">
            <InputNumber min={0} style={{ width: 200 }} />
          </Form.Item>

          <Card size="small" className="sale-summary">
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>Descuento: {formatCurrency(discount)}</p>
            <p>
              <strong>Total: {formatCurrency(total)}</strong>
            </p>
          </Card>

          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              icon={<ShoppingCartOutlined />}
              size="large"
            >
              Registrar venta
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
