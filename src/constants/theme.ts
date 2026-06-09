import type { ThemeConfig } from 'antd'

/** Verde como acento; fondos y superficies neutros */
export const veterinaryTheme: ThemeConfig = {
  token: {
    colorPrimary: '#059669',
    colorInfo: '#0d9488',
    colorSuccess: '#059669',
    colorWarning: '#d97706',
    colorError: '#dc2626',
    colorBgLayout: '#f8fafc',
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#e2e8f0',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    borderRadius: 12,
    borderRadiusLG: 16,
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    fontSize: 14,
    controlHeight: 40,
    boxShadow:
      '0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)',
    boxShadowSecondary:
      '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
  },
  components: {
    Layout: {
      siderBg: 'transparent',
      headerBg: '#ffffff',
      bodyBg: '#f8fafc',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: 'rgba(16, 185, 129, 0.22)',
      darkItemSelectedColor: '#ecfdf5',
      darkItemHoverBg: 'rgba(255, 255, 255, 0.1)',
      itemBorderRadius: 10,
      itemHeight: 44,
      iconSize: 18,
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      rowHoverBg: '#f1f5f9',
    },
    Button: {
      primaryShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
      fontWeight: 600,
    },
    Input: {
      activeBorderColor: '#059669',
      hoverBorderColor: '#94a3b8',
    },
    Select: {
      optionSelectedBg: '#ecfdf5',
    },
    Tabs: {
      inkBarColor: '#059669',
      itemSelectedColor: '#059669',
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Tag: {
      borderRadiusSM: 6,
    },
  },
}
