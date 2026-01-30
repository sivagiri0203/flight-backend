// Razorpay uses smallest currency unit (paise). Your DB uses major unit (INR).
export function toPaise(inr) {
  return Math.round(Number(inr) * 100);
}
export function fromPaise(paise) {
  return Number(paise) / 100;
}
