import { route } from 'navi'
import React, { useState } from 'react'
import FileUploader from 'react-firebase-file-uploader'
import { css } from 'styled-components/macro'

import { UserAvatar } from 'components/avatar'
import { FormSubmitButton } from 'components/button'
import { FormInputField, FormTextareaField } from 'components/field'
import FlexBox from 'components/flexBox'
import { Form, FormMessage } from 'components/form'
import { LayoutHeaderSection } from 'components/layout'
import { MenuItem } from 'components/menu'
import { PopupTrigger, PopupProvider, PopupMenu } from 'components/popup'
import {
  Gap,
  Gutter,
  Section,
  SectionFooter,
  SectionFooterMessage,
} from 'components/sections'
import { useBackend, useCurrentUser } from 'context'
import useOperation from 'hooks/useOperation'
import updateProfile from 'operations/updateProfile'
import { dimensions, media } from 'theme'
import useControlId from 'hooks/useControlId'

function Profile() {
  let updateOperation = useOperation(updateProfile)
  let backend = useBackend()
  let user = useCurrentUser()
  let fileUploaderId = useControlId()
  let [uploadingAvatar, setUploadingAvatar] = useState(false)

  let storageRef = backend.storage.ref('avatars').child(user.uid)
  let memberRef = backend.db.collection('members').doc(user.uid)

  let handleRemovePhoto = async () => {
    setUploadingAvatar(true)
    try {
      let photoURL = user.photoURL
      if (photoURL) {
        let [pathname] = photoURL.split('?')
        let [filename] = pathname.split('/').reverse()
        let [extension] = filename.split('.').reverse()
        await memberRef.update({ photoURL: null })
        await storageRef.child('user.' + extension).delete()
      }
    } finally {
      setUploadingAvatar(false)
    }
  }

  let handleUploadPhoto = async file => {
    try {
      let url = await storageRef.child(file).getDownloadURL()
      await memberRef.update({ photoURL: url })
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <>
      <LayoutHeaderSection />
      <Gap />
      <FileUploader
        hidden
        id={fileUploaderId}
        name="avatar"
        filename="user"
        accept="image/*"
        storageRef={storageRef}
        maxWidth={1024}
        maxHeight={1024}
        onUploadStart={() => {
          setUploadingAvatar(true)
        }}
        onUploadError={() => {
          setUploadingAvatar(false)
        }}
        onUploadSuccess={handleUploadPhoto}
      />
      <Section>
        <Form
          onSubmit={updateOperation.invoke}
          validate={updateOperation.validate}>
          <Gap size={1} />
          <FlexBox
            alignItems={{
              default: 'flex-start',
              phoneOnly: 'center',
            }}
            flexDirection={{
              default: 'row-reverse',
              phoneOnly: 'column',
            }}
            justifyContent={{
              default: 'flex-end',
              phoneOnly: 'flex-start',
            }}>
            <PopupProvider triggerOnFocus triggerOnSelect>
              <PopupTrigger>
                {ref => (
                  <UserAvatar
                    busy={uploadingAvatar}
                    css={css`
                      margin-left: 1rem;
                      margin-top: 1.5rem;
                      margin-bottom: 1.5rem;
                    `}
                    ref={ref}
                    size={8}
                    tabIndex={0}
                    user={user}
                  />
                )}
              </PopupTrigger>
              <PopupMenu placement="bottom">
                <MenuItem as="label" htmlFor={fileUploaderId}>
                  Upload a photo
                </MenuItem>
                {user && user.hasOwnPhotoURL && (
                  <MenuItem onClick={handleRemovePhoto}>Remove photo</MenuItem>
                )}
              </PopupMenu>
            </PopupProvider>
            <Gutter
              css={css`
                max-width: ${dimensions.defaultMaxFieldWidth};
                width: 100%;
                ${media.tabletPlus`
                  width: calc(100% - 10rem);
                `}
              `}>
              <FormInputField
                label="Name"
                initialValue={user.displayName}
                name="displayName"
                hint="Your publically displayed name"
              />
              <FormTextareaField
                label="Bio"
                initialValue={user.bio}
                name="bio"
                hint="A little bit about you"
              />
              <FormInputField
                label="Location"
                initialValue={user.location}
                name="location"
              />
              <FormInputField
                label="Email"
                initialValue={user.publicEmail}
                name="publicEmail"
                type="email"
              />
              <FormInputField
                label="Website"
                initialValue={user.website}
                name="website"
              />
            </Gutter>
          </FlexBox>
          <SectionFooter>
            <Gutter vertical={1}>
              <FormSubmitButton inline>Save</FormSubmitButton>
              <FormMessage dirty except={['displayName', 'bio']}>
                {({ message, variant }) => (
                  <SectionFooterMessage variant={variant}>
                    {message}
                  </SectionFooterMessage>
                )}
              </FormMessage>
            </Gutter>
          </SectionFooter>
        </Form>
      </Section>
      <Gap size="50vh" />
    </>
  )
}

export default route({
  title: 'Your Profile',
  view: <Profile />,
})
