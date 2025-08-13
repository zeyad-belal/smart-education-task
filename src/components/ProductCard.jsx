import { Card, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart.js";
import ImageWithSkeleton from "./ImageWithSkeleton.jsx";

const { Title, Text } = Typography;

export default function ProductCard({ product }) {
  const nav = useNavigate();
  const { add } = useCart();

  return (
    <Card
      hoverable
      cover={
        <ImageWithSkeleton
          src={product.thumbnail}
          alt={product.name}
          style={{ height: 160 }}
        />
      }
      onClick={() => nav(`/products/${product.id}`)}
    >
      <Title level={5} style={{ marginBottom: 4 }}>
        {product.name}
      </Title>
      <Text strong>${product.price.toFixed(2)}</Text>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            add(product, 1);
          }}
        >
          Add to Cart
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            nav(`/products/${product.id}`);
          }}
        >
          Details
        </Button>
      </div>
    </Card>
  );
}
