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
  SALES: '/ventas',
  PURCHASES: '/compras',
} as const

/** Rutas antiguas — redirigen al nuevo módulo */
export const LEGACY_ROUTES = {
  PRODUCTS: '/productos',
  CATEGORIES: '/categorias',
} as const

export const INVENTORY_MENU_KEY = 'inventario-menu'
