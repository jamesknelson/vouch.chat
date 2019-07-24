import { lazy, map, redirect, route } from 'navi'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components/macro'

import Button, { ButtonLink } from 'components/button'
import Icon from 'components/icon'
import { Gap } from 'components/sections'
import { useCurrentUser } from 'context'
import useOperation from 'hooks/useOperation'
import updateUsername from 'operations/updateUsername'
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
  let [usernameInput, setUsernameInput] = useState('')

  // Use `undefined` to indicate that we don't know if there are any
  // validation issues, and `null` to indicate that everything's okay. But
  // we'll keep it `null` for empty inputs, as that doesn't need a message.
  let [validationIssue, setValidationIssue] = useState(null)

  let user = useCurrentUser()
  let updateUsernameOperation = useOperation(updateUsername)
  let hasSubmitted =
    !!updateUsernameOperation.lastError || updateUsernameOperation.busy
  let submitIssue =
    updateUsernameOperation.lastError &&
    Object.values(updateUsernameOperation.lastError)[0][0]

  let issue = validationIssue || submitIssue

  // Run a validation on each new username input.
  useEffect(() => {
    let isMounted = true

    updateUsernameOperation.clearSettled()

    if (usernameInput) {
      setValidationIssue(undefined)

      updateUsernameOperation
        .validate({ username: usernameInput })
        .then(issues => {
          if (isMounted) {
            setValidationIssue((issues && Object.values(issues)[0][0]) || null)
          }
        })
    } else {
      // We don't need to show any validation issues
      setValidationIssue(null)
    }

    return () => {
      isMounted = false
    }
    // We actually only want to update the issue when the user makes a change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameInput])

  let handleSubmit = event => {
    event.preventDefault()
    updateUsernameOperation.invoke({ username: usernameInput })
  }

  let handleChange = event => {
    setUsernameInput(event.target.value)
  }

  let handleClickAddNumber = () => {
    let number = Math.round(Math.min(Math.random() * 10, 9))
    setUsernameInput(usernameInput + number)
  }

  let message = "Don't panic. You can change this later."
  if (hasSubmitted) {
    if (issue === 'username-taken') {
      message = 'That username is already taken, sorry.'
    } else if (issue === 'required') {
      message =
        "So you'll actually need a username. It'll appear next to your name when you cast."
    } else if (issue === 'invalid') {
      message =
        'Your username can only contain letters, numbers, and an underscore (_).'
    } else if (issue === 'premium') {
      message =
        "That's a great username. But usernames for free and little wigs must contain a number."
    } else if (submitIssue) {
      message = submitIssue
    }
  }

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
      <form onSubmit={handleSubmit}>
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
                onChange={handleChange}
                value={usernameInput}
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
              {usernameInput &&
                (issue === 'premium' ||
                  issue === 'username-taken' ||
                  (!issue && validationIssue === null)) && (
                  <Icon
                    color={colors.ink.black}
                    glyph={
                      validationIssue === 'premium' || !validationIssue
                        ? 'check'
                        : 'cross2'
                    }
                    size="1rem"
                  />
                )}
              {usernameInput && !issue && validationIssue === undefined && (
                <Spinner
                  size="1rem"
                  color={colors.ink.light}
                  backgroundColor={colors.control.bg.default}
                />
              )}
            </div>
          </label>
        </div>
        <Message>{message}</Message>
        <Gap size="2rem" />
        {hasSubmitted && issue === 'premium' && (
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
            <Button outline size="small" onClick={handleClickAddNumber}>
              Add a number
            </Button>
          </div>
        )}
        <Button
          type="submit"
          busy={updateUsernameOperation.busy}
          disabled={
            (hasSubmitted && !!validationIssue) || updateUsernameOperation.busy
          }
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
