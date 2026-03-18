import { NextResponse } from 'next/server'
import type { User } from '@/lib/types'

const stubUser: User = {
  id: 'stub-user-id',
  email: 'dev@example.com',
  name: 'Dev User',
  createdAt: new Date('2024-01-01'),
}

export async function GET() {
  return NextResponse.json({ data: stubUser })
}
