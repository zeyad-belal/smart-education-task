// pages/ProductDetailsPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Space, Card } from "antd";
import { useCart } from "../context/useCart.js";
import ImageWithSkeleton from "../components/ImageWithSkeleton.jsx";
import { useProduct } from "../hooks/useProdcut.js";

const { Title, Paragraph, Text } = Typography;

export default function ProductDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { add } = useCart();

  const { status, data: product } = useProduct(id);

  if (status === "loading") {
    return (
      <Card>
        <Title level={4}>Loading product…</Title>
        <Button onClick={() => nav(-1)}>← Back</Button>
      </Card>
    );
  }

  if (status === "error" || !product) {
    return (
      <Card>
        <Title level={4}>Product not found</Title>
        <Button onClick={() => nav("/products")}>Back to Products</Button>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Button onClick={() => nav(-1)}>← Back</Button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <ImageWithSkeleton
          src={product.image}
          alt={product.name}
          style={{ width: "100%", height: 400 }}
        />
        <div>
          <Title level={3}>{product.name}</Title>
          <Text strong style={{ fontSize: 20 }}>${product.price.toFixed(2)}</Text>
          <Paragraph style={{ marginTop: 16 }}>{product.description}</Paragraph>
          <Space>
            <Button type="primary" onClick={() => add(product, 1)}>
              Add to Cart
            </Button>
            <Button onClick={() => nav("/cart")}>Go to Cart</Button>
          </Space>
        </div>
      </div>
    </Space>
  );
}