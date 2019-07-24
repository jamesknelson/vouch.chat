import { lazy, map, redirect, route } from 'navi'
import React from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { ButtonLink } from 'components/button'
import Icon from 'components/icon'
import { Gap } from 'components/sections'
import { useCurrentUser } from 'context'
import useUsernameForm from 'hooks/useUsernameForm'
import { colors } from 'theme'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'
import { Spinner } from 'components/loading'

const InnerClamp = styled.div`
  margin: 1rem auto;
  width: calc(100% - 2rem);
  padding-bottom: 3rem;
  max-width: calc(320px);
  position: relative;
`

const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 4rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6rem;
  margin: 1.5rem 0 2rem;
  text-align: center;
`

const Message = styled.p`
  color: ${colors.text.secondary};
  font-size: 0.9rem;
  margin-top: 1rem;
  text-align: center;
`

function UsernamePicker(props) {
  let user = useCurrentUser()
  let usernameForm = useUsernameForm()

  return (
    <InnerClamp>
      <Title>
        {user && user.hasActiveSubscription ? (
          <>
            We <Icon glyph="heart" size="2rem" /> You
          </>
        ) : (
          "You're on Vouch!"
        )}
      </Title>
      <Description>
        Thanks for joining us! By the way, I didn't catch your username...
      </Description>
      <form onSubmit={usernameForm.onSubmit}>
        <div
          css={css`
            background-color: ${colors.ink.black};
            color: ${colors.ink.light};
            padding: 1rem 1rem 1rem;
            border-radius: 0.5rem;
            text-align: center;
          `}>
          <h2
            css={css`
              font-size: 2rem;
              letter-spacing: 3px;
              text-transform: uppercase;
              margin-bottom: 1rem;
            `}>
            Hello
          </h2>
          <label
            css={css`
              background-color: ${colors.control.bg.default};
              border-radius: 0.25rem;
              display: block;
              padding: 0 0.5rem 0.5rem;
            `}>
            <p
              css={css`
                color: ${colors.ink.black};
                font-weight: 600;
                margin: 0.25rem 0 0.5rem;
              `}>
              my username is
            </p>

            <div
              css={css`
                width: 100%;
                align-items: center;
                display: flex;
                padding: 0.5rem 0.5rem 1rem;
              `}>
              <span
                css={css`
                  color: ${colors.text.default};
                  font-size: 1.25rem;
                  line-height: 2rem;
                `}>
                @
              </span>
              <input
                onChange={usernameForm.onChange}
                value={usernameForm.value}
                maxLength="15"
                css={css`
                  color: ${colors.text.default};
                  background-color: transparent;
                  border-width: 0;
                  font-weight: 600;
                  font-size: 1.25rem;
                  line-height: 2rem;
                  flex-grow: 1;
                  width: 0;
                `}
              />
              {usernameForm.validationState &&
                usernameForm.validationState !== 'busy' && (
                  <Icon
                    color={colors.ink.black}
                    glyph={
                      usernameForm.validationState === 'valid'
                        ? 'check'
                        : 'cross2'
                    }
                    size="1rem"
                  />
                )}
              {usernameForm.validationState === 'busy' && (
                <Spinner
                  size="1rem"
                  color={colors.ink.light}
                  backgroundColor={colors.control.bg.default}
                />
              )}
            </div>
          </label>
        </div>
        <Message>{usernameForm.message}</Message>
        <Gap size="2rem" />
        {usernameForm.hasSubmitted && usernameForm.issue === 'premium' && (
          <div
            css={css`
              margin-top: -1rem;
              margin-bottom: 1.5rem;
              display: flex;
              justify-content: space-around;
            `}>
            <ButtonLink href="/wigs" size="small">
              Get a wig
            </ButtonLink>
            <Button
              outline
              size="small"
              onClick={usernameForm.onClickAddNumber}>
              Add a number
            </Button>
          </div>
        )}
        <Button
          type="submit"
          busy={usernameForm.isSubmitting}
          disabled={!usernameForm.canSubmit}
          outline
          css={css`
            margin: 0 auto;
          `}>
          Come on in
        </Button>
      </form>
    </InnerClamp>
  )
}

export default wrapRouteWithSetupLayout(
  2,
  map(async ({ context }) => {
    let { currentUser } = context

    if (currentUser === undefined) {
      return lazy(() => import('../loading'))
    } else if (!currentUser) {
      return redirect('/login')
    } else if (currentUser.username) {
      return redirect('/setup/profile')
    }

    return route({
      title: 'Pick your username.',
      view: <UsernamePicker />,
    })
  }),
)
