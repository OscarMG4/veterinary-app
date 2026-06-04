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
import { MinusCircleOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import { purchaseService } from '../services/purchaseService'
import { supplierService } from '../services/supplierService'
import { productService } from '../services/productService'
import type { SupplierResponse } from '../interfaces/supplier'
import type { ProductResponse } from '../interfaces/product'
import type { PurchaseRequest } from '../interfaces/purchase'
import { formatCurrency } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Text } = Typography

interface PurchaseFormValues {
  supplierId: number
  items: { productId: number; quantity: number; price: number }[]
}

interface PurchaseCatalogData {
  suppliers: SupplierResponse[]
  products: ProductResponse[]
}

export function PurchasesPage() {
  const { data: catalog } = useAsyncData<PurchaseCatalogData>(
    async () => {
      try {
        const [s, p] = await Promise.all([
          supplierService.getAll(),
          productService.getAll(),
        ])
        return { suppliers: s.data, products: p.data }
      } catch (error) {
        handleApiError(error)
        return { suppliers: [], products: [] }
      }
    },
    [],
    { suppliers: [], products: [] },
  )
  const suppliers = catalog?.suppliers ?? []
  const products = catalog?.products ?? []
  const [submitLoading, setSubmitLoading] = useState(false)
  const [lastPurchase, setLastPurchase] = useState<string | null>(null)
  const [form] = Form.useForm<PurchaseFormValues>()

  const items = Form.useWatch('items', form) ?? []
  const total = items.reduce(
    (sum, item) => sum + (item?.quantity ?? 0) * (item?.price ?? 0),
    0,
  )

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

  const onFinish = async (values: PurchaseFormValues) => {
    setSubmitLoading(true)
    try {
      const payload: PurchaseRequest = {
        supplierId: values.supplierId,
        items: values.items,
      }
      const { data } = await purchaseService.create(payload)
      message.success(`Compra registrada: ${data.documentNumber}`)
      setLastPurchase(
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
        title="Compras"
        subtitle="Registrar nueva compra (POST /api/purchases)"
      />
      {lastPurchase && (
        <Card size="small" style={{ marginBottom: 16 }} type="inner">
          <Text type="success">Última compra: {lastPurchase}</Text>
        </Card>
      )}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ items: [{}] }}
        >
          <Form.Item
            name="supplierId"
            label="Proveedor"
            rules={[{ required: true, message: 'Seleccione un proveedor' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Seleccionar proveedor"
              options={suppliers.map((s) => ({
                value: s.id,
                label: `${s.businessName} — ${s.documentNumber}`,
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
                      rules={[{ required: true }]}
                    >
                      <Select
                        style={{ width: 220 }}
                        placeholder="Producto"
                        options={products.map((p) => ({
                          value: p.id,
                          label: p.name,
                        }))}
                        onChange={(id) => onProductChange(id, name)}
                      />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'quantity']}
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={1} placeholder="Cant." />
                    </Form.Item>
                    <Form.Item
                      {...rest}
                      name={[name, 'price']}
                      rules={[{ required: true }]}
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

          <Card size="small" className="sale-summary" style={{ marginTop: 16 }}>
            <p>
              <strong>Total: {formatCurrency(total)}</strong>
            </p>
          </Card>

          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              icon={<ShoppingOutlined />}
              size="large"
            >
              Registrar compra
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
