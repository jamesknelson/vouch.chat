export default function validatePassword(password) {
  if (!password) {
    return 'required'
  } else if (password.length < 6) {
    return 'tooShort'
  }
}
