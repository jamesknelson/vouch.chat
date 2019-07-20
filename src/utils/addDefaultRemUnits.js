export default function addDefaultRemUnits(value) {
  return typeof value === 'number' ? value + 'rem' : value
}
