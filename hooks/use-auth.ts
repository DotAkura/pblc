"use client"

import { useState, useEffect } from "react"
import { auth } from "@/lib/auth"

export const useAuth = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Safe versions of auth functions that only run on client
  return {
    isAuthenticated: isClient ? auth.isAuthenticated() : false,
    getCurrentUser: isClient ? auth.getCurrentUser() : null,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    isAdmin: isClient ? auth.isAdmin() : false,
    updateBalance: auth.updateBalance,
    addToBalance: auth.addToBalance,
    subtractFromBalance: auth.subtractFromBalance,
    hasEnoughBalance: auth.hasEnoughBalance,
    balance: isClient && auth.getCurrentUser() ? auth.getCurrentUser()!.balance : 0,
  }
}

