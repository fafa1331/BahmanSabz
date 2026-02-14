"use client"

/**
 * /dashboard route - redirects to main dashboard at /
 * The actual dashboard UI is at the root page.
 */

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/")
  }, [router])

  return null
}
