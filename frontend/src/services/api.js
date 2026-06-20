import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getUsers = async () => {
  const { data } = await apiClient.get('/users')
  return data
}

export const getUserById = async (id) => {
  const { data } = await apiClient.get(`/users/${id}`)
  return data
}

export const updateUser = async (id, userPayload) => {
  const { data } = await apiClient.put(`/users/${id}`, userPayload)
  return data
}

export const addAddress = async (userId, addressPayload) => {
  const { data } = await apiClient.post(`/users/${userId}/addresses`, addressPayload)
  return data
}

export const updateAddress = async (userId, addressId, addressPayload) => {
  const { data } = await apiClient.put(`/users/${userId}/addresses/${addressId}`, addressPayload)
  return data
}

export const deleteAddress = async (userId, addressId) => {
  await apiClient.delete(`/users/${userId}/addresses/${addressId}`)
}

export default apiClient
