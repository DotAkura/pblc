// This is a simple auth utility for client-side auth state management
// In a real app, you would use a more robust auth solution

type User = {
  id: string
  username: string
  email: string
  isAdmin: boolean
  balance: number
}

// Mock current user data
let currentUser: User | null = null

// Helper to check if we're in a browser environment
const isBrowser = () => typeof window !== "undefined"

export const auth = {
  isAuthenticated: (): boolean => {
    // Only check localStorage in browser environment
    if (isBrowser()) {
      return Boolean(localStorage.getItem("user"))
    }
    return false
  },

  getCurrentUser: (): User | null => {
    if (isBrowser()) {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          return JSON.parse(userData)
        } catch (e) {
          // Handle parsing error
          return null
        }
      }
    }
    return currentUser
  },

  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        // Mock user authentication
        if (email && password) {
          // For demo purposes, create an admin user for specific email
          const isAdmin = email === "admin@example.com"

          const user: User = {
            id: "user-123",
            username: email.split("@")[0],
            email,
            isAdmin,
            balance: 0, // Changed from 0.05 to 0
          }

          // Store in localStorage for persistence (only in browser)
          if (isBrowser()) {
            localStorage.setItem("user", JSON.stringify(user))
          }
          currentUser = user
          resolve(user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  },

  signup: (username: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (username && email && password) {
          // For demo purposes, create an admin user for specific email
          const isAdmin = email === "admin@example.com"

          const user: User = {
            id: "user-" + Math.random().toString(36).substr(2, 9),
            username,
            email,
            isAdmin,
            balance: 0, // Changed from 0.01 to 0
          }

          if (isBrowser()) {
            localStorage.setItem("user", JSON.stringify(user))
          }
          currentUser = user
          resolve(user)
        } else {
          reject(new Error("Invalid user data"))
        }
      }, 1000)
    })
  },

  logout: (): void => {
    if (isBrowser()) {
      localStorage.removeItem("user")
    }
    currentUser = null
  },

  isAdmin: (): boolean => {
    const user = auth.getCurrentUser()
    return user ? user.isAdmin : false
  },

  // Add balance management functions
  updateBalance: (newBalance: number): User | null => {
    const user = auth.getCurrentUser()
    if (user) {
      user.balance = newBalance
      if (isBrowser()) {
        localStorage.setItem("user", JSON.stringify(user))
      }
      currentUser = user
      return user
    }
    return null
  },

  addToBalance: (amount: number): User | null => {
    const user = auth.getCurrentUser()
    if (user) {
      user.balance += amount
      if (isBrowser()) {
        localStorage.setItem("user", JSON.stringify(user))
      }
      currentUser = user
      return user
    }
    return null
  },

  subtractFromBalance: (amount: number): User | null => {
    const user = auth.getCurrentUser()
    if (user && user.balance >= amount) {
      user.balance -= amount
      if (isBrowser()) {
        localStorage.setItem("user", JSON.stringify(user))
      }
      currentUser = user
      return user
    }
    return null
  },

  hasEnoughBalance: (amount: number): boolean => {
    const user = auth.getCurrentUser()
    return user ? user.balance >= amount : false
  },
}

