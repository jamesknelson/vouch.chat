function plan(stripePlan) {
  return {
    id: stripePlan.id,
    active: stripePlan.active,
    amount: stripePlan.amount,
    currency: stripePlan.currency,
    interval: stripePlan.interval,
    intervalCount: stripePlan.interval_count,
    ...stripePlan.metadata,
  }
}

function card(stripeCard) {
  return {
    brand: stripeCard.brand,
    last4: stripeCard.last4,
    expMonth: stripeCard.exp_month,
    expYear: stripeCard.exp_year,
  }
}

function subscription(stripeSubscription) {
  return {
    stripeId: stripeSubscription.id,
    status: stripeSubscription.status,
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
    currentPeriodEnd: stripeSubscription.current_period_end,
    plan: plan(stripeSubscription.plan),
  }
}

module.exports = {
  plan,
  card,
  subscription,
}
