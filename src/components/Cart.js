import React from "react";

function formatMoney(n) {
  return `$${Number(n).toFixed(2)}`;
}

function Cart({ cart, onRemove, onQtyChange, onClear }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <section className="page">
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <img className="cart-img" src={item.img} alt={item.service} />

                <div className="cart-main">
                  <div className="cart-title">{item.service}</div>
                  <div className="cart-info">{item.serviceInfo}</div>
                  <div className="cart-type">
                    Type:{" "}
                    {item.type === "subscription" ? "Subscription" : "Accessory"}
                  </div>
                </div>

                <div className="cart-actions">
                  <div className="cart-price">{formatMoney(item.price)}</div>

                  <div className="cart-qty">
                    <label>Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={item.qty}
                      disabled={item.type === "subscription"}
                      onChange={(e) => onQtyChange(item.id, e.target.value)}
                    />
                  </div>

                  <button className="cart-btn" onClick={() => onRemove(item.id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>

            <button className="cart-btn danger" onClick={onClear}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;
