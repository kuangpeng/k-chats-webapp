const storage = {
  set: (name, data) => {
    localStorage.setItem(name, JSON.stringify(data))
  },
  get: (name) => {
    let data = localStorage.getItem(name)
    return JSON.parse(data)
  }
}

export default storage
