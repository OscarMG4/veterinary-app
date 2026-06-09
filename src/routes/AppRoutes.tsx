import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { MainLayout } from '../layouts/MainLayout'
import { LEGACY_ROUTES, ROUTES } from '../constants/routes'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { UsersPage } from '../pages/UsersPage'
import { ProductsPage } from '../pages/ProductsPage'
import { CategoriesPage } from '../pages/CategoriesPage'
import { CustomersPage } from '../pages/CustomersPage'
import { SuppliersPage } from '../pages/SuppliersPage'
import { SalesListPage } from '../pages/SalesListPage'
import { PurchasesListPage } from '../pages/PurchasesListPage'
import { RegisterSalePage } from '../pages/SalesPage'
import { RegisterPurchasePage } from '../pages/PurchasesPage'
import { EditSalePage } from '../pages/EditSalePage'
import { EditPurchasePage } from '../pages/EditPurchasePage'
import { InventoryPage } from '../pages/InventoryPage'

function AdminRoute() {
  return <ProtectedRoute roles={['ADMIN']} />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route
              path={ROUTES.INVENTORY_MODULE}
              element={<Navigate to={ROUTES.PRODUCTS} replace />}
            />
            <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
            <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
            <Route
              path={ROUTES.INVENTORY_ADJUSTMENTS}
              element={<InventoryPage />}
            />
            <Route
              path={LEGACY_ROUTES.PRODUCTS}
              element={<Navigate to={ROUTES.PRODUCTS} replace />}
            />
            <Route
              path={LEGACY_ROUTES.CATEGORIES}
              element={<Navigate to={ROUTES.CATEGORIES} replace />}
            />
            <Route path={ROUTES.CUSTOMERS} element={<CustomersPage />} />
            <Route path={ROUTES.SUPPLIERS} element={<SuppliersPage />} />
            <Route
              path={ROUTES.SALES_MODULE}
              element={<Navigate to={ROUTES.SALES_LIST} replace />}
            />
            <Route path={ROUTES.SALES_LIST} element={<SalesListPage />} />
            <Route path={ROUTES.SALES_REGISTER} element={<RegisterSalePage />} />
            <Route path={`${ROUTES.SALES_EDIT}/:id`} element={<EditSalePage />} />
            <Route
              path={ROUTES.PURCHASES_MODULE}
              element={<Navigate to={ROUTES.PURCHASES_LIST} replace />}
            />
            <Route path={ROUTES.PURCHASES_LIST} element={<PurchasesListPage />} />
            <Route
              path={ROUTES.PURCHASES_REGISTER}
              element={<RegisterPurchasePage />}
            />
            <Route
              path={`${ROUTES.PURCHASES_EDIT}/:id`}
              element={<EditPurchasePage />}
            />
            <Route element={<AdminRoute />}>
              <Route path={ROUTES.USERS} element={<UsersPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
