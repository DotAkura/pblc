"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/auth"

interface BalanceDisplayProps {
  className?: string
}

export function BalanceDisplay({ className }: BalanceDisplayProps) {
  const [balance, setBalance] = useState("0.00000000")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Update balance on component mount
    const user = auth.getCurrentUser()
    if (user) {
      setBalance(user.balance.toFixed(8))
    }

    // Set up an interval to check for balance updates
    const intervalId = setInterval(() => {
      const updatedUser = auth.getCurrentUser()
      if (updatedUser) {
        setBalance(updatedUser.balance.toFixed(8))
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  // Don't render anything until client-side to avoid hydration issues
  if (!mounted) {
    return <span className={className}>0.00000000 BTC</span>
  }

  return <span className={className}>{balance} BTC</span>
}

