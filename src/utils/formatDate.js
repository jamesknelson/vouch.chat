export default function formatDate(date, language) {
  return new Date(date * 1000).toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
