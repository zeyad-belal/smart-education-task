import { useMemo, useState, useEffect } from "react";
import { Row, Col, Pagination, Space, Radio, Input, Empty, Button } from "antd";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import ListView from "../components/ListView.jsx";

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10);

  const [pageSize, setPageSize] = useState(48);
  const [view, setView] = useState("grid"); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState("");


  const { page, state, goto, next, prev, canNext, canPrev } = useProducts(
    initialPage,
    pageSize
  );

  // keep URL in sync when 'page' changes
  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);
    if (urlPage !== page) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set("page", String(page));
      setSearchParams(nextParams, { replace: true });
    }
  }, [page, searchParams, setSearchParams]);

  // if the user changes the URL via back/forward, sync it back to the hook
  useEffect(() => {
    const urlPage = Number.parseInt(searchParams.get("page") || "1", 10);
    if (urlPage !== page) {
      goto(urlPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); 

  const total = state.data?.pagination?.end;

  // filter only CURRENT PAGE
  const filtered = useMemo(() => {
    const items = state.data?.items ?? [];
    const term = searchQuery.trim().toLowerCase();
    if (!term) return items;
    return items.filter((p) => p.name.toLowerCase().includes(term));
  }, [state.data?.items, searchQuery]);

  const showEmpty = state.status === "success" && filtered.length === 0;

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* =============SEARCH&TOGGLE-VIEW================ */}
      <Space wrap>
        <Radio.Group
          value={view}
          onChange={(e) => setView(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="grid">Grid</Radio.Button>
          <Radio.Button value="list">List</Radio.Button>
        </Radio.Group>

        <Input.Search
          allowClear
          placeholder="Search products (current page)…"
          onSearch={setSearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 280 }}
        />
      </Space>

      {state.status === "loading" && !state.data ? <div>Loading…</div> : null}
      {state.status === "error" ? <div>Failed to load.</div> : null}
      {showEmpty ? <Empty description="No products found on this page" /> : null}

      {/* =============CARD-VIEW================ */}
      {filtered.length > 0 && view === "grid" ? (
        <Row gutter={[16, 16]}>
          {filtered.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8} lg={6} xl={6} xxl={6}>
              <ProductCard product={p} />
            </Col>
          ))}
        </Row>
      ) : null}

      {/* =============LIST-VIEW================ */}
      {filtered.length > 0 && view === "list" ? (
        <ListView filtered={filtered} />
      ) : null}

      {/* =============PAGINATION================ */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          showSizeChanger
          pageSizeOptions={["24", "36", "48", "72", "96"]}
          onChange={(p, ps) => {
            // update page size and move to the chosen page
            setPageSize(ps);
            goto(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onShowSizeChange={(p, ps) => {
            setPageSize(ps);
            goto(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={state.status === "loading" && !state.data}
        />
      </div>

      <Space>
        <button onClick={prev} disabled={!canPrev}>
          Prev
        </button>
        <button onClick={next} disabled={!canNext}>
          Next
        </button>
      </Space>
    </Space>
  );
}