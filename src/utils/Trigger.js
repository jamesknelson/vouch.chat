// Give delay by default, so that there's time for something within
// the container to focus after the trigger has been blurred.
const DefaultDelayIn = 10
const DefaultDelayOut = 50

class Trigger {
  constructor({
    triggerOnFocus,
    triggerOnHover,
    triggerOnSelect = true,
    closeOnEscape = true,
    delayIn = DefaultDelayIn,
    delayOut = DefaultDelayOut,
  } = {}) {
    this.options = {
      focus: triggerOnFocus,
      hover: triggerOnHover,
      select: triggerOnSelect,
      closeOnEscape,
      delayIn,
      delayOut,
    }

    this._reducerState = {
      selected: false,
      triggerFocusCount: 0,
      containerFocusCount: 0,
      triggerHoverCount: 0,
      containerHoverCount: 0,
    }

    this._timeouts = {
      trigger: {},
      container: {},
    }
    this.clearTriggerTimeouts()
    this.clearContainerTimeouts()

    this._listeners = []
  }

  close = () => {
    this.clearTriggerTimeouts()
    this.clearContainerTimeouts()

    if (this.triggerNode && document.activeElement === this.triggerNode) {
      this.triggerNode.blur()
    }

    this.dispatch({ type: 'close' })
  }

  setTriggerNode = node => {
    if (node !== this.triggerNode) {
      this.teardownTrigger()
      this.triggerNode = node
      if (node) {
        this.setupTrigger()
      }
      this.dispatch({
        type: 'change_trigger',
        triggerHasFocus: node && document.activeElement === node,
      })
    } else if (!node) {
      this.teardownTrigger()
    }
  }

  setContainerNode = node => {
    if (node !== this.containerNode) {
      this.teardownContainer()
      this.containerNode = node
      this.dispatch({ type: 'change_container' })

      // Only set up events once the container becomes active
      if (node && this.getState().active) {
        this.setupContainer()
      }
    } else if (!node) {
      this.teardownContainer()
    }
  }

  dispose() {
    this.teardownContainer()
    this.teardownTrigger()
    this.clearContainerTimeouts()
    this.clearTriggerTimeouts()
  }

  subscribe(listener) {
    this._listeners.push(listener)
    return () => {
      let index = this._listeners.indexOf(listener)
      if (index !== -1) {
        this._listeners.splice(index, 1)
      }
    }
  }

  getState() {
    let state = this._reducerState
    let focusCount = state.triggerFocusCount + state.containerFocusCount
    let hoverCount = state.triggerHoverCount + state.containerHoverCount

    return {
      active:
        hoverCount > 0 ||
        (focusCount > 0 && this.options.focus) ||
        state.selected,
      focused: focusCount > 0,
      hovering: hoverCount > 0,
      selected: !!state.selected,
    }
  }

  // ---

  dispatch(action) {
    let oldState = this.getState()
    let newReducerState = reducer(this._reducerState, action)
    if (newReducerState !== this._reducerState) {
      this._reducerState = newReducerState
      let newState = this.getState()

      // Setup/teardown the container if it's just been added
      if (newState.active && !oldState.active) {
        this.setupContainer()
      } else if (!newState.active && oldState.active) {
        this.teardownContainer()
      }

      // Only notify changes that matter
      if (
        newState.active !== oldState.active ||
        newState.focused !== oldState.focused ||
        newState.hovering !== oldState.hovering ||
        newState.selected !== oldState.selected
      ) {
        this._listeners.forEach(listener => listener(newState))
      }
    }
  }

  setupTrigger() {
    let node = this.triggerNode

    // Make sure that there's a tabIndex so that
    // the trigger can receive focus.
    if (this.options.focus && !node.tabIndex && node.tabIndex !== 0) {
      node.tabIndex = 0
    }

    if (this.options.select) {
      node.addEventListener('click', this.handleTriggerTouch, false)
      node.addEventListener('touchstart', this.handleTriggerTouch, false)
      node.addEventListener('keydown', this.handleTriggerKeyDown, false)
    }

    if (this.options.focus) {
      node.addEventListener('focusin', this.handleTriggerFocusIn, false)
      node.addEventListener('focusout', this.handleTriggerFocusOut, false)
    }

    if (this.options.hover) {
      node.addEventListener('mouseenter', this.handleTriggerHoverIn, false)
      node.addEventListener('mouseleave', this.handleTriggerHoverOut, false)
    }
  }

