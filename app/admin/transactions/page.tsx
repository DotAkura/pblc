"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Settings, Search, Wallet, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"

// Mock transaction data
type Transaction = {
  id: string
  userId: string
  username: string
  type: "deposit" | "withdrawal" | "win" | "loss" | "admin_add" | "admin_remove"
  amount: number
  timestamp: string
  status: "completed" | "pending" | "failed"
}

export default function AdminTransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = auth.isAuthenticated()
    const isAdmin = auth.isAdmin()

    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/admin/transactions")
      return
    }

    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    // Load mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "tx-123",
        userId: "user-123",
        username: "admin",
        type: "deposit",
        amount: 0.05,
        timestamp: "2025-03-17T10:30:00",
        status: "completed",
      },
      {
        id: "tx-456",
        userId: "user-456",
        username: "player1",
        type: "win",
        amount: 0.01,
        timestamp: "2025-03-16T14:20:00",
        status: "completed",
      },
      {
        id: "tx-789",
        userId: "user-456",
        username: "player1",
        type: "loss",
        amount: 0.005,
        timestamp: "2025-03-16T15:10:00",
        status: "completed",
      },
      {
        id: "tx-101",
        userId: "user-789",
        username: "player2",
        type: "withdrawal",
        amount: 0.02,
        timestamp: "2025-03-15T09:45:00",
        status: "completed",
      },
      {
        id: "tx-102",
        userId: "user-456",
        username: "player1",
        type: "admin_add",
        amount: 0.01,
        timestamp: "2025-03-14T11:30:00",
        status: "completed",
      },
      {
        id: "tx-103",
        userId: "user-123",
        username: "admin",
        type: "admin_add",
        amount: 0.02,
        timestamp: new Date().toISOString(),
        status: "completed",
      },
      {
        id: "tx-104",
        userId: "user-456",
        username: "player1",
        type: "admin_remove",
        amount: 0.005,
        timestamp: new Date().toISOString(),
        status: "completed",
      },
    ]

    // Get current user from auth
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      // Update admin transactions with current user info
      const updatedTransactions = mockTransactions.map((tx) => {
        if (tx.username === "admin") {
          return {
            ...tx,
            userId: currentUser.id,
            username: currentUser.username,
          }
        }
        return tx
      })
      setTransactions(updatedTransactions)
    } else {
      setTransactions(mockTransactions)
    }
  }, [router])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Get transaction type display
  const getTransactionTypeDisplay = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return "Deposit"
      case "withdrawal":
        return "Withdrawal"
      case "win":
        return "Game Win"
      case "loss":
        return "Game Loss"
      case "admin_add":
        return "Admin Added"
      case "admin_remove":
        return "Admin Removed"
      default:
        return type
    }
  }

  // Get transaction icon
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "win":
      case "admin_add":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "withdrawal":
      case "loss":
      case "admin_remove":
        return <ArrowDownRight className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <AuthCheck requireAuth requireAdmin>
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-muted/40 z-30">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Settings className="h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/transactions"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <Wallet className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-1 md:ml-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Transactions</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Exit Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-40 md:hidden">
              <div className="grid grid-cols-4 gap-1 p-1">
                <Link href="/admin" className="flex flex-col items-center justify-center py-2 text-muted-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs mt-1">Dashboard</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs mt-1">Users</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex flex-col items-center justify-center py-2 text-primary"
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs mt-1">Transactions</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs mt-1">Settings</span>
                </Link>
              </div>
            </div>
          </header>
          <main className="grid gap-6 p-6 md:gap-8 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-lg font-semibold md:text-2xl">Transaction History</h1>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full sm:w-[300px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader className="px-6">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>View all user transactions and balance changes.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount (BTC)</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">{tx.id}</TableCell>
                          <TableCell>{tx.username}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {getTransactionIcon(tx.type)}
                              <span>{getTransactionTypeDisplay(tx.type)}</span>
                            </div>
                          </TableCell>
                          <TableCell
                            className={`${
                              tx.type === "deposit" || tx.type === "win" || tx.type === "admin_add"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.type === "deposit" || tx.type === "win" || tx.type === "admin_add" ? "+" : "-"}
                            {tx.amount.toFixed(8)}
                          </TableCell>
                          <TableCell>{formatDate(tx.timestamp)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                tx.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}

