export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/usuarios',
  /** Módulo principal: Inventario */
  INVENTORY_MODULE: '/inventario',
  PRODUCTS: '/inventario/productos',
  CATEGORIES: '/inventario/categorias',
  INVENTORY_ADJUSTMENTS: '/inventario/ajustes',
  CUSTOMERS: '/clientes',
  SUPPLIERS: '/proveedores',
  /** Módulo principal: Ventas */
  SALES_MODULE: '/ventas',
  SALES_LIST: '/ventas/listado',
  SALES_REGISTER: '/ventas/registrar',
  SALES_EDIT: '/ventas/editar',
  /** Módulo principal: Compras */
  PURCHASES_MODULE: '/compras',
  PURCHASES_LIST: '/compras/listado',
  PURCHASES_REGISTER: '/compras/registrar',
  PURCHASES_EDIT: '/compras/editar',
} as const

export function salesEditPath(id: number) {
  return `${ROUTES.SALES_EDIT}/${id}`
}

export function purchasesEditPath(id: number) {
  return `${ROUTES.PURCHASES_EDIT}/${id}`
}

/** Rutas antiguas — redirigen al nuevo módulo */
export const LEGACY_ROUTES = {
  PRODUCTS: '/productos',
  CATEGORIES: '/categorias',
} as const

export const INVENTORY_MENU_KEY = 'inventario-menu'
export const SALES_MENU_KEY = 'ventas-menu'
export const PURCHASES_MENU_KEY = 'compras-menu'
