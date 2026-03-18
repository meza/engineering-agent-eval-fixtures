import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <h1>Taskflow</h1>
      <p>Project management for small teams. Organize work, track progress, collaborate.</p>
      <nav>
        <Link href="/dashboard">Go to Dashboard</Link>
      </nav>
    </main>
  )
}
