import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
})

function parseApiError(error) {
  if (error.response?.data?.detail) {
    return error.response.data.detail
  }
  if (error.message) {
    return error.message
  }
  return 'Unexpected API error.'
}

export async function createDraftPost(payload) {
  try {
    const response = await api.post('/posts/', payload)
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}

export async function submitPostForReview(postId) {
  try {
    const response = await api.post(`/posts/${postId}/submit/`)
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}

export async function listPosts(status = 'all') {
  try {
    const params = status === 'all' ? undefined : { status }
    const response = await api.get('/posts/', { params })
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}

export async function publishPost(postId) {
  try {
    const response = await api.patch(`/posts/${postId}/publish/`)
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}

export async function getPost(postId) {
  try {
    const response = await api.get(`/posts/${postId}`)
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}

export async function fetchStats() {
  try {
    const response = await api.get('/posts/stats')
    return response.data
  } catch (error) {
    throw new Error(parseApiError(error))
  }
}
