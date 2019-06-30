import localForage from 'localforage'
import 'localforage-observable'
import Observable from 'zen-observable'

export default class DeviceStorage {
  constructor(options) {
    this._store = localForage.createInstance({
      name: 'vouchchat-DeviceStorage',
      ...options,
    })
    this._store.newObservable.factory = subscribeFn => {
      return new Observable(subscribeFn)
    }
  }

  doc(id) {
    return new DeviceStorageDocumentReference(this._store, id)
  }
}

class DeviceStorageError extends Error {
  constructor(code, message) {
    const trueProto = new.target.prototype

    super(message)

    this.__proto__ = trueProto

    if (Error.hasOwnProperty('captureStackTrace'))
      Error.captureStackTrace(this, this.constructor)
    else
      Object.defineProperty(this, 'stack', {
        value: new Error().stack,
      })

    Object.defineProperty(this, 'message', {
      value: message,
    })
    Object.defineProperty(this, 'code', {
      value: code,
    })
  }
}

class DeviceStorageDocumentReference {
  constructor(_store, id) {
    this._promise = undefined
    this._store = _store
    this.id = id
  }

  async get() {
    let unsetPromise
    if (!this._promise) {
      this._promise = this._store.getItem(this.id)
      unsetPromise = this._promise
    }
    let promise = this._promise
    let data
    do {
      data = await promise
    } while (promise !== this._promise)

    if (unsetPromise === this._promise) {
      delete this._promise
    }

    // Note: due to a limitation in localStorage, `data` can never be
    // `undefined` -- it can only be `null`.
    return new DeviceStorageDocumentSnapshot(this.id, data !== null, this, data)
  }

  onSnapshot(observerOrOnNext, onError, onComplete) {
    let observable = this._store.newObservable({
      key: this.id,
    })

    let observer
    if (typeof observerOrOnNext === 'function') {
      observer = {
        next: observerOrOnNext,
        error: onError,
        complete: onComplete,
      }
    } else {
      observer = observerOrOnNext
    }

    let subscription = observable.subscribe(
      new DeviceStorageSnapshotObserver(this.id, this, observer),
    )

    return subscription.unsubscribe.bind(subscription)
  }

  async update(...dataOrKeyValuePairs) {
    await this._deferredUpdate(this._data(), async data => {
      if (data !== null) {
        throw new DeviceStorageError(
          'not-found',
          `update() was called on DeviceStorage document "${
            this.id
          }" that does not exist.`,
        )
      }
      if (typeof dataOrKeyValuePairs[0] === 'string') {
        let updates = {}
        let keys = []
        while (dataOrKeyValuePairs.length) {
          let key = dataOrKeyValuePairs.shift()
          updates[key] = dataOrKeyValuePairs.shift()
          keys.push(key)
        }
        return this._set(updates, data, keys)
      } else {
        let updates = dataOrKeyValuePairs[0]
        return this._set(updates, data, Object.keys(updates))
      }
    })
  }

  async set(
    data,
    {
      /**
       * Merge fields into existing data instead of replacing all fields.
       * Fields not specified in the `data` object remain untouched.
       */
      merge = false,

      /**
       * Merge only the specific fields from data.
       */
      mergeFields = undefined,
    } = {},
  ) {
    let previousDataPromise = merge || mergeFields ? this._data() : undefined
    await this._deferredUpdate(previousDataPromise, async previousData => {
      if (merge) {
        mergeFields = Object.keys(data)
      }
      return this._set(data, previousData, mergeFields)
    })
  }

  async delete() {
    return this._store.removeItem(this.id)
  }

  async _deferredUpdate(dataPromise, fn) {
    let promise
    this._promise = new Promise(async (resolve, reject) => {
      try {
        let data = await dataPromise
        let result = await fn(data)
        resolve(result)
      } catch (error) {
        reject(error)
      } finally {
        if (this._promise === promise) {
          delete this._promise
        }
      }
    })
    promise = this._promise
  }

  async _data() {
    return this._promise || this._store.getItem(this.id)
  }

  async _set(updates, previousValue, mergeFields) {
    let newValue = mergeFields ? previousValue || {} : updates
    if (mergeFields) {
      for (let field of mergeFields) {
        newValue[field] = updates[field]
      }
    }
    await this._store.setItem(this.id, newValue)
    return newValue
  }
}

class DeviceStorageSnapshotObserver {
  constructor(id, ref, observer) {
    this.id = id
    this.ref = ref
    this.observer = observer

    this.next = this.next.bind(this)
    this.error = this.error.bind(this)
    this.complete = this.complete.bind(this)
  }

  next({ newValue }) {
    if (this.observer.next) {
      this.observer.next(
        new DeviceStorageDocumentSnapshot(
          this.id,
          newValue !== null,
          this.ref,
          newValue,
        ),
      )
    }
  }

  error(error) {
    if (this.observer.error) {
      this.observer.error(error)
    }
  }

  complete() {
    if (this.observer.complete) {
      this.observer.complete()
    }
  }
}

class DeviceStorageDocumentSnapshot {
  constructor(id, exists, ref, data) {
    this.id = id
    this.exists = exists
    this.ref = ref

    this._data = data
  }

  data() {
    return this.exists ? this._data : undefined
  }
}
