import React from 'react'
import styled from 'styled-components/macro'

import { tabletPlus } from 'components/media'
import { colors, dimensions, media, shadows } from 'theme'

const LayoutSectionHeading = styled.h4`
  color: ${colors.text.subHeading};
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.9rem 1rem 0.1rem;
  text-transform: uppercase;
`

const StyledLayoutSection = styled.div`
  background-color: ${colors.structure.bg};
  box-shadow: ${shadows.section()};
  border-color: ${colors.structure.divider};
  border-style: solid;
  border-width: 1px 0;

  ${media.phoneOnly`
    /* On mobile, the white background feels a little too much so we'll
      represent the sections as cards with a slightly lighter color
      color than usual (so they feel closer to the surface) */
    box-shadow: ${shadows.card(colors.ink.mid)};
    border-color: ${colors.structure.border};
  `}
`

export const LayoutSection = ({ title = null, ...rest }) => (
  <>
    <LayoutSectionHeading>{title}</LayoutSectionHeading>
    <StyledLayoutSection {...rest} />
  </>
)

export const LayoutHeaderSection = tabletPlus(styled(StyledLayoutSection)`
  position: sticky;
  top: 0;
  height: ${dimensions.bar};
  margin: 0;
  border-top-width: 0;
`)

export const LayoutFooterSection = styled(StyledLayoutSection)`
  position: sticky;
  bottom: 0;
  border-bottom-width: 0;
  margin: 0;
`
