import { Table, Button, Space, Typography, InputNumber, Empty } from "antd";
import { useCart } from "../context/useCart.jsx";
import ImageWithSkeleton from "../components/ImageWithSkeleton.jsx";
const { Title } = Typography;

export default function CartPage() {
  const { state, setQty, remove, clear, total } = useCart();
  const items = Object.values(state.items);

  const dataSource = items.map(({ product, qty }) => ({
    key: product.id,
    name: product.name,
    price: product.price,
    qty,
    subtotal: qty * product.price,
    product,
  }));

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ImageWithSkeleton
            src={record.product.thumbnail}
            alt={record.product.name}
            style={{ width: "100px", height: 60 }}
          />
          <span>{record.product.name}</span>
        </div>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (v) => `$${v.toFixed(2)}`,
      width: 120,
    },
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      width: 140,
      render: (qty, record) => (
        <InputNumber
          min={0}
          value={qty}
          onChange={(val) => setQty(record.product.id, Number(val ?? 0))}
        />
      ),
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (v) => `$${v.toFixed(2)}`,
      width: 140,
    },
    {
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => remove(record.product.id)}>
          Remove
        </Button>
      ),
      width: 120,
    },
  ];

  if (items.length === 0) {
    return <Empty description="Your cart is empty" />;
  }

  return (
    <div>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          Shopping Cart
        </Title>
        <Button onClick={clear}>Clear Cart</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="key"
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 16,
          fontSize: 18,
        }}
      >
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  );
}
