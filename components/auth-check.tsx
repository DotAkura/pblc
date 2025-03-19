"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { auth } from "@/lib/auth"

interface AuthCheckProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthCheck({ children, requireAuth = false, requireAdmin = false }: AuthCheckProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark that we're now client-side
    setIsClient(true)

    // Check if user is authenticated
    const isAuthenticated = auth.isAuthenticated()
    const isAdmin = auth.isAdmin()

    // Redirect to login if authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    // Redirect to dashboard if admin access is required but user is not an admin
    if (requireAdmin && (!isAuthenticated || !isAdmin)) {
      router.push("/dashboard")
      return
    }
  }, [requireAuth, requireAdmin, router, pathname])

  // Don't render children until we're client-side to avoid hydration issues
  if (requireAuth && !isClient) {
    return null
  }

  return <>{children}</>
}

