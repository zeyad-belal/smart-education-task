import { Space, Button } from "antd";
import { useCart } from "../context/useCart.js";
import { useNavigate } from "react-router-dom";

export default function ListView({ filtered }) {
  const { add } = useCart();
  const nav = useNavigate();

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {filtered.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            padding: 12,
            border: "1px solid #f0f0f0",
            borderRadius: 12,
          }}
        >
          <img
            src={p.thumbnail}
            alt={p.name}
            loading="lazy"
            width={140}
            height={100}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div>${p.price.toFixed(2)}</div>
          </div>
          <div style={{ width: 240 }}>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  add(p, 1);
                }}
              >
                Add to Cart
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  nav(`/products/${p.id}`);
                }}
              >
                Details
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Space>
  );
}
