import React from "react";
import list from "../data";

export default function Subscriptions({ onAdd }) {
  return (
    <section className="page">
      <h2>Subscriptions and Accessories</h2>

      <p className="note">
        You can only add one subscription at a time. Accessories can be added multiple times.
      </p>

      <div className="subs-grid">
        {list.map((item) => (
          <div className="subs-card" key={item.id}>
            <img className="subs-img" src={item.img} alt={item.service} />

            <div className="subs-body">
              <h3 className="subs-title">{item.service}</h3>
              <p className="subs-info">{item.serviceInfo}</p>

              <div className="subs-row">
                <span className="subs-price">
                  ${Number(item.price).toFixed(2)}
                </span>

                <button
                  className="subs-btn"
                  onClick={() => onAdd(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

