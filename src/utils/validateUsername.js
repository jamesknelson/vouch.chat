export default function validateUsername(user, username) {
  if (!username) {
    return 'required'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'invalid'
  } else if (username.length > 15) {
    return 'long'
  }

  // This should be the last test as we don't want to recommend that people
  // upgrade their plan if the username won't work.
  else if (
    (!user.stripeSubscription ||
      !user.stripeSubscription.plan.metadata.premiumUsername) &&
    !/\d/.test(username)
  ) {
    return 'premium'
  }
}
