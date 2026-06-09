import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Form,
  InputNumber,
  Select,
  Spin,
  Typography,
  message,
} from 'antd'
import { SaveOutlined, SearchOutlined } from '@ant-design/icons'
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
import { ROUTES } from '../constants/routes'
import { formatCurrency, roundPrice } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Title } = Typography

interface SaleFormValues {
  customerId: number
  discount?: number
  items: LineItemFormValues[]
}

interface SaleCatalogData {
  customers: CustomerResponse[]
  products: ProductResponse[]
}

export function EditSalePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const saleId = Number(id)
  const [form] = Form.useForm<SaleFormValues>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loadingSale, setLoadingSale] = useState(true)

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

  const items = Form.useWatch('items', form) ?? []
  const subtotal = computeLineItemsSubtotal(items)
  const discount = Form.useWatch('discount', form) ?? 0
  const total = Math.max(subtotal - discount, 0)

  useEffect(() => {
    if (!saleId || Number.isNaN(saleId)) {
      navigate(ROUTES.SALES_LIST)
      return
    }

    const loadSale = async () => {
      setLoadingSale(true)
      try {
        const { data } = await saleService.getById(saleId)
        form.setFieldsValue({
          customerId: data.customerId,
          discount: data.discount ?? 0,
          items: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: roundPrice(item.price),
          })),
        })
      } catch (error) {
        handleApiError(error)
        navigate(ROUTES.SALES_LIST)
      } finally {
        setLoadingSale(false)
      }
    }

    void loadSale()
  }, [saleId, form, navigate])

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
      const { data } = await saleService.update(saleId, payload)
      message.success(`Venta actualizada: ${data.documentNumber}`)
      navigate(ROUTES.SALES_LIST)
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loadingSale) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Editar venta"
        subtitle="Modifica los datos de la venta seleccionada"
      />

      <div className="transaction-form">
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <div style={{ display: 'flex', gap: 12 }}>
              <Button size="large" onClick={() => navigate(ROUTES.SALES_LIST)}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                icon={<SaveOutlined />}
                size="large"
                className="transaction-submit-btn"
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
