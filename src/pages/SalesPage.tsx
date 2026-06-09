import { useState } from 'react'
import {
  Button,
  Form,
  InputNumber,
  Select,
  Typography,
  message,
} from 'antd'
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import {
  LineItemsEditor,
  computeLineItemsSubtotal,
  mapLineItemsForApi,
  type LineItemFormValues,
} from '../components/transactions/LineItemsEditor'
import { saleService } from '../services/saleService'
import { customerService } from '../services/customerService'
import { productService } from '../services/productService'
import type { CustomerResponse } from '../interfaces/customer'
import type { ProductResponse } from '../interfaces/product'
import type { SaleRequest } from '../interfaces/sale'
import { formatCurrency, roundPrice } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Text, Title } = Typography

interface SaleFormValues {
  customerId: number
  discount?: number
  items: LineItemFormValues[]
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
  const subtotal = computeLineItemsSubtotal(items)
  const discount = Form.useWatch('discount', form) ?? 0
  const total = Math.max(subtotal - discount, 0)

  const onProductChange = (productId: number, index: number) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      const itemsValue = [...(form.getFieldValue('items') ?? [])]
      itemsValue[index] = {
        ...itemsValue[index],
        productId,
        price: roundPrice(product.price),
        quantity: itemsValue[index]?.quantity ?? 1,
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
        items: mapLineItemsForApi(values.items),
      }
      const { data } = await saleService.create(payload)
      message.success(`Venta registrada: ${data.documentNumber}`)
      setLastSale(
        `${data.documentNumber} — Total: ${formatCurrency(data.total)}`,
      )
      form.resetFields()
      form.setFieldsValue({
        items: [{ quantity: 1, price: 0 }],
        discount: 0,
      })
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
        subtitle="Registrar venta de medicamentos e insumos a tutores"
      />

      {lastSale && (
        <div className="transaction-success-banner">
          <Text type="success">Última venta: {lastSale}</Text>
        </div>
      )}

      <div className="transaction-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            items: [{ quantity: 1, price: 0 }],
            discount: 0,
          }}
        >
          <section className="transaction-section">
            <Title level={5} className="transaction-section-title">
              Cliente
            </Title>
            <Form.Item
              name="customerId"
              rules={[{ required: true, message: 'Seleccione un cliente' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                showSearch
                placeholder="Buscar por documento o nombre..."
                suffixIcon={<SearchOutlined />}
                optionFilterProp="label"
                options={customers.map((c) => ({
                  value: c.id,
                  label: `${c.documentNumber} — ${c.firstName} ${c.lastName}`,
                }))}
                className="transaction-select"
              />
            </Form.Item>
          </section>

          <div className="transaction-divider" />

          <section className="transaction-section">
            <Title level={5} className="transaction-section-title">
              Productos
            </Title>
            <LineItemsEditor
              form={form}
              products={products}
              onProductChange={onProductChange}
            />
          </section>

          <div className="transaction-footer">
            <div className="transaction-totals">
              <div className="transaction-total-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>
              <div className="transaction-total-row">
                <span>Descuento</span>
                <Form.Item name="discount" style={{ marginBottom: 0 }}>
                  <InputNumber
                    min={0}
                    precision={2}
                    controls={false}
                    className="transaction-discount-input line-item-price-input"
                  />
                </Form.Item>
              </div>
              <div className="transaction-total-row transaction-total-final">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              icon={<ShoppingCartOutlined />}
              size="large"
              className="transaction-submit-btn"
            >
              Registrar venta
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
