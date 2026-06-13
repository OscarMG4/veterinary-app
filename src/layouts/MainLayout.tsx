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

  UnorderedListOutlined,

  FormOutlined,

} from '@ant-design/icons'

import { PawIcon } from '../components/icons/PawIcon'

import type { MenuProps } from 'antd'

import {

  INVENTORY_MENU_KEY,

  PURCHASES_MENU_KEY,

  ROUTES,

  SALES_MENU_KEY,

} from '../constants/routes'

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

  const { canManageUsers, canAccessDashboard, isStaff } = usePermissions()

  const { token: themeToken } = theme.useToken()



  const isInventoryRoute = location.pathname.startsWith(ROUTES.INVENTORY_MODULE)

  const isSalesRoute = location.pathname.startsWith(ROUTES.SALES_MODULE)

  const isPurchasesRoute = location.pathname.startsWith(ROUTES.PURCHASES_MODULE)



  useEffect(() => {

    const keys: string[] = []

    if (isInventoryRoute) keys.push(INVENTORY_MENU_KEY)

    if (isSalesRoute) keys.push(SALES_MENU_KEY)

    if (isPurchasesRoute) keys.push(PURCHASES_MENU_KEY)

    if (keys.length > 0) {

      setOpenKeys(keys)

    }

  }, [isInventoryRoute, isSalesRoute, isPurchasesRoute])



  const menuItems: MenuProps['items'] = useMemo(() => {

    if (isStaff) {
      return [
        {
          key: SALES_MENU_KEY,
          icon: <ShoppingCartOutlined />,
          label: 'Ventas',
          children: [
            {
              key: ROUTES.SALES_LIST,
              icon: <UnorderedListOutlined />,
              label: 'Listado de ventas',
            },
            {
              key: ROUTES.SALES_REGISTER,
              icon: <FormOutlined />,
              label: 'Registrar venta',
            },
          ],
        },
      ]
    }



    const items: MenuProps['items'] = []



    if (canAccessDashboard) {

      items.push({

        key: ROUTES.DASHBOARD,

        icon: <DashboardOutlined />,

        label: 'Dashboard',

      })

    }



    items.push(

      {

        key: SALES_MENU_KEY,

        icon: <ShoppingCartOutlined />,

        label: 'Ventas',

        children: [

          {

            key: ROUTES.SALES_LIST,

            icon: <UnorderedListOutlined />,

            label: 'Listado de ventas',

          },

          {

            key: ROUTES.SALES_REGISTER,

            icon: <FormOutlined />,

            label: 'Registrar venta',

          },

        ],

      },

      {

        key: PURCHASES_MENU_KEY,

        icon: <ShoppingOutlined />,

        label: 'Compras',

        children: [

          {

            key: ROUTES.PURCHASES_LIST,

            icon: <UnorderedListOutlined />,

            label: 'Listado de compras',

          },

          {

            key: ROUTES.PURCHASES_REGISTER,

            icon: <FormOutlined />,

            label: 'Registrar compra',

          },

        ],

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

    )



    if (canManageUsers) {

      items.push({

        key: ROUTES.USERS,

        icon: <UserOutlined />,

        label: 'Usuarios',

      })

    }



    return items

  }, [canManageUsers, canAccessDashboard, isStaff])



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

