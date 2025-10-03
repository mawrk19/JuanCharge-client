const cache = new Map()

function set(key, value) {
  localStorage.setItem(`cache:${key}`, JSON.stringify(value))
  cache.set(key, value)
}

function get(key, defaultValue = null) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  if (localStorage.getItem(`cache:${key}`)) {
    try {
      let value = JSON.parse(localStorage.getItem(`cache:${key}`))
      cache.set(key, value)
      return value
    } catch (e) {
      localStorage.removeItem(`cache:${key}`)
    }
  }

  return defaultValue
}

function remove(key) {
  localStorage.removeItem(`cache:${key}`)
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