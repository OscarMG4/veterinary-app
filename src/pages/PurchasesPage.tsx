import { useState } from 'react'
import {
  Button,
  Form,
  Select,
  Typography,
  message,
} from 'antd'
import { ShoppingOutlined, SearchOutlined } from '@ant-design/icons'
import { PageHeader } from '../components/PageHeader'
import {
  LineItemsEditor,
  computeLineItemsSubtotal,
  mapLineItemsForApi,
  type LineItemFormValues,
} from '../components/transactions/LineItemsEditor'
import { purchaseService } from '../services/purchaseService'
import { supplierService } from '../services/supplierService'
import { productService } from '../services/productService'
import type { SupplierResponse } from '../interfaces/supplier'
import type { ProductResponse } from '../interfaces/product'
import type { PurchaseRequest } from '../interfaces/purchase'
import { formatCurrency, roundPrice } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Text, Title } = Typography

interface PurchaseFormValues {
  supplierId: number
  items: LineItemFormValues[]
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
  const total = computeLineItemsSubtotal(items)

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

  const onFinish = async (values: PurchaseFormValues) => {
    setSubmitLoading(true)
    try {
      const payload: PurchaseRequest = {
        supplierId: values.supplierId,
        items: mapLineItemsForApi(values.items),
      }
      const { data } = await purchaseService.create(payload)
      message.success(`Compra registrada: ${data.documentNumber}`)
      setLastPurchase(
        `${data.documentNumber} — Total: ${formatCurrency(data.total)}`,
      )
      form.resetFields()
      form.setFieldsValue({
        items: [{ quantity: 1, price: 0 }],
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
        title="Compras"
        subtitle="Registrar compra de insumos y medicamentos veterinarios"
      />

      {lastPurchase && (
        <div className="transaction-success-banner">
          <Text type="success">Última compra: {lastPurchase}</Text>
        </div>
      )}

      <div className="transaction-form">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            items: [{ quantity: 1, price: 0 }],
          }}
        >
          <section className="transaction-section">
            <Title level={5} className="transaction-section-title">
              Proveedor
            </Title>
            <Form.Item
              name="supplierId"
              rules={[{ required: true, message: 'Seleccione un proveedor' }]}
              style={{ marginBottom: 0 }}
            >
              <Select
                showSearch
                placeholder="Buscar por documento o razón social..."
                suffixIcon={<SearchOutlined />}
                optionFilterProp="label"
                options={suppliers.map((s) => ({
                  value: s.id,
                  label: `${s.documentNumber} — ${s.businessName}`,
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
              <div className="transaction-total-row transaction-total-final">
                <span>Total</span>
                <strong>{formatCurrency(total)}</strong>
              </div>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              icon={<ShoppingOutlined />}
              size="large"
              className="transaction-submit-btn"
            >
              Registrar compra
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
