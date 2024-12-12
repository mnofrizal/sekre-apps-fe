import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="mb-6 text-4xl font-bold">Welcome to General Affairs</h1>
      <p className="mb-8 max-w-md text-center text-xl">
        Manage your organization's resources efficiently with our comprehensive dashboard.
      </p>
      <Link href="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </div>
  )
}

