import React from 'react'
import logoImage from 'media/logo.svg'
import vouchImage from 'media/vouch.svg'

export const LogoImage = ({ size, ...rest }) => (
  <img
    {...rest}
    src={logoImage}
    alt="Vouch logo"
    style={size && { width: size, height: size }}
  />
)

export const BrandImage = ({ size, ...rest }) => (
  <img
    {...rest}
    src={vouchImage}
    alt="Vouch brand"
    style={size && { width: size, height: size }}
  />
)
