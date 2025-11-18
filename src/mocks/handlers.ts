import { http, HttpResponse } from 'msw'

// Mock data types
export interface Item {
  id: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
}

export interface HealthCheck {
  status: string
  timestamp: string
  version: string
}

// Mock data storage
let items: Item[] = [
  {
    id: 1,
    name: '노트북',
    description: '고성능 노트북',
    price: 1500000,
    category: '전자제품',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: '마우스',
    description: '무선 마우스',
    price: 30000,
    category: '전자제품',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
  {
    id: 3,
    name: '키보드',
    description: '기계식 키보드',
    price: 150000,
    category: '전자제품',
    created_at: '2024-01-03T00:00:00Z',
    updated_at: '2024-01-03T00:00:00Z',
  },
]

let users: User[] = [
  {
    id: 1,
    email: 'user1@example.com',
    username: 'user1',
    full_name: '홍길동',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    email: 'user2@example.com',
    username: 'user2',
    full_name: '김철수',
    is_active: true,
    created_at: '2024-01-02T00:00:00Z',
  },
]

// Helper to generate IDs
let nextItemId = items.length + 1
let nextUserId = users.length + 1

// MSW Request Handlers (FastAPI-style)
export const handlers = [
  // Health Check
  http.get('/api/health', () => {
    return HttpResponse.json<HealthCheck>({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  }),

  // Items - List all items
  http.get('/api/items', ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const category = url.searchParams.get('category')

    let filteredItems = items
    if (category) {
      filteredItems = items.filter((item) => item.category === category)
    }

    const paginatedItems = filteredItems.slice(skip, skip + limit)

    return HttpResponse.json({
      items: paginatedItems,
      total: filteredItems.length,
      skip,
      limit,
    })
  }),

  // Items - Get single item
  http.get('/api/items/:id', ({ params }) => {
    const { id } = params
    const item = items.find((item) => item.id === Number(id))

    if (!item) {
      return HttpResponse.json(
        { detail: 'Item not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(item)
  }),

  // Items - Create new item
  http.post('/api/items', async ({ request }) => {
    const body = (await request.json()) as Omit<
      Item,
      'id' | 'created_at' | 'updated_at'
    >

    const newItem: Item = {
      id: nextItemId++,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    items.push(newItem)

    return HttpResponse.json(newItem, { status: 201 })
  }),

  // Items - Update item
  http.put('/api/items/:id', async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<Item>
    const itemIndex = items.findIndex((item) => item.id === Number(id))

    if (itemIndex === -1) {
      return HttpResponse.json(
        { detail: 'Item not found' },
        { status: 404 }
      )
    }

    items[itemIndex] = {
      ...items[itemIndex],
      ...body,
      id: items[itemIndex].id, // ID는 변경 불가
      created_at: items[itemIndex].created_at, // 생성일 유지
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json(items[itemIndex])
  }),

  // Items - Delete item
  http.delete('/api/items/:id', ({ params }) => {
    const { id } = params
    const itemIndex = items.findIndex((item) => item.id === Number(id))

    if (itemIndex === -1) {
      return HttpResponse.json(
        { detail: 'Item not found' },
        { status: 404 }
      )
    }

    items.splice(itemIndex, 1)

    return HttpResponse.json({ message: 'Item deleted successfully' })
  }),

  // Users - List all users
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') || '0')
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const paginatedUsers = users.slice(skip, skip + limit)

    return HttpResponse.json({
      users: paginatedUsers,
      total: users.length,
      skip,
      limit,
    })
  }),

  // Users - Get single user
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params
    const user = users.find((user) => user.id === Number(id))

    if (!user) {
      return HttpResponse.json(
        { detail: 'User not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json(user)
  }),

  // Users - Create new user
  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id' | 'created_at'>

    const newUser: User = {
      id: nextUserId++,
      ...body,
      created_at: new Date().toISOString(),
    }

    users.push(newUser)

    return HttpResponse.json(newUser, { status: 201 })
  }),

  // Auth - Login (FastAPI-style)
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      username: string
      password: string
    }

    // Mock authentication logic
    if (body.username === 'admin' && body.password === 'admin') {
      return HttpResponse.json({
        access_token: 'mock-jwt-token-12345',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          full_name: '관리자',
        },
      })
    }

    return HttpResponse.json(
      { detail: 'Incorrect username or password' },
      { status: 401 }
    )
  }),

  // Search endpoint (FastAPI-style)
  http.get('/api/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q') || ''

    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )

    return HttpResponse.json({
      query,
      results,
      total: results.length,
    })
  }),
]
