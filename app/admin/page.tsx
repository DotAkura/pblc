"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Users,
  Wallet,
  Settings,
  DollarSign,
  ArrowUpDown,
  UserPlus,
  Bell,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle,
  XCircle,
  Clock,
  Bomb,
  Dice1Icon as Dice,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { PendingDeposit, PendingWithdrawal } from "@/lib/models"

// Mock data for pending deposits
const mockPendingDeposits: PendingDeposit[] = [
  {
    id: "dep-1",
    userId: "user-1",
    username: "player123",
    amount: 0.05,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    transactionId: "tx-abc123def456",
    status: "pending",
  },
  {
    id: "dep-2",
    userId: "user-2",
    username: "cryptogamer",
    amount: 0.01,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    transactionId: "tx-xyz789uvw456",
    status: "pending",
  },
]

// Mock data for pending withdrawals
const mockPendingWithdrawals: PendingWithdrawal[] = [
  {
    id: "with-1",
    userId: "user-3",
    username: "btcmaster",
    amount: 0.02,
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    transactionId: "tx-with123def456",
    status: "pending",
  },
]

// Game settings interface
interface GameSettings {
  minesSettings: {
    houseEdge: number
    mineCount: number
    gridSize: number
    maxMultiplier: number
    lossChance: number // Chance of losing on each mine
  }
  diceSettings: {
    houseEdge: number
    winChance: number
    maxMultiplier: number
    lossChance: number // Chance of losing on each roll
  }
  crashSettings: {
    houseEdge: number
    crashChance: number
    maxMultiplier: number
  }
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const [totalUsers, setTotalUsers] = useState(3)
  const [totalRevenue, setTotalRevenue] = useState(0.07)
  const [totalBets, setTotalBets] = useState(12)
  const [pendingDeposits, setPendingDeposits] = useState<PendingDeposit[]>(mockPendingDeposits)
  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>(mockPendingWithdrawals)
  const [hasNewNotifications, setHasNewNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSettings, setSavedSettings] = useState<GameSettings | null>(null)

