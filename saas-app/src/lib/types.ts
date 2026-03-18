export type Plan = 'FREE' | 'PRO' | 'ENTERPRISE'
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED'

export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  ownerId: string
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: Plan
  status: SubscriptionStatus
  createdAt: Date
}

export interface ApiResponse<T> {
  data: T
  error?: string
}
