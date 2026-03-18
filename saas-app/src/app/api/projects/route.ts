import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function GET() {
  const projects = await db.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: projects })
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = createProjectSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const project = await db.project.create({
    data: {
      name: parsed.data.name,
      ownerId: 'stub-user-id',
    },
  })

  return NextResponse.json({ data: project }, { status: 201 })
}
