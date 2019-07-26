import countries from 'country-region-data/data.json'
import React, { useCallback } from 'react'
import { CardElement, Elements, injectStripe } from 'react-stripe-elements'
import styled, { css } from 'styled-components/macro'

import {
  Control,
  ControlGroup,
  ControlGroupRow,
  FormInputControl,
  FormSelectControl,
} from 'components/control'
import { StyledLabel } from 'components/field'
import { Form, FormMessage } from 'components/form'
import { colors } from 'theme'

const StyledStripeCardControl = styled(Control)`
  .StripeElement {
    padding: 0.5rem;
    width: 100%;
  }
`

const Issue = styled.p`
  color: ${colors.text.warning};
`

const CardFormWithStripe = ({
  children,
  stripe,
  validate,
  onSubmit,
  ...props
}) => {
  let validateWithStripe = useCallback(
    params => validate && validate({ ...params, stripe }),
    [stripe, validate],
  )

  let onSubmitWithStripe = useCallback(
    params => onSubmit && onSubmit({ ...params, stripe }),
    [stripe, onSubmit],
  )

  let addressFields = [
    'name',
    'address_line1',
    'address_city',
    'address_zip',
    'address_country',
  ]

  return (
    <Form
      {...props}
      validate={validateWithStripe}
      onSubmit={onSubmitWithStripe}>
      <StyledLabel>Billing Address</StyledLabel>
      <ControlGroup>
        <FormInputControl label="Name" name="name" />
        <FormInputControl label="Street" name="address_line1" />
        <ControlGroupRow flex={['65%', '35%']}>
          <FormInputControl label="City" name="address_city" />
          <FormInputControl label="Postcode" name="address_zip" />
        </ControlGroupRow>
        <FormSelectControl
          name="address_country"
          label="Country"
          emptyLabel="Country">
          {countries.map(item => (
            <option value={item.countryShortCode} key={item.countryShortCode}>
              {item.countryName}
            </option>
          ))}
        </FormSelectControl>
      </ControlGroup>
      <FormMessage only={addressFields}>
        {({ issue }) => issue && <Issue>{issue}</Issue>}
      </FormMessage>

      <StyledLabel
        css={css`
          margin-top: 1rem;
        `}>
        Card
      </StyledLabel>
      <ControlGroup>
        <StyledStripeCardControl>
          {({ id, style }) => (
            <CardElement
              id={id}
              hidePostalCode
              style={{
                base: {
                  ...style,
                  fontSize: '14px',
                },
              }}
            />
          )}
        </StyledStripeCardControl>
      </ControlGroup>
      <FormMessage except={addressFields}>
        {({ issue }) => issue && <Issue>{issue}</Issue>}
      </FormMessage>

      {children}
    </Form>
  )
}

const CardFormWrapper = injectStripe(CardFormWithStripe)

export const CardForm = props => {
  return (
    <Elements>
      <CardFormWrapper {...props} />
    </Elements>
  )
}

export default CardForm
