"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Settings,
  Search,
  MoreHorizontal,
  Ban,
  UserCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  ShieldOff,
  AlertCircle,
} from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

// Mock user data
type User = {
  id: string
  username: string
  email: string
  balance: number
  isAdmin: boolean
  status: "active" | "banned"
  lastLogin: string
  registeredDate: string
}

// Mock transaction type
type TransactionType = "deposit" | "withdrawal" | "win" | "loss" | "admin_add" | "admin_remove"

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [balanceAmount, setBalanceAmount] = useState("0.01")
  const [balanceAction, setBalanceAction] = useState<"add" | "subtract">("add")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = auth.isAuthenticated()
    const isAdmin = auth.isAdmin()

    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/admin/users")
      return
    }

    if (!isAdmin) {
      router.push("/dashboard")
      return
    }

    // Load mock users
    const mockUsers: User[] = [
      {
        id: "user-123",
        username: "admin",
        email: "admin@example.com",
        balance: 0.05,
        isAdmin: true,
        status: "active",
        lastLogin: "2025-03-17T10:30:00",
        registeredDate: "2025-01-15T08:00:00",
      },
      {
        id: "user-456",
        username: "player1",
        email: "player1@example.com",
        balance: 0.02,
        isAdmin: false,
        status: "active",
        lastLogin: "2025-03-16T14:20:00",
        registeredDate: "2025-02-10T11:30:00",
      },
      {
        id: "user-789",
        username: "player2",
        email: "player2@example.com",
        balance: 0.0,
        isAdmin: false,
        status: "banned",
        lastLogin: "2025-03-10T09:15:00",
        registeredDate: "2025-02-05T16:45:00",
      },
    ]

    // Get current user from auth
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      // Replace the admin user with the current user
      const updatedUsers = mockUsers.map((user) => {
        if (user.email === "admin@example.com") {
          return {
            ...user,
            id: currentUser.id,
            username: currentUser.username,
            email: currentUser.email,
            balance: currentUser.balance,
          }
        }
        return user
      })
      setUsers(updatedUsers)
    } else {
      setUsers(mockUsers)
    }
  }, [router])

  // Function to add a transaction record
  const addTransaction = (userId: string, username: string, type: TransactionType, amount: number) => {
    // In a real app, this would add a transaction to the database
    console.log(`Transaction added: ${type} of ${amount} BTC for user ${username} (${userId})`)
  }

  // Handle balance update
  const handleBalanceUpdate = () => {
    if (!selectedUser) return
    setError("")
    setIsProcessing(true)

    try {
      const amount = Number.parseFloat(balanceAmount)
      if (isNaN(amount) || amount <= 0) {
        setError("Please enter a valid amount greater than 0")
        setIsProcessing(false)
        return
      }

      // Update the user's balance in the users array
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          let newBalance = user.balance

          if (balanceAction === "add") {
            newBalance = user.balance + amount
            // If this is the current user, update their balance in auth
            if (user.id === auth.getCurrentUser()?.id) {
              auth.addToBalance(amount)
            }
            // Add transaction record
            addTransaction(user.id, user.username, "admin_add", amount)
          } else {
            // Check if there's enough balance
            if (user.balance < amount) {
              throw new Error("Insufficient balance")
            }
            newBalance = user.balance - amount
            // If this is the current user, update their balance in auth
            if (user.id === auth.getCurrentUser()?.id) {
              auth.subtractFromBalance(amount)
            }
            // Add transaction record
            addTransaction(user.id, user.username, "admin_remove", amount)
          }

          return { ...user, balance: Number.parseFloat(newBalance.toFixed(8)) }
        }
        return user
      })

      setUsers(updatedUsers)

      // Show success toast
      toast({
        title: "Balance updated",
        description: `Successfully ${balanceAction === "add" ? "added" : "removed"} ${amount} BTC ${balanceAction === "add" ? "to" : "from"} ${selectedUser.username}'s account.`,
      })

      // Close dialog and reset form
      setIsDialogOpen(false)
      setBalanceAmount("0.01")
      setIsProcessing(false)
    } catch (err: any) {
      setError(err.message || "Failed to update balance")
      setIsProcessing(false)
    }
  }

  // Handle user status toggle
  const toggleUserStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "banned" : "active"

          // Show toast
          toast({
            title: `User ${newStatus === "active" ? "unbanned" : "banned"}`,
            description: `${user.username} has been ${newStatus === "active" ? "unbanned" : "banned"}.`,
          })

          return {
            ...user,
            status: newStatus,
          }
        }
        return user
      }),
    )
  }

  // Handle admin status toggle
  const toggleAdminStatus = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const newIsAdmin = !user.isAdmin

          // Show toast
          toast({
            title: `Admin status ${newIsAdmin ? "granted" : "revoked"}`,
            description: `${user.username} is ${newIsAdmin ? "now an admin" : "no longer an admin"}.`,
          })

          return { ...user, isAdmin: newIsAdmin }
        }
        return user
      }),
    )
  }

  // Open dialog for balance operations
  const openBalanceDialog = (user: User, action: "add" | "subtract") => {
    setSelectedUser(user)
    setBalanceAction(action)
    setBalanceAmount("0.01")
    setError("")
    setIsDialogOpen(true)
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
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/transactions"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
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
              <Users className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">User Management</span>
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
                <Link href="/admin/users" className="flex flex-col items-center justify-center py-2 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="text-xs mt-1">Users</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground"
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
              <h1 className="text-lg font-semibold md:text-2xl">User Management</h1>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full sm:w-[300px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Card>
              <CardHeader className="px-6">
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts, balances, and permissions.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance (BTC)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.balance.toFixed(8)}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                user.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {user.status === "active" ? "Active" : "Banned"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                User
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    openBalanceDialog(user, "add")
                                  }}
                                >
                                  <ArrowUpRight className="mr-2 h-4 w-4 text-green-600" />
                                  Add Balance
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    openBalanceDialog(user, "subtract")
                                  }}
                                >
                                  <ArrowDownRight className="mr-2 h-4 w-4 text-red-600" />
                                  Remove Balance
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                  {user.status === "active" ? (
                                    <>
                                      <Ban className="mr-2 h-4 w-4 text-red-600" />
                                      Ban User
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="mr-2 h-4 w-4 text-green-600" />
                                      Unban User
                                    </>
                                  )}
                                </DropdownMenuItem>

                                <DropdownMenuItem onClick={() => toggleAdminStatus(user.id)}>
                                  {user.isAdmin ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4 text-orange-600" />
                                      Remove Admin
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4 text-blue-600" />
                                      Make Admin
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

      {/* Balance Update Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{balanceAction === "add" ? "Add Balance" : "Remove Balance"}</DialogTitle>
            <DialogDescription>
              {balanceAction === "add"
                ? `Add funds to ${selectedUser?.username}'s account.`
                : `Remove funds from ${selectedUser?.username}'s account.`}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (BTC)</Label>
              <Input
                id="amount"
                type="number"
                step="0.00000001"
                min="0.00000001"
                max={balanceAction === "subtract" && selectedUser ? selectedUser.balance.toString() : undefined}
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
              />
              {balanceAction === "subtract" && selectedUser && (
                <div className="text-sm text-muted-foreground">Available: {selectedUser.balance.toFixed(8)} BTC</div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              onClick={handleBalanceUpdate}
              disabled={isProcessing}
              variant={balanceAction === "subtract" ? "destructive" : "default"}
            >
              {isProcessing ? "Processing..." : balanceAction === "add" ? "Add Balance" : "Remove Balance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthCheck>
  )
}

