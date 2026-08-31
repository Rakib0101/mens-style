export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-US")}`;
}

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBanglaDigits(input: number | string): string {
  return String(input).replace(/[0-9]/g, (d) => BANGLA_DIGITS[Number(d)]);
}
