export function fmt(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(a: number, b: number): string {
  const diff = ((a - b) / b) * 100;
  return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
}
