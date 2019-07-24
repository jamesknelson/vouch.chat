import React, { useContext } from 'react'

export const BackendContext = React.createContext(undefined)
export function useBackend() {
  return useContext(BackendContext)
}

export const CurrentUserContext = React.createContext(undefined)
export function useCurrentUser() {
  return useContext(CurrentUserContext)
}

export const CurrentLanguageContext = React.createContext('en')
export function useCurrentLanguage() {
  return useContext(CurrentLanguageContext)
}

// Mutatively store data that can be used later on when creating accounts
// and subscriptions, e.g. email, referrer, coupon, etc.
export const MutableStoreContext = React.createContext({})
export function useMutableStore() {
  return useContext(MutableStoreContext)
}

export const StripeContext = React.createContext(null)
export function useStripe() {
  return useContext(StripeContext)
}
