import { FORM_ERROR } from 'final-form'
import ensureWrappedWithArray from './ensureWrappedWithArray'

export const BaseIssue = FORM_ERROR

export function normalizeIssues(...issues) {
  if (issues.length === 0) {
    return
  }

  let result = {}
  let hasErrors = false
  do {
    let issue = issues.shift()
    if (typeof issue === 'string' || Array.isArray(issue)) {
      issue = { [BaseIssue]: ensureWrappedWithArray(issue) }
    }
    if (issue) {
      for (let [key, value] of Object.entries(issue)) {
        if (value !== undefined) {
          hasErrors = true
          result[key] = ensureWrappedWithArray(value)
        }
      }
    }
  } while (issues.length)

  return hasErrors ? result : undefined
}

export default normalizeIssues
