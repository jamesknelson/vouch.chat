import React from 'react'
import styled from 'styled-components/macro'
import { space } from 'styled-system'

import { colors, media, radii, shadows } from 'theme'
import addDefaultRemUnits from 'utils/addDefaultRemUnits'

const SectionTitle = styled.h4`
  color: ${colors.text.subHeading};
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1.5rem;
  padding: 0 1rem;
  text-transform: uppercase;
`

const StyledSection = styled.section`
  ${space};
  position: relative;
`

const StyledSectionHeader = styled.header`
  position: sticky;
  top: 0;
  padding-top: 0.5rem;
  width: 100%;
  z-index: 8;

  ${media.tabletPlus`
    background-color: ${colors.structure.bg};
  `}
`

const StyledSectionBody = styled.div`
  ${space};
  background-color: ${colors.structure.bg};
  border-top: 1px solid ${colors.structure.border};
  position: relative;
  z-index: 0;

  /* A pixel of padding ensures background gets applied, even if the children
     have top margins. */
  padding-top: 1px;

  ${media.phoneOnly`
    /* On mobile, the white background feels a little too much so we'll
      represent the sections as cards with a slightly lighter shadow
      color than usual (so they feel closer to the surface) */
    box-shadow: ${shadows.card(colors.ink.mid)};
    border-bottom: 1px solid ${colors.structure.border};
  `}
`

/* Create a vertical shadow, without escaping the section boundaries horizontally. */
export const StyledSectionShadow = styled.div`
  position: absolute;
  top: ${props => (props.side === 'top' ? -1 : 0)}rem;
  bottom: ${props => (props.side === 'top' ? 0 : -1)}rem;
  width: 100%;
  overflow: hidden;
  z-index: -1;

  &::before {
    content: ' ';
    position: absolute;
    top: ${props => (props.side === 'top' ? 1 : -1)}rem;
    bottom: ${props => (props.side === 'top' ? -1 : 1)}rem;
    width: 100%;
    box-shadow: ${shadows.section()};
  }
`

StyledSectionShadow.defaultProps = {
  side: 'top',
}

export const Section = ({
  children,
  title,
  padding,
  paddingX,
  paddingY,
  paddingTop,
  paddingBottom,
  ...rest
}) => (
  <StyledSection {...rest}>
    <StyledSectionHeader>
      {title && <SectionTitle>{title}</SectionTitle>}
    </StyledSectionHeader>
    <StyledSectionBody
      {...{
        padding,
        paddingX,
        paddingY,
        paddingTop,
        paddingBottom,
      }}>
      {children}
      <StyledSectionShadow />
    </StyledSectionBody>
  </StyledSection>
)

export const Gutter = styled.div`
  padding: ${props =>
    `${addDefaultRemUnits(props.vertical || 0)} ${addDefaultRemUnits(
      props.horizontal || 1,
    )}`};
`

const StyledSectionFooter = styled(StyledSectionBody)`
  position: sticky;
  bottom: -1px;
  margin-bottom: -1rem;
  z-index: 8;
  border-top: 1px solid ${colors.structure.divider};
`

export const SectionFooter = ({ children, ...rest }) => (
  <StyledSectionFooter {...rest}>
    {children}
    <StyledSectionShadow />
  </StyledSectionFooter>
)

export const SectionFooterMessage = styled.span`
  color: ${props => colors.text[props.variant || 'tertiary']};
  font-size: 90%;
  margin-left: 1rem;
`
