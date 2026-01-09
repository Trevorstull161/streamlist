import React, { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import About from "./components/About";
import Subscriptions from "./components/Subscriptions";

import { loadCart, saveCart } from "./utils/cartStorage";
import { isSubscription, hasSubscription } from "./utils/cartRules";

import "./App.css";

function App() {
  const [cart, setCart] = useState(() => loadCart());
  const [warning, setWarning] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [cart]);

  function showWarning(msg) {
    setWarning(msg);
    window.clearTimeout(window.__warnTimer);
    window.__warnTimer = window.setTimeout(() => setWarning(""), 2500);
  }

  function showToast(msg) {
    setToast(msg);
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => setToast(""), 2000);
  }

  function addToCart(product) {
    setCart((prev) => {
      const subscription = isSubscription(product);

      if (subscription && hasSubscription(prev)) {
        showWarning("Only one subscription can be added at a time.");
        return prev;
      }

      const existing = prev.find((i) => i.id === product.id);

      if (subscription) {
        if (existing) {
          showWarning("That subscription is already in your cart.");
          return prev;
        }

        showToast(`${product.service} added to cart.`);

        return [
          ...prev,
          {
            id: product.id,
            service: product.service,
            serviceInfo: product.serviceInfo,
            price: Number(product.price),
            img: product.img,
            qty: 1,
            type: "subscription",
          },
        ];
      }

      if (existing) {
        showToast(`${product.service} quantity increased.`);
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      showToast(`${product.service} added to cart.`);

      return [
        ...prev,
        {
          id: product.id,
          service: product.service,
          serviceInfo: product.serviceInfo,
          price: Number(product.price),
          img: product.img,
          qty: 1,
          type: "accessory",
        },
      ];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) showToast(`${item.service} removed.`);
      return prev.filter((i) => i.id !== id);
    });
  }

  function updateQty(id, nextQty) {
    const qtyNum = Number(nextQty);
    if (!Number.isFinite(qtyNum)) return;

    setCart((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;

        if (i.type === "subscription") return { ...i, qty: 1 };

        return { ...i, qty: Math.max(1, Math.min(99, qtyNum)) };
      })
    );
  }

  function clearCart() {
    setCart([]);
    showToast("Cart cleared.");
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>EZTechMovie StreamList</h1>
        <p>Create and manage your personal streaming list</p>
      </header>

      {warning ? <div className="warning">{warning}</div> : null}
      {toast ? <div className="toast">{toast}</div> : null}

      <nav className="app-nav">
        <ul>
          <li>
            <Link to="/">StreamList</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/subscriptions">Subscriptions</Link>
          </li>
          <li>
            <Link to="/cart">Cart ({cartCount})</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<Movies />} />
          <Route
            path="/subscriptions"
            element={<Subscriptions onAdd={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                onRemove={removeFromCart}
                onQtyChange={updateQty}
                onClear={clearCart}
              />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>EZTechMovie StreamList Prototype</small>
      </footer>
    </div>
  );
}

export default App;

