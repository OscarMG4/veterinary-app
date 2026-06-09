import { Button, Form, InputNumber, Select } from 'antd'
import { CloseOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { FormInstance } from 'antd/es/form'
import type { ProductResponse } from '../../interfaces/product'
import { formatPrice, roundPrice } from '../../utils/format'

export interface LineItemFormValues {
  productId?: number
  quantity: number
  price: number
}

interface LineItemsEditorProps {
  form: FormInstance
  products: ProductResponse[]
  onProductChange: (productId: number, index: number) => void
  listName?: string
}

function lineTotal(item: LineItemFormValues | undefined): number {
  if (!item) return 0
  return (item.price ?? 0) * (item.quantity ?? 0)
}

export function LineItemsEditor({
  form,
  products,
  onProductChange,
  listName = 'items',
}: LineItemsEditorProps) {
  const items: LineItemFormValues[] = Form.useWatch(listName, form) ?? []

  return (
    <Form.List name={listName}>
      {(fields, { add, remove }) => (
        <>
          <div className="line-items-table-wrap">
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="line-item-col-price">Precio</th>
                  <th className="line-item-col-qty">Cantidad</th>
                  <th className="line-item-col-subtotal">Subtotal</th>
                  <th aria-label="Acciones" />
                </tr>
              </thead>
              <tbody>
                {fields.map(({ key, name, ...rest }) => {
                  const item = items[name]

                  return (
                    <tr key={key}>
                      <td>
                        <Form.Item
                          {...rest}
                          name={[name, 'productId']}
                          rules={[{ required: true, message: 'Seleccione producto' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Select
                            showSearch
                            placeholder="Buscar producto..."
                            suffixIcon={<SearchOutlined />}
                            optionFilterProp="label"
                            options={products.map((p) => ({
                              value: p.id,
                              label: p.barcode
                                ? `${p.name} — ${p.barcode} (stock: ${p.stock})`
                                : `${p.name} (stock: ${p.stock})`,
                            }))}
                            onChange={(id) => onProductChange(id, name)}
                            className="line-item-product-select"
                          />
                        </Form.Item>
                      </td>
                      <td className="line-item-col-price">
                        <Form.Item
                          {...rest}
                          name={[name, 'price']}
                          rules={[{ required: true, message: 'Precio' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            min={0}
                            precision={2}
                            controls={false}
                            className="line-item-input line-item-price-input"
                          />
                        </Form.Item>
                      </td>
                      <td className="line-item-col-qty">
                        <Form.Item
                          {...rest}
                          name={[name, 'quantity']}
                          initialValue={1}
                          rules={[{ required: true, message: 'Cant.' }]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber min={1} className="line-item-input" />
                        </Form.Item>
                      </td>
                      <td className="line-item-col-subtotal">
                        <span className="line-item-total">
                          {formatPrice(lineTotal(item))}
                        </span>
                      </td>
                      <td>
                        {fields.length > 1 && (
                          <Button
                            type="text"
                            icon={<CloseOutlined />}
                            className="line-item-remove"
                            onClick={() => remove(name)}
                            aria-label="Eliminar línea"
                          />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Button
            type="default"
            icon={<PlusOutlined />}
            onClick={() => add({ quantity: 1, price: 0 })}
            className="line-items-add-btn"
          >
            Agregar línea
          </Button>
        </>
      )}
    </Form.List>
  )
}

export function computeLineItemsSubtotal(items: LineItemFormValues[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function mapLineItemsForApi(items: LineItemFormValues[]) {
  return items.map((item) => ({
    productId: item.productId!,
    quantity: item.quantity,
    price: roundPrice(item.price),
  }))
}
