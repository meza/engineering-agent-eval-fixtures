import { db } from '@/lib/db'
import type { Project } from '@/lib/types'

async function getProjects(): Promise<Project[]> {
  return db.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function DashboardPage() {
  const projects = await getProjects()

  return (
    <main>
      <h1>Dashboard</h1>
      <section>
        <h2>Your Projects</h2>
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                <span>{project.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
