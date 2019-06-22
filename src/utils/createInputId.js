let nextLabelNumber = 1

function createInputId() {
  return 'input-' + nextLabelNumber++
}

export default createInputId