  teardownTrigger() {
    let node = this.triggerNode
    if (node) {
      if (this.options.select) {
        node.removeEventListener('click', this.handleTriggerTouch, false)
        node.removeEventListener('touchstart', this.handleTriggerTouch, false)
        node.removeEventListener('keydown', this.handleTriggerKeyDown, false)
      }

      if (this.options.focus) {
        node.removeEventListener('focusin', this.handleTriggerFocusIn, false)
        node.removeEventListener('focusout', this.handleTriggerFocusOut, false)
      }

      if (this.options.hover) {
        node.removeEventListener('mouseenter', this.handleTriggerHoverIn, false)
        node.removeEventListener(
          'mouseleave',
          this.handleTriggerHoverOut,
          false,
        )
      }

      this.triggerNode = undefined
    }
  }

  setupContainer() {
    let node = this.containerNode
    if (node) {
      if (this.options.select) {
        window.addEventListener('focusin', this.handleWindowInteraction, false)
        window.addEventListener('keydown', this.handleWindowKeyDown, false)
        window.addEventListener('click', this.handleWindowInteraction, false)
        window.addEventListener(
          'touchstart',
          this.handleWindowInteraction,
          false,
        )
      }

      if (this.options.focus) {
        node.addEventListener('focusin', this.handleContainerFocusIn, false)
        node.addEventListener('focusout', this.handleContainerFocusOut, false)
      }

      if (this.options.hover) {
        node.addEventListener('mouseenter', this.handleContainerHoverIn, false)
        node.addEventListener('mouseleave', this.handleContainerHoverOut, false)
      }
    }
  }

  teardownContainer() {
    let node = this.containerNode
    if (node) {
      if (this.options.select) {
        window.removeEventListener(
          'focusin',
          this.handleWindowInteraction,
          false,
        )
        window.removeEventListener('keydown', this.handleWindowKeyDown, false)
        window.removeEventListener('click', this.handleWindowInteraction, false)
        window.removeEventListener(
          'touchstart',
          this.handleWindowInteraction,
          false,
        )
      }

      if (this.options.focus) {
        node.removeEventListener('focusin', this.handleContainerFocusIn, false)
        node.removeEventListener(
          'focusout',
          this.handleContainerFocusOut,
          false,
        )
      }

      if (this.options.hover) {
        node.removeEventListener(
          'mouseenter',
          this.handleContainerHoverIn,
          false,
        )
        node.removeEventListener(
          'mouseleave',
          this.handleContainerHoverOut,
          false,
        )
      }

      this.containerNode = undefined
    }
  }

  handleTriggerTouch = () => {
    this.dispatch({
      type: 'select',
    })
  }

  handleTriggerKeyDown = e => {
    let form = getForm(e.target)
    if (e.key === ' ' || e.key === 'Spacebar' || (!form && e.key === 'Enter')) {
      this.dispatch({
        type: 'select',
      })
    }
  }

  handleIn(property, trigger) {
    let timeouts = this._timeouts[property][trigger]
    let afterDelay = () => {
      timeouts.in = undefined
      if (timeouts.out !== undefined) {
        clearTimeout(timeouts.out)
      }
      this.dispatch({
        type: `${trigger}_${property}`,
        direction: 'in',
      })
    }

    // We never want to delay handling a movement of focus into the container
    // itself, as it could cause the trigger to close during the transition.
    if (this.options.delayIn === 0 || property === 'container') {
      afterDelay()
    } else {
      timeouts.in = setTimeout(afterDelay, this.options.delayIn)
    }
  }

