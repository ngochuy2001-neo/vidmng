import axios from 'axios'

const API_BASE_URL = 'http://192.168.10.83/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Video {
  id: number
  title: string
  slug: string
  description: string
  video_file: string
  thumbnail: string | null
  category_name: string
  tag_names: string[]
  status: 'draft' | 'published' | 'archived'
  is_favorite: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  created_at: string
  video_count: number
  videos?: Video[]
}

export interface Tag {
  id: number
  name: string
  slug: string
  video_count: number
  videos?: Video[]
}

export interface VideoUpdateData {
  title?: string
  description?: string
  category?: number | null
  tag_ids?: number[]
  status?: 'draft' | 'published' | 'archived'
  is_favorite?: boolean
}

// Video API
export const videoAPI = {
  // Lấy danh sách video
  getVideos: async (params?: {
    search?: string
    category?: number
    category__slug?: string
    status?: string
    tags?: string
    ordering?: string
  }) => {
    const response = await api.get('/videos/', { params })
    return response.data
  },

  // Lấy chi tiết video
  getVideo: async (id: number) => {
    const response = await api.get(`/videos/${id}/`)
    return response.data
  },

  // Tạo video mới
  createVideo: async (data: FormData, onProgress?: (progress: number) => void) => {
    const response = await api.post('/videos/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  },

  // Cập nhật video
  updateVideo: async (id: number, data: VideoUpdateData) => {
    const response = await api.patch(`/videos/${id}/`, data)
    return response.data
  },

  // Xóa video
  deleteVideo: async (id: number) => {
    const response = await api.delete(`/videos/${id}/`)
    return response.data
  },

  // Toggle favorite
  toggleFavorite: async (id: number) => {
    const response = await api.patch(`/videos/${id}/toggle_favorite/`)
    return response.data
  },

  // Lấy video yêu thích
  getFavorites: async () => {
    const response = await api.get('/videos/favorites/')
    return response.data
  },

  // Lấy video phổ biến
  getPopular: async () => {
    const response = await api.get('/videos/popular/')
    return response.data
  },

  // Lấy video mới nhất
  getRecent: async () => {
    const response = await api.get('/videos/recent/')
    return response.data
  },

  // Thống kê
  getStats: async () => {
    const response = await api.get('/videos/stats/')
    return response.data
  },

  // Cập nhật trạng thái hàng loạt
  bulkUpdateStatus: async (videoIds: number[], status: string) => {
    const response = await api.post('/videos/bulk_update_status/', {
      video_ids: videoIds,
      status,
    })
    return response.data
  },

  // Xóa hàng loạt
  bulkDelete: async (videoIds: number[]) => {
    const response = await api.delete('/videos/bulk_delete/', {
      data: { video_ids: videoIds },
    })
    return response.data
  },
}

// Category API
export const categoryAPI = {
  // Lấy danh sách categories
  getCategories: async () => {
    const response = await api.get('/categories/')
    return response.data
  },

  // Lấy chi tiết category
  getCategory: async (id: number) => {
    const response = await api.get(`/categories/${id}/`)
    return response.data
  },

  // Lấy category theo slug
  getCategoryBySlug: async (slug: string, includeVideos: boolean = false) => {
    const response = await api.get('/categories/', {
      params: { 
        slug,
        include_videos: includeVideos
      }
    })
    return response.data[0] || null // Trả về category đầu tiên tìm thấy
  },
}

// Tag API
export const tagAPI = {
  // Lấy danh sách tags
  getTags: async (includeVideos: boolean = false) => {
    const response = await api.get('/tags/', {
      params: { include_videos: includeVideos }
    })
    return response.data
  },

  // Lấy tag theo slug
  getTagBySlug: async (slug: string, includeVideos: boolean = false) => {
    const response = await api.get('/tags/', {
      params: { 
        slug,
        include_videos: includeVideos
      }
    })
    // API trả về array, lấy item đầu tiên
    const data = response.data
    if (Array.isArray(data) && data.length > 0) {
      return data[0]
    }
    return null
  },

  // Lấy tags phổ biến
  getPopularTags: async () => {
    const response = await api.get('/tags/popular/')
    return response.data
  },
}

export default api 