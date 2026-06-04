import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Badge,
  Dropdown,
  Layout,
  Menu,
  theme,
  Typography,
} from 'antd'
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  TagsOutlined,
  TeamOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'

const { Header, Sider, Content } = Layout
const { Text } = Typography

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { username, role, logout } = useAuth()
  const { canManageUsers, canExport } = usePermissions()
  const { token: themeToken } = theme.useToken()

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: ROUTES.DASHBOARD,
        icon: <DashboardOutlined />,
        label: 'Dashboard',
      },
      {
        key: ROUTES.PRODUCTS,
        icon: <AppstoreOutlined />,
        label: 'Productos',
      },
      {
        key: ROUTES.CATEGORIES,
        icon: <TagsOutlined />,
        label: 'Categorías',
      },
      {
        key: ROUTES.CUSTOMERS,
        icon: <TeamOutlined />,
        label: 'Clientes',
      },
      {
        key: ROUTES.SUPPLIERS,
        icon: <ShopOutlined />,
        label: 'Proveedores',
      },
      {
        key: ROUTES.SALES,
        icon: <ShoppingCartOutlined />,
        label: 'Ventas',
      },
      {
        key: ROUTES.PURCHASES,
        icon: <ShoppingOutlined />,
        label: 'Compras',
      },
      {
        key: ROUTES.INVENTORY,
        icon: <DatabaseOutlined />,
        label: 'Inventario',
      },
    ]

    if (canManageUsers) {
      items.splice(1, 0, {
        key: ROUTES.USERS,
        icon: <UserOutlined />,
        label: 'Usuarios',
      })
    }

    if (canExport) {
      items.push({
        key: ROUTES.EXPORT,
        icon: <FileExcelOutlined />,
        label: 'Exportar ventas',
      })
    }

    return items
  }, [canManageUsers, canExport])

  const userMenu: MenuProps['items'] = [
    {
      key: 'role',
      label: (
        <Text type="secondary">
          Rol: {role === 'ADMIN' ? 'Administrador' : 'Personal'}
        </Text>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesión',
      danger: true,
      onClick: () => {
        logout()
        navigate(ROUTES.LOGIN)
      },
    },
  ]

  return (
    <Layout className="main-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        width={240}
        className="main-sider"
      >
        <div className="brand">
          <MedicineBoxOutlined className="brand-icon" />
          {!collapsed && <span>VetERP</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          className="main-header"
          style={{ background: themeToken.colorBgContainer }}
        >
          <button
            type="button"
            className="collapse-trigger"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Alternar menú"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="header-right">
            <Badge
              color={role === 'ADMIN' ? 'blue' : 'cyan'}
              text={role === 'ADMIN' ? 'Admin' : 'Staff'}
            />
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div className="user-info">
                <Avatar
                  style={{ backgroundColor: themeToken.colorPrimary }}
                  icon={<UserOutlined />}
                />
                <Text strong>{username ?? 'Usuario'}</Text>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
