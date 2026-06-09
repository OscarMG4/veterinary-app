import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Dropdown,
  Layout,
  Menu,
  Tag,
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
  SwapOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { PawIcon } from '../components/icons/PawIcon'
import type { MenuProps } from 'antd'
import { INVENTORY_MENU_KEY, ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { usePermissions } from '../hooks/usePermissions'

const { Header, Sider, Content } = Layout
const { Text } = Typography

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const navigate = useNavigate()
  const location = useLocation()
  const { username, role, logout } = useAuth()
  const { canManageUsers } = usePermissions()
  const { token: themeToken } = theme.useToken()

  const isInventoryRoute = location.pathname.startsWith(ROUTES.INVENTORY_MODULE)

  useEffect(() => {
    if (isInventoryRoute) {
      setOpenKeys([INVENTORY_MENU_KEY])
    }
  }, [isInventoryRoute])

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        key: ROUTES.DASHBOARD,
        icon: <DashboardOutlined />,
        label: 'Dashboard',
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
        key: INVENTORY_MENU_KEY,
        icon: <DatabaseOutlined />,
        label: 'Inventario',
        children: [
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
            key: ROUTES.INVENTORY_ADJUSTMENTS,
            icon: <SwapOutlined />,
            label: 'Ajustes de stock',
          },
        ],
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
    ]

    if (canManageUsers) {
      items.push({
        key: ROUTES.USERS,
        icon: <UserOutlined />,
        label: 'Usuarios',
      })
    }

    return items
  }, [canManageUsers])

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
        width={260}
        className="main-sider"
        trigger={null}
      >
        <div className="brand">
          <div className="brand-icon-wrap">
            <PawIcon className="brand-icon" size={36} />
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-name">VetERP</span>
              <span className="brand-tagline">Clínica veterinaria</span>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="main-menu"
        />
      </Sider>
      <Layout className="main-layout-inner">
        <Header className="main-header">
          <button
            type="button"
            className="collapse-trigger"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Alternar menú"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          <div className="header-right">
            <Tag
              color={role === 'ADMIN' ? 'green' : 'default'}
              className="role-tag"
            >
              {role === 'ADMIN' ? 'Administrador' : 'Personal'}
            </Tag>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <div className="user-info">
                <Avatar
                  size={38}
                  style={{
                    background: `linear-gradient(135deg, ${themeToken.colorPrimary}, #10b981)`,
                  }}
                  icon={<UserOutlined />}
                />
                <div className="user-info-text">
                  <Text strong>{username ?? 'Usuario'}</Text>
                  <Text type="secondary" className="user-info-role">
                    {role === 'ADMIN' ? 'Admin' : 'Staff'}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="main-content">
          <div className="main-content-inner">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
