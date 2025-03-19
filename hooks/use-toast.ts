"use client"

import { useState } from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
}

// This is a simple toast implementation
// In a real app, you would use a more robust toast library
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, type = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, type }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)

    // In a real app, this would show a toast notification
    // For now, we'll just log to console
    console.log(`Toast: ${title}${description ? ` - ${description}` : ""}`)

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toast, dismiss, toasts }
}

