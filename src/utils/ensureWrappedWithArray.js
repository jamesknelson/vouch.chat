export default function ensureWrappedWithArray(x) {
  return Array.isArray(x) ? x : [x]
}
