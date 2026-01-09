export function isSubscription(product) {
  return String(product.service || "").toLowerCase().includes("subscription");
}

export function hasSubscription(cart) {
  return cart.some((item) => item.type === "subscription");
}

