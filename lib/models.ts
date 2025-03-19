export type TransactionStatus = "pending" | "approved" | "rejected"

export interface PendingDeposit {
  id: string
  userId: string
  username: string
  amount: number
  timestamp: Date
  transactionId: string
  status: TransactionStatus
}

export interface PendingWithdrawal {
  id: string
  userId: string
  username: string
  amount: number
  address: string
  timestamp: Date
  transactionId: string
  status: TransactionStatus
}

// Game settings interfaces
export interface MinesSettings {
  houseEdge: number
  mineCount: number
  gridSize: number
  maxMultiplier: number
  lossChance: number // Chance of forced loss
}

export interface DiceSettings {
  houseEdge: number
  winChance: number
  maxMultiplier: number
  lossChance: number // Chance of forced loss
}

export interface CrashSettings {
  houseEdge: number
  crashChance: number
  maxMultiplier: number
}

export interface GameSettings {
  minesSettings: MinesSettings
  diceSettings: DiceSettings
  crashSettings: CrashSettings
}