  // Game settings state
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    minesSettings: {
      houseEdge: 1,
      mineCount: 5,
      gridSize: 25,
      maxMultiplier: 100,
      lossChance: 5, // 5% chance of forced loss
    },
    diceSettings: {
      houseEdge: 1,
      winChance: 49,
      maxMultiplier: 98,
      lossChance: 3, // 3% chance of forced loss
    },
    crashSettings: {
      houseEdge: 1,
      crashChance: 1,
      maxMultiplier: 100,
    },
  })

  // Simulate new notifications coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() > 0.7 // 30% chance

      if (shouldAddNotification) {
        const isDeposit = Math.random() > 0.5

        if (isDeposit) {
          const newDeposit: PendingDeposit = {
            id: `dep-${Date.now()}`,
            userId: `user-${Math.floor(Math.random() * 100)}`,
            username: `player${Math.floor(Math.random() * 1000)}`,
            amount: Number.parseFloat((Math.random() * 0.1).toFixed(8)),
            timestamp: new Date(),
            transactionId: `tx-${Math.random().toString(36).substring(2, 15)}`,
            status: "pending",
          }

          setPendingDeposits((prev) => [newDeposit, ...prev])
          setHasNewNotifications(true)

          toast({
            title: "New Deposit Request",
            description: `${newDeposit.username} has requested a deposit of ${newDeposit.amount.toFixed(8)} BTC`,
            variant: "default",
          })
        } else {
          const newWithdrawal: PendingWithdrawal = {
            id: `with-${Date.now()}`,
            userId: `user-${Math.floor(Math.random() * 100)}`,
            username: `player${Math.floor(Math.random() * 1000)}`,
            amount: Number.parseFloat((Math.random() * 0.1).toFixed(8)),
            address: `bc1q${Math.random().toString(36).substring(2, 15)}`,
            timestamp: new Date(),
            transactionId: `tx-${Math.random().toString(36).substring(2, 15)}`,
            status: "pending",
          }

          setPendingWithdrawals((prev) => [newWithdrawal, ...prev])
          setHasNewNotifications(true)

          toast({
            title: "New Withdrawal Request",
            description: `${newWithdrawal.username} has requested a withdrawal of ${newWithdrawal.amount.toFixed(8)} BTC`,
            variant: "default",
          })
        }
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [toast])

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = auth.isAuthenticated()
    const isAdmin = auth.isAdmin()

    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/admin")
      return
    }

    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [router])

  const handleApproveDeposit = (depositId: string) => {
    // In a real app, this would call an API to approve the deposit
    setPendingDeposits((prevDeposits) =>
      prevDeposits.map((deposit) => (deposit.id === depositId ? { ...deposit, status: "approved" as const } : deposit)),
    )

    toast({
      title: "Deposit Approved",
      description: "The deposit has been approved and the user's balance has been updated.",
      variant: "success",
    })
  }

  const handleRejectDeposit = (depositId: string) => {
    // In a real app, this would call an API to reject the deposit
    setPendingDeposits((prevDeposits) =>
      prevDeposits.map((deposit) => (deposit.id === depositId ? { ...deposit, status: "rejected" as const } : deposit)),
    )

    toast({
      title: "Deposit Rejected",
      description: "The deposit has been rejected.",
      variant: "destructive",
    })
  }

  const handleApproveWithdrawal = (withdrawalId: string) => {
    // In a real app, this would call an API to approve the withdrawal
    setPendingWithdrawals((prevWithdrawals) =>
      prevWithdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId ? { ...withdrawal, status: "approved" as const } : withdrawal,
      ),
    )

    toast({
      title: "Withdrawal Approved",
      description: "The withdrawal has been approved and will be processed.",
      variant: "success",
    })
  }

  const handleRejectWithdrawal = (withdrawalId: string) => {
    // In a real app, this would call an API to reject the withdrawal
    setPendingWithdrawals((prevWithdrawals) =>
      prevWithdrawals.map((withdrawal) =>
        withdrawal.id === withdrawalId ? { ...withdrawal, status: "rejected" as const } : withdrawal,
      ),
    )

    toast({
      title: "Withdrawal Rejected",
      description: "The withdrawal has been rejected and the user's balance has been restored.",
      variant: "destructive",
    })
  }

  const totalPending =
    pendingDeposits.filter((d) => d.status === "pending").length +
    pendingWithdrawals.filter((w) => w.status === "pending").length

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setHasNewNotifications(false)
    }
  }

  // Update game settings
  const updateMinesSetting = (key: keyof typeof gameSettings.minesSettings, value: number) => {
    setGameSettings((prev) => ({
      ...prev,
      minesSettings: {
        ...prev.minesSettings,
        [key]: value,
      },
    }))
  }

  const updateDiceSetting = (key: keyof typeof gameSettings.diceSettings, value: number) => {
    setGameSettings((prev) => ({
      ...prev,
      diceSettings: {
        ...prev.diceSettings,
        [key]: value,
      },
    }))
  }

  const updateCrashSetting = (key: keyof typeof gameSettings.crashSettings, value: number) => {
    setGameSettings((prev) => ({
      ...prev,
      crashSettings: {
        ...prev.crashSettings,
        [key]: value,
      },
    }))
  }

  // Calculate expected values
  const calculateMinesExpectedValue = () => {
    const { houseEdge, mineCount, gridSize, lossChance } = gameSettings.minesSettings
    const fairMultiplier = gridSize / (gridSize - mineCount)
    const actualMultiplier = fairMultiplier * (1 - houseEdge / 100)
    // Account for forced loss chance
    const effectiveWinChance = ((gridSize - mineCount) / gridSize) * (1 - lossChance / 100)
    return (actualMultiplier * effectiveWinChance - 1) * 100
  }

  const calculateDiceExpectedValue = () => {
    const { houseEdge, winChance, lossChance } = gameSettings.diceSettings
    const fairMultiplier = 100 / winChance
    const actualMultiplier = fairMultiplier * (1 - houseEdge / 100)
    // Account for forced loss chance
    const effectiveWinChance = winChance * (1 - lossChance / 100)
    return ((actualMultiplier * effectiveWinChance) / 100 - 1) * 100
  }

  const calculateCrashExpectedValue = () => {
    const { houseEdge } = gameSettings.crashSettings
    return -houseEdge
  }

  const minesEV = calculateMinesExpectedValue()
  const diceEV = calculateDiceExpectedValue()
  const crashEV = calculateCrashExpectedValue()

  const saveGameSettings = (gameType: "mines" | "dice" | "crash") => {
    setIsSaving(true)

    // Simulate API call to save settings
    setTimeout(() => {
      setSavedSettings({ ...gameSettings })
      setIsSaving(false)

      toast({
        title: `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Settings Saved`,
        description: "Game settings have been updated successfully.",
        variant: "success",
      })
    }, 800)
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
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <BarChart3 className="h-5 w-5" />
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
              <Settings className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Admin Panel</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative" ref={notificationRef}>
                <Button variant="outline" size="icon" className="relative" onClick={toggleNotifications}>
                  <Bell className="h-5 w-5" />
                  {totalPending > 0 && hasNewNotifications && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {totalPending}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg overflow-hidden z-50 border">
                    <div className="p-3 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        <Badge variant="outline">{totalPending} Pending</Badge>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {pendingDeposits.filter((d) => d.status === "pending").length === 0 &&
                      pendingWithdrawals.filter((w) => w.status === "pending").length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No pending transactions</div>
                      ) : (
                        <>
                          {pendingDeposits
                            .filter((d) => d.status === "pending")
                            .map((deposit) => (
                              <div key={deposit.id} className="p-3 border-b hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-2">
                                  <ArrowDownToLine className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{deposit.username}</p>
                                      <Badge variant="outline" className="text-xs">
                                        Deposit
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{deposit.amount.toFixed(8)} BTC</p>
                                    <p className="text-xs text-muted-foreground">
                                      {deposit.timestamp.toLocaleTimeString()}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                                        onClick={() => handleApproveDeposit(deposit.id)}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                                        onClick={() => handleRejectDeposit(deposit.id)}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {pendingWithdrawals
                            .filter((w) => w.status === "pending")
                            .map((withdrawal) => (
                              <div key={withdrawal.id} className="p-3 border-b hover:bg-muted/50 transition-colors">
                                <div className="flex items-start gap-2">
                                  <ArrowUpFromLine className="h-5 w-5 text-blue-500 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{withdrawal.username}</p>
                                      <Badge variant="outline" className="text-xs">
                                        Withdrawal
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{withdrawal.amount.toFixed(8)} BTC</p>
                                    <p className="text-xs text-muted-foreground truncate">To: {withdrawal.address}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {withdrawal.timestamp.toLocaleTimeString()}
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                                        onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                                        onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </>
                      )}
                    </div>

                    <div className="p-2 border-t">
                      <Link href="/admin/transactions">
                        <Button variant="ghost" size="sm" className="w-full text-xs">
                          View All Transactions
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Exit Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-40 md:hidden">
              <div className="grid grid-cols-4 gap-1 p-1">
                <Link href="/admin" className="flex flex-col items-center justify-center py-2 text-primary">
                  <BarChart3 className="h-5 w-5" />
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
          <main className="grid gap-6 p-6 md:gap-10 md:p-8">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
              <div className="flex gap-2">
                <Link href="/admin/users">
                  <Button size="sm" variant="outline" className="hidden sm:flex">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link href="/admin/transactions">
                  <Button size="sm" variant="outline" className="hidden sm:flex">
                    <Wallet className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pending Approvals Section */}
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="bg-yellow-50 dark:bg-yellow-900/20 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <CardTitle>Pending Approvals</CardTitle>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300"
                  >
                    {totalPending} Pending
                  </Badge>
                </div>
                <CardDescription>Review and approve pending deposits and withdrawals</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="deposits">
                  <TabsList className="w-full grid grid-cols-2 mb-4">
                    <TabsTrigger value="deposits" className="flex items-center gap-2">
                      <ArrowDownToLine className="h-4 w-4" />
                      Deposits ({pendingDeposits.filter((d) => d.status === "pending").length})
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="flex items-center gap-2">
                      <ArrowUpFromLine className="h-4 w-4" />
                      Withdrawals ({pendingWithdrawals.filter((w) => w.status === "pending").length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="deposits" className="space-y-4">
                    {pendingDeposits.filter((d) => d.status === "pending").length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">No pending deposits</div>
                    ) : (
                      pendingDeposits
                        .filter((d) => d.status === "pending")
                        .map((deposit) => (
                          <div key={deposit.id} className="border rounded-lg p-4 bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <ArrowDownToLine className="h-4 w-4 text-primary" />
                                <span className="font-medium">{deposit.username}</span>
                              </div>
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <p className="text-muted-foreground">Amount:</p>
                                <p className="font-mono">{deposit.amount.toFixed(8)} BTC</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Time:</p>
                                <p>{deposit.timestamp.toLocaleTimeString()}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground">Transaction ID:</p>
                                <p className="font-mono text-xs truncate">{deposit.transactionId}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                                onClick={() => handleApproveDeposit(deposit.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                                onClick={() => handleRejectDeposit(deposit.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>

                  <TabsContent value="withdrawals" className="space-y-4">
                    {pendingWithdrawals.filter((w) => w.status === "pending").length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">No pending withdrawals</div>
                    ) : (
                      pendingWithdrawals
                        .filter((w) => w.status === "pending")
                        .map((withdrawal) => (
                          <div key={withdrawal.id} className="border rounded-lg p-4 bg-card">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <ArrowUpFromLine className="h-4 w-4 text-primary" />
                                <span className="font-medium">{withdrawal.username}</span>
                              </div>
                              <Badge variant="secondary">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div>
                                <p className="text-muted-foreground">Amount:</p>
                                <p className="font-mono">{withdrawal.amount.toFixed(8)} BTC</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Time:</p>
                                <p>{withdrawal.timestamp.toLocaleTimeString()}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground">Address:</p>
                                <p className="font-mono text-xs truncate">{withdrawal.address}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-muted-foreground">Transaction ID:</p>
                                <p className="font-mono text-xs truncate">{withdrawal.transactionId}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                                onClick={() => handleApproveWithdrawal(withdrawal.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                                onClick={() => handleRejectWithdrawal(withdrawal.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRevenue.toFixed(8)} BTC</div>
                  <p className="text-xs text-muted-foreground">≈ ${(totalRevenue * 60000).toFixed(2)} USD</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <UserPlus className="h-3 w-3 mr-1" />
                    <span>+1 new today</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBets}</div>
                  <p className="text-xs text-muted-foreground">+3 in the last 24 hours</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="games">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="games">Game Settings</TabsTrigger>
                <TabsTrigger value="payments">Payment Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="games" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Game Settings</CardTitle>
                    <CardDescription>Configure detailed settings for each game</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="mines">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="mines" className="flex items-center gap-2">
                          <Bomb className="h-4 w-4" />
                          Mines
                        </TabsTrigger>
                        <TabsTrigger value="dice" className="flex items-center gap-2">
                          <Dice className="h-4 w-4" />
                          Dice
                        </TabsTrigger>
                        <TabsTrigger value="crash" className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Crash
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="mines" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="mines-edge">House Edge (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="mines-edge"
                                min={0.1}
                                max={5}
                                step={0.1}
                                value={[gameSettings.minesSettings.houseEdge]}
                                onValueChange={(value) => updateMinesSetting("houseEdge", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">
                                {gameSettings.minesSettings.houseEdge.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mines-count">Default Mine Count</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="mines-count"
                                min={1}
                                max={24}
                                step={1}
                                value={[gameSettings.minesSettings.mineCount]}
                                onValueChange={(value) => updateMinesSetting("mineCount", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">{gameSettings.minesSettings.mineCount}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mines-grid">Grid Size</Label>
                            <Select
                              value={gameSettings.minesSettings.gridSize.toString()}
                              onValueChange={(value) => updateMinesSetting("gridSize", Number.parseInt(value))}
                            >
                              <SelectTrigger id="mines-grid">
                                <SelectValue placeholder="Select grid size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="16">4x4 (16 cells)</SelectItem>
                                <SelectItem value="25">5x5 (25 cells)</SelectItem>
                                <SelectItem value="36">6x6 (36 cells)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mines-max-multiplier">Max Multiplier</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="mines-max-multiplier"
                                type="number"
                                min={1}
                                max={1000}
                                value={gameSettings.minesSettings.maxMultiplier}
                                onChange={(e) => updateMinesSetting("maxMultiplier", Number.parseFloat(e.target.value))}
                                className="flex-1"
                              />
                              <span>x</span>
                            </div>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="mines-loss-chance" className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Forced Loss Chance (%)
                            </Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="mines-loss-chance"
                                min={0}
                                max={10}
                                step={0.5}
                                value={[gameSettings.minesSettings.lossChance]}
                                onValueChange={(value) => updateMinesSetting("lossChance", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">
                                {gameSettings.minesSettings.lossChance.toFixed(1)}%
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              This is the chance that a player will lose regardless of the normal game mechanics. Higher
                              values increase house edge but may frustrate players.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Game Statistics
                            </h4>
                          </div>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Expected Value</p>
                              <p className={`font-medium ${minesEV >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {minesEV.toFixed(2)}%
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Win Probability</p>
                              <p className="font-medium">
                                {(
                                  ((gameSettings.minesSettings.gridSize - gameSettings.minesSettings.mineCount) /
                                    gameSettings.minesSettings.gridSize) *
                                  100
                                ).toFixed(2)}
                                %
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Effective House Edge</p>
                              <p className="font-medium">
                                {(
                                  gameSettings.minesSettings.houseEdge +
                                  gameSettings.minesSettings.lossChance * 0.5
                                ).toFixed(2)}
                                %
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-4" onClick={() => saveGameSettings("mines")} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                              Saving...
                            </>
                          ) : (
                            "Save Mines Settings"
                          )}
                        </Button>

                        {savedSettings &&
                          JSON.stringify(savedSettings.minesSettings) ===
                            JSON.stringify(gameSettings.minesSettings) && (
                            <p className="text-center text-sm text-green-600 mt-2">✓ Settings saved successfully</p>
                          )}
                      </TabsContent>

                      <TabsContent value="dice" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="dice-edge">House Edge (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="dice-edge"
                                min={0.1}
                                max={5}
                                step={0.1}
                                value={[gameSettings.diceSettings.houseEdge]}
                                onValueChange={(value) => updateDiceSetting("houseEdge", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">{gameSettings.diceSettings.houseEdge.toFixed(1)}%</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dice-win-chance">Default Win Chance (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="dice-win-chance"
                                min={1}
                                max={98}
                                step={1}
                                value={[gameSettings.diceSettings.winChance]}
                                onValueChange={(value) => updateDiceSetting("winChance", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">{gameSettings.diceSettings.winChance.toFixed(0)}%</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dice-max-multiplier">Max Multiplier</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="dice-max-multiplier"
                                type="number"
                                min={1}
                                max={1000}
                                value={gameSettings.diceSettings.maxMultiplier}
                                onChange={(e) => updateDiceSetting("maxMultiplier", Number.parseFloat(e.target.value))}
                                className="flex-1"
                              />
                              <span>x</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dice-loss-chance" className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              Forced Loss Chance (%)
                            </Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="dice-loss-chance"
                                min={0}
                                max={10}
                                step={0.5}
                                value={[gameSettings.diceSettings.lossChance]}
                                onValueChange={(value) => updateDiceSetting("lossChance", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">
                                {gameSettings.diceSettings.lossChance.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-xs text-muted-foreground">
                              The forced loss chance overrides the normal game mechanics, ensuring the player loses
                              regardless of their bet. This increases the effective house edge but should be used
                              sparingly to maintain player trust.
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Game Statistics
                            </h4>
                          </div>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Expected Value</p>
                              <p className={`font-medium ${diceEV >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {diceEV.toFixed(2)}%
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Win Probability</p>
                              <p className="font-medium">
                                {(
                                  gameSettings.diceSettings.winChance *
                                  (1 - gameSettings.diceSettings.lossChance / 100)
                                ).toFixed(2)}
                                %
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Effective House Edge</p>
                              <p className="font-medium">
                                {(
                                  gameSettings.diceSettings.houseEdge +
                                  gameSettings.diceSettings.lossChance * 0.5
                                ).toFixed(2)}
                                %
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-4" onClick={() => saveGameSettings("dice")} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                              Saving...
                            </>
                          ) : (
                            "Save Dice Settings"
                          )}
                        </Button>

                        {savedSettings &&
                          JSON.stringify(savedSettings.diceSettings) === JSON.stringify(gameSettings.diceSettings) && (
                            <p className="text-center text-sm text-green-600 mt-2">✓ Settings saved successfully</p>
                          )}
                      </TabsContent>

                      <TabsContent value="crash" className="space-y-4 mt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="crash-edge">House Edge (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="crash-edge"
                                min={0.1}
                                max={5}
                                step={0.1}
                                value={[gameSettings.crashSettings.houseEdge]}
                                onValueChange={(value) => updateCrashSetting("houseEdge", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">
                                {gameSettings.crashSettings.houseEdge.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="crash-chance">Crash Chance (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="crash-chance"
                                min={0.1}
                                max={5}
                                step={0.1}
                                value={[gameSettings.crashSettings.crashChance]}
                                onValueChange={(value) => updateCrashSetting("crashChance", value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-right">
                                {gameSettings.crashSettings.crashChance.toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="crash-max-multiplier">Max Multiplier</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="crash-max-multiplier"
                                type="number"
                                min={1}
                                max={1000}
                                value={gameSettings.crashSettings.maxMultiplier}
                                onChange={(e) => updateCrashSetting("maxMultiplier", Number.parseFloat(e.target.value))}
                                className="flex-1"
                              />
                              <span>x</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Game Statistics
                            </h4>
                          </div>
                          <div className="grid gap-2 md:grid-cols-3">
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Expected Value</p>
                              <p className={`font-medium ${crashEV >= 0 ? "text-green-600" : "text-red-600"}`}>
                                {crashEV.toFixed(2)}%
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Avg. Crash Point</p>
                              <p className="font-medium">
                                {(100 / gameSettings.crashSettings.crashChance).toFixed(2)}x
                              </p>
                            </div>
                            <div className="p-2 bg-background rounded border">
                              <p className="text-xs text-muted-foreground">Max Payout</p>
                              <p className="font-medium">{gameSettings.crashSettings.maxMultiplier.toFixed(2)}x</p>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full mt-4" onClick={() => saveGameSettings("crash")} disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                              Saving...
                            </>
                          ) : (
                            "Save Crash Settings"
                          )}
                        </Button>

                        {savedSettings &&
                          JSON.stringify(savedSettings.crashSettings) ===
                            JSON.stringify(gameSettings.crashSettings) && (
                            <p className="text-center text-sm text-green-600 mt-2">✓ Settings saved successfully</p>
                          )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cryptocurrency Settings</CardTitle>
                    <CardDescription>Configure supported cryptocurrencies and withdrawal limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Bitcoin (BTC)</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="btc-min">Minimum Withdrawal</Label>
                          <Input id="btc-min" defaultValue="0.001" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="btc-fee">Withdrawal Fee (%)</Label>
                          <Input id="btc-fee" defaultValue="0.5" />
                        </div>
                      </div>
                      <Button className="mt-2">Save</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/admin/users">
                      <Button className="w-full" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Users
                      </Button>
                    </Link>
                    <Link href="/admin/transactions">
                      <Button className="w-full" variant="outline">
                        <Wallet className="h-4 w-4 mr-2" />
                        View Transactions
                      </Button>
                    </Link>
                    <Link href="/admin/settings">
                      <Button className="w-full" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Site Settings
                      </Button>
                    </Link>
                    <Button className="w-full" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Manage Payouts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Current system information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Server Status</span>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Online
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Maintenance Mode</span>
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                        Disabled
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Last Backup</span>
                      <span className="text-sm">Today, 03:30 AM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Software Version</span>
                      <span className="text-sm">v1.0.0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}

