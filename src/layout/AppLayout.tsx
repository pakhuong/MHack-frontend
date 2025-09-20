import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const { Header, Sider, Content, Footer } = Layout;

const routesMeta: Record<string, string> = {
  '': 'Home',
  logs: 'Logs',
  health: 'Health',
  about: 'About',
};

function useBreadcrumbItems(pathname: string) {
  // Normalize leading/trailing slashes and split
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/');
  const crumbs = [] as { path: string; label: string }[];

  let accPath = '';
  for (const seg of segments) {
    accPath += `/${seg}`;
    const key = seg || '';
    const label = routesMeta[key] ?? seg;
    crumbs.push({ path: accPath || '/', label: label || 'Home' });
  }

  if (crumbs.length === 0) {
    crumbs.push({ path: '/', label: 'Home' });
  }
  return crumbs;
}

export default function AppLayout() {
  const location = useLocation();

  const selectedKey = useMemo(() => {
    const p = location.pathname.split('/')[1]; // first segment
    return `/${p || ''}`;
  }, [location.pathname]);

  const breadcrumbItems = useBreadcrumbItems(location.pathname);
  const breadcrumbData = useMemo(
    () =>
      breadcrumbItems.map((c, idx) => {
        const isLast = idx === breadcrumbItems.length - 1;
        return {
          title: isLast ? c.label : <Link to={c.path}>{c.label}</Link>,
        };
      }),
    [breadcrumbItems]
  );

  const menuItems = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/logs', label: <Link to="/logs">Logs</Link> },
    { key: '/health', label: <Link to="/health">Health</Link> },
    { key: '/about', label: <Link to="/about">About</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" width={220}>
        <div
          style={{
            height: 56,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Observability
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 56,
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Monitoring Console
          </Typography.Title>
          <div style={{ color: '#6b7280', fontSize: 12 }}>
            {new Date().toLocaleString()}
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ marginBottom: 16 }} items={breadcrumbData} />
          <div
            style={{
              background: '#fff',
              padding: 16,
              minHeight: 'calc(100vh - 56px - 32px - 56px)',
              overflow: 'auto',
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Observability UI © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
