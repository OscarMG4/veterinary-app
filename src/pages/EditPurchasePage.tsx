import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Form,
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
import { purchaseService } from '../services/purchaseService'
import { supplierService } from '../services/supplierService'
import { productService } from '../services/productService'
import type { SupplierResponse } from '../interfaces/supplier'
import type { ProductResponse } from '../interfaces/product'
import type { PurchaseRequest } from '../interfaces/purchase'
import { ROUTES } from '../constants/routes'
import { formatCurrency, roundPrice } from '../utils/format'
import { useAsyncData } from '../hooks/useAsyncData'
import { handleApiError } from '../utils/errorHandler'

const { Title } = Typography

interface PurchaseFormValues {
  supplierId: number
  items: LineItemFormValues[]
}

interface PurchaseCatalogData {
  suppliers: SupplierResponse[]
  products: ProductResponse[]
}

export function EditPurchasePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const purchaseId = Number(id)
  const [form] = Form.useForm<PurchaseFormValues>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [loadingPurchase, setLoadingPurchase] = useState(true)

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

  const items = Form.useWatch('items', form) ?? []
  const total = computeLineItemsSubtotal(items)

  useEffect(() => {
    if (!purchaseId || Number.isNaN(purchaseId)) {
      navigate(ROUTES.PURCHASES_LIST)
      return
    }

    const loadPurchase = async () => {
      setLoadingPurchase(true)
      try {
        const { data } = await purchaseService.getById(purchaseId)
        form.setFieldsValue({
          supplierId: data.supplierId,
          items: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: roundPrice(item.price),
          })),
        })
      } catch (error) {
        handleApiError(error)
        navigate(ROUTES.PURCHASES_LIST)
      } finally {
        setLoadingPurchase(false)
      }
    }

    void loadPurchase()
  }, [purchaseId, form, navigate])

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
      const { data } = await purchaseService.update(purchaseId, payload)
      message.success(`Compra actualizada: ${data.documentNumber}`)
      navigate(ROUTES.PURCHASES_LIST)
    } catch (error) {
      handleApiError(error)
    } finally {
      setSubmitLoading(false)
    }
  }

  if (loadingPurchase) {
    return (
      <div className="page-loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Editar compra"
        subtitle="Modifica los datos de la compra seleccionada"
      />

      <div className="transaction-form">
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
            <div style={{ display: 'flex', gap: 12 }}>
              <Button size="large" onClick={() => navigate(ROUTES.PURCHASES_LIST)}>
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
