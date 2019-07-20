import React from 'react'
import styled from 'styled-components/macro'

import { colors, dimensions, media, shadows } from 'theme'
import addDefaultRemUnits from 'utils/addDefaultRemUnits'

export const SectionSubHeading = styled.h4`
  color: ${colors.text.subHeading};
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.5rem;
  padding: 0 1rem;
  margin-top: 1rem;
  text-transform: uppercase;
`

const StyledSection = styled.section`
  background-color: ${colors.structure.bg};
  border-color: ${colors.structure.border};
  border-style: solid;
  border-width: 1px 0;
  position: relative;

  ${media.tabletPlus`
    border-bottom-width: 0;
  `}

  ${media.phoneOnly`
    /* On mobile, the white background feels a little too much so we'll
      represent the sections as cards with a slightly lighter color
      color than usual (so they feel closer to the surface) */
    box-shadow: ${shadows.card(colors.ink.mid)};
  `}
`

/* Create a vertical shadow, without escaping the section boundaries horizontally. */
const StyledSectionShadow = styled.div`
  position: absolute;
  top: 1rem;
  bottom: 1rem;
  width: 100%;
  overflow: hidden;
  z-index: -1;

  &::before {
    content: ' ';
    position: absolute;
    top: 1rem;
    bottom: 1rem;
    width: 100%;
    box-shadow: ${shadows.section()};
  }
`

export const Section = ({ children, ...rest }) => (
  <StyledSection {...rest}>
    {children}
    <StyledSectionShadow />
  </StyledSection>
)

export const Gap = styled.div`
  height: ${props => addDefaultRemUnits(props.size) || '1rem'};
  width: 100%;
`

export const Gutter = styled.div`
  padding: ${props =>
    `${addDefaultRemUnits(props.vertical || 0)} ${addDefaultRemUnits(
      props.horizontal || 1,
    )}`};
`

const StyledSectionHeader = styled(StyledSection)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${dimensions.bar};
  margin: 0;
  z-index: 9;
  border-top-width: 0;
  position: sticky;
  top: 0;
`

export const SectionHeader = ({ children, ...rest }) => {
  return (
    <StyledSectionHeader {...rest}>
      {children}
      <StyledSectionShadow />
    </StyledSectionHeader>
  )
}

const StyledSectionFooter = styled(StyledSection)`
  position: sticky;
  bottom: -1px;
  z-index: 8;
  border-top-color: ${colors.structure.divider};
  border-bottom-width: 0;
`

export const SectionFooter = ({ children, ...rest }) => (
  <>
    <StyledSectionFooter {...rest}>
      {children}
      <StyledSectionShadow />
    </StyledSectionFooter>
  </>
)

export const SectionFooterMessage = styled.span`
  color: ${props => colors.text[props.variant || 'tertiary']};
  font-size: 90%;
  margin-left: 1rem;
`
