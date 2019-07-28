import { FORM_ERROR } from 'final-form'
import ensureWrappedWithArray from './ensureWrappedWithArray'

export const BaseIssue = FORM_ERROR

export function getFirstIssue(issues) {
  let normalizedIssues = normalizeIssues(issues)
  return normalizedIssues ? Object.values(normalizedIssues)[0][0] : null
}

function mapNonStringsToError(value) {
  return typeof value === 'string' ? value : 'error'
}

export function normalizeIssues(...issues) {
  if (issues.length === 0) {
    return
  }

  let result = {}
  let hasErrors = false
  do {
    let issue = issues.shift()
    if (typeof issue === 'string' || Array.isArray(issue)) {
      issue = {
        [BaseIssue]: ensureWrappedWithArray(issue).map(mapNonStringsToError),
      }
    }
    if (issue) {
      for (let [key, value] of Object.entries(issue)) {
        if (value !== undefined && value !== null && value !== false) {
          hasErrors = true
          result[key] = ensureWrappedWithArray(value).map(mapNonStringsToError)
        }
      }
    }
  } while (issues.length)

  return hasErrors ? result : undefined
}

export default normalizeIssues
