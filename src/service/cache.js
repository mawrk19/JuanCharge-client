const cache = new Map()

function set(key, value) {
  sessionStorage.setItem(`cache:${key}`, JSON.stringify(value))
  cache.set(key, value)
}

function get(key, defaultValue = null) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  if (sessionStorage.getItem(`cache:${key}`)) {
    try {
      let value = JSON.parse(sessionStorage.getItem(`cache:${key}`))
      cache.set(key, value)
      return value
    } catch (e) {
      sessionStorage.removeItem(`cache:${key}`)
    }
  }

  return defaultValue
}

function remove(key) {
  sessionStorage.removeItem(`cache:${key}`)
  cache.delete(key)
}

function has(key) {
  return get(key) !== null
}

export const Cache = {
  set,
  get,
  has,
  remove,
}

window.cache = Cache