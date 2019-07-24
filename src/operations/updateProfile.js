import { useBackend } from 'context'
import { normalizeIssues } from 'utils/Issues'

const MaxBioLength = 160
const MaxEmailLength = 40
const MaxDisplayNameLength = 30
const MaxLocationLength = 40
const MaxWebsiteLength = 60

function validateBio(bio) {
  if (bio && bio.length > MaxBioLength) {
    return 'tooLong'
  }
}

function validateDisplayName(displayName) {
  if (!displayName) {
    return 'required'
  } else if (/\svouch(chat|\.chat)?\s/i.test(displayName)) {
    return 'invalid'
  } else if (displayName.length > MaxDisplayNameLength) {
    return 'tooLong'
  }
}

function validateEmail(email) {
  if (email && email.length > MaxEmailLength) {
    return 'tooLong'
  }
  if (email && !/.+@.+\..+/.test(email)) {
    return 'invalid'
  }
}

function validateLocation(location) {
  if (location && location.length > MaxLocationLength) {
    return 'tooLong'
  }
}

function validateWebsite(website) {
  if (website && website.length > MaxWebsiteLength) {
    return 'tooLong'
  }
}

const bioErrorMessages = {
  tooLong: `Your bio must be at most ${MaxBioLength} characters`,
}

const displayNameErrorMessages = {
  required: 'You need to enter something here',
  invalid: 'Your display name cannot include the word "vouch"',
  tooLong: `This must be at most ${MaxDisplayNameLength} characters`,
}

const emailErrorMessages = {
  invalid: "That doesn't look like an email",
  tooLong: `Profile emails must be under ${MaxEmailLength} characters`,
}

const locationErrorMessages = {
  tooLong: `Must be under ${MaxLocationLength} characters`,
}

const websiteErrorMessages = {
  tooLong: `Must be under ${MaxWebsiteLength} characters`,
}

updateProfile.useDependencies = function useDependencies() {
  return useBackend()
}

updateProfile.validate = function validate({
  bio,
  displayName,
  location,
  publicEmail,
  website,
}) {
  return normalizeIssues({
    bio: bioErrorMessages[validateBio(bio)],
    displayName: displayNameErrorMessages[validateDisplayName(displayName)],
    location: locationErrorMessages[validateLocation(location)],
    publicEmail: emailErrorMessages[validateEmail(publicEmail)],
    website: websiteErrorMessages[validateWebsite(website)],
  })
}

export default async function updateProfile(
  {
    bio = null,
    displayName,
    location = null,
    publicEmail = null,
    website = null,
  },
  backend,
) {
  let memberRef = backend.db
    .collection('members')
    .doc(backend.auth.currentUser.uid)
  await memberRef.update({ bio, displayName, location, publicEmail, website })
}
