import { Layout, Menu, Badge } from "antd";
import { ShoppingCartOutlined, AppstoreOutlined } from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

const { Header, Content, Footer } = Layout;

export default function RootLayout() {
  const { count } = useCart();
  const nav = useNavigate();
  const loc = useLocation();

  const selected = loc.pathname.startsWith("/cart") ? ["cart"] : ["products"];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div
          onClick={() => nav("/products")}
          style={{
            color: "white",
            fontWeight: 700,
            marginRight: 24,
            cursor: "pointer",
          }}
        >
          ShopLite
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selected}
          items={[
            {
              key: "products",
              icon: <AppstoreOutlined />,
              label: "Products",
              onClick: () => nav("/products"),
            },
            {
              key: "cart",
              icon: (
                <Badge count={count} size="small">
                  <ShoppingCartOutlined />
                </Badge>
              ),
              label: "Cart",
              onClick: () => nav("/cart"),
            },
          ]}
        />
      </Header>

      <Content style={{ padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Outlet />
        </div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Dev :  Zeyad Belal
      </Footer>
    </Layout>
  );
}
