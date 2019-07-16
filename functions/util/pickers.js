function plan(plan) {
  return {
    id: plan.id,
    active: plan.active,
    amount: plan.amount,
    currency: plan.currency,
    interval: plan.interval,
    interval_count: plan.interval_count,
    metadata: plan.metadata,
  }
}

function card(card) {
  return {
    brand: card.brand,
    last4: card.last4,
    exp_month: card.exp_month,
    exp_year: card.exp_year,
  }
}

function subscription(subscription) {
  return {
    id: subscription.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: subscription.current_period_end,
    plan: plan(subscription.plan),
  }
}

module.exports = {
  plan,
  card,
  subscription,
}