  handleTriggerFocusIn = () => this.handleIn('trigger', 'focus')
  handleTriggerHoverIn = () => this.handleIn('trigger', 'hover')
  handleContainerFocusIn = () => this.handleIn('container', 'focus')
  handleContainerHoverIn = () => this.handleIn('container', 'hover')

  handleOut(property, trigger, relatedTarget) {
    let timeouts = this._timeouts[property][trigger]
    let afterDelay = () => {
      timeouts.out = undefined
      this.dispatch({
        type: `${trigger}_${property}`,
        direction: 'out',
      })
    }
    if (timeouts.in !== undefined) {
      // If focus is lost before the in timeout completes, then cancel
      // immediately.
      clearTimeout(timeouts.in)
    } else {
      timeouts.out = setTimeout(afterDelay, this.options.delayOut)
    }
  }

  handleTriggerFocusOut = () => this.handleOut('trigger', 'focus')
  handleTriggerHoverOut = () => this.handleOut('trigger', 'hover')
  handleContainerFocusOut = () => this.handleOut('container', 'focus')
  handleContainerHoverOut = () => this.handleOut('container', 'hover')

  handleWindowKeyDown = event => {
    if (event.key === 'Escape' && this.options.closeOnEscape) {
      this.dispatch({
        type: 'close',
      })
    }
  }
  handleWindowInteraction = event => {
    let node = event.target
    if (
      !(
        (this.containerNode && this.containerNode.contains(node)) ||
        (this.triggerNode && this.triggerNode.contains(node))
      )
    ) {
      this.dispatch({
        type: 'close',
      })
    }
  }

  clearTriggerTimeouts() {
    let { focus = {}, hover = {} } = this._timeouts.trigger
    this.clearTimeouts(focus, hover)
    this._timeouts.trigger = { focus: {}, hover: {} }
  }
  clearContainerTimeouts() {
    let { focus = {}, hover = {} } = this._timeouts.container
    this.clearTimeouts(focus, hover)
    this._timeouts.container = { focus: {}, hover: {} }
  }
  clearTimeouts(focus, hover) {
    if (focus.in !== undefined) {
      clearTimeout(focus.in)
    }
    if (focus.out !== undefined) {
      clearTimeout(focus.out)
    }
    if (hover.in !== undefined) {
      clearTimeout(hover.in)
    }
    if (hover.out !== undefined) {
      clearTimeout(hover.out)
    }
  }
}

function getForm(node) {
  while (node) {
    if (node.type === 'form') {
      return node
    }
    node = node.parentNode
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'change_trigger':
      return {
        triggerFocusCount: action.triggerHasFocus ? 1 : 0,
        selected: action.triggerHasFocus ? state.selected : false,
        triggerHoverCount: 0,
        containerFocusCount: 0,
        containerHoverCount: 0,
      }

    case 'change_container':
      return {
        ...state,
        containerFocusCount: 0,
        containerHoverCount: 0,
      }

    case 'select':
      return {
        ...state,
        selected: true,
      }

    case 'close':
      return {
        selected: false,
        triggerFocusCount: 0,
        triggerHoverCount: 0,
        containerFocusCount: 0,
        containerHoverCount: 0,
      }

    case 'focus_trigger':
      return {
        ...state,
        selected: !action.deselect && state.selected,
        triggerFocusCount: Math.max(
          0,
          state.triggerFocusCount + (action.direction === 'in' ? 1 : -1),
        ),
      }

    case 'focus_container':
      return {
        ...state,
        selected: !action.deselect && state.selected,
        containerFocusCount: Math.max(
          0,
          state.containerFocusCount + (action.direction === 'in' ? 1 : -1),
        ),
      }

    case 'hover_trigger':
      return {
        ...state,
        triggerHoverCount: Math.max(
          0,
          state.triggerHoverCount + (action.direction === 'in' ? 1 : -1),
        ),
      }

    case 'hover_container':
      return {
        ...state,
        containerHoverCount: Math.max(
          0,
          state.containerHoverCount + (action.direction === 'in' ? 1 : -1),
        ),
      }

    default:
      return state
  }
}

export default Trigger
