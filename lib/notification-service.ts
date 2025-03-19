import type { PendingDeposit, PendingWithdrawal } from "./models"

// This would be replaced with a real-time service like WebSockets in production
class NotificationService {
  private listeners: ((type: "deposit" | "withdrawal", data: any) => void)[] = []

  // Add a listener for new notifications
  public subscribe(callback: (type: "deposit" | "withdrawal", data: any) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  // Notify all listeners of a new deposit
  public notifyNewDeposit(deposit: PendingDeposit) {
    this.listeners.forEach((listener) => listener("deposit", deposit))
  }

  // Notify all listeners of a new withdrawal
  public notifyNewWithdrawal(withdrawal: PendingWithdrawal) {
    this.listeners.forEach((listener) => listener("withdrawal", withdrawal))
  }
}

// Singleton instance
export const notificationService = new NotificationService()

