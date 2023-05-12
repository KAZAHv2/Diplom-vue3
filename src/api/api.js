import axios from 'axios'

const api = axios.create({
    baseURL: 'https://eduprog.grassbusinesslabs.tk/api/v1/',
  },
)

api.interceptors.request.use((config) => {
  config.baseURL = 'https://eduprog.grassbusinesslabs.tk/api/v1/'
  if (localStorage.getItem('token')) {
    config.headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  }
  return config
})


const getData = async (url) => {
  try {
    const response = await api.get(url)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}
const postData = async (url, payload) => {
  try {
    const response = await api.post(url, { ...payload })
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}
const deleteData = async (url) => {
  try {
    const response = await api.delete(url)
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}
const editData = async (url, payload) => {
  try {
    const response = await api.put(url, { ...payload })
    return response.data
  } catch (e) {
    return Promise.reject(e)
  }
}

export { getData, postData, deleteData, editData, api }
