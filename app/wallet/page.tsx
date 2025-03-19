"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownToLine, ArrowUpFromLine, Clock, Wallet, RefreshCw, Copy, QrCode } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/balance-display"

export default function WalletPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [depositAddress] = useState("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Redirect to login if user is not authenticated
    if (!auth.isAuthenticated()) {
      router.push("/auth/login?redirect=/wallet")
      return
    }

    // Get current user
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
  }, [router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Address copied to clipboard")
  }

  // Mock transaction data
  const transactions = [
    {
      id: "tx-123456",
      type: "deposit",
      amount: 0.01,
      status: "completed",
      date: "2025-03-18T14:30:00",
    },
    {
      id: "tx-123457",
      type: "withdrawal",
      amount: 0.005,
      status: "completed",
      date: "2025-03-17T10:15:00",
    },
    {
      id: "tx-123458",
      type: "game_win",
      amount: 0.0075,
      status: "completed",
      date: "2025-03-16T18:45:00",
    },
  ]

  return (
    <AuthCheck requireAuth>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 md:h-16 items-center justify-between py-2 md:py-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="font-bold text-xl md:text-2xl">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Sync Network
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <ModeToggle />
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 md:h-10">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Wallet</h1>
                <p className="text-muted-foreground">Manage your cryptocurrency</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-3">
                <CardHeader className="pb-3">
                  <CardTitle>Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-2xl shadow-sm">
                        ₿
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bitcoin</p>
                        <p className="text-3xl font-bold">
                          <BalanceDisplay />
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ≈ ${mounted && user ? (user.balance * 60000).toFixed(2) : "0.00"} USD
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={() => router.push("/wallet/deposit")} className="gap-2 py-6 px-8">
                        <ArrowDownToLine className="h-5 w-5" />
                        Deposit
                      </Button>
                      <Button
                        onClick={() => router.push("/wallet/withdraw")}
                        variant="outline"
                        className="gap-2 py-6 px-8"
                      >
                        <ArrowUpFromLine className="h-5 w-5" />
                        Withdraw
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Deposit</CardTitle>
                        <CardDescription>Send Bitcoin to this address to fund your account</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                          <div className="p-3 bg-white rounded-lg shadow-sm border">
                            <QrCode className="h-32 w-32" />
                          </div>
                          <div className="space-y-4 w-full">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">Your Bitcoin Deposit Address:</p>
                              <div className="flex items-center gap-2 max-w-full">
                                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs md:text-sm truncate max-w-[200px] md:max-w-[300px]">
                                  {depositAddress}
                                </code>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(depositAddress)}
                                  className="h-8 w-8 rounded-full"
                                >
                                  <Copy className="h-4 w-4" />
                                  <span className="sr-only">Copy address</span>
                                </Button>
                              </div>
                            </div>
                            <div className="rounded-lg border p-3">
                              <h3 className="text-sm font-medium mb-1">Important Information</h3>
                              <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Send only Bitcoin (BTC) to this address</li>
                                <li>• Minimum deposit: 0.0001 BTC</li>
                                <li>• Deposits require 1 network confirmation</li>
                              </ul>
                            </div>
                            <Button onClick={() => router.push("/wallet/deposit")} className="w-full">
                              Go to Deposit Page
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Wallet Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Deposits</p>
                            <p className="text-lg font-medium">0.01 BTC</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                            <p className="text-lg font-medium">0.005 BTC</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Pending Transactions</p>
                            <p className="text-lg font-medium">0</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="transactions" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your recent deposits and withdrawals</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {transactions.length > 0 ? (
                          <div className="space-y-4">
                            {transactions.map((tx) => (
                              <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-full ${
                                      tx.type === "deposit" || tx.type === "game_win"
                                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    }`}
                                  >
                                    {tx.type === "deposit" ? (
                                      <ArrowDownToLine className="h-4 w-4" />
                                    ) : tx.type === "withdrawal" ? (
                                      <ArrowUpFromLine className="h-4 w-4" />
                                    ) : (
                                      <Wallet className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {tx.type === "deposit"
                                        ? "Deposit"
                                        : tx.type === "withdrawal"
                                          ? "Withdrawal"
                                          : "Game Win"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(tx.date).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p
                                    className={`font-medium ${
                                      tx.type === "deposit" || tx.type === "game_win"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                                  >
                                    {tx.type === "deposit" || tx.type === "game_win" ? "+" : "-"}
                                    {tx.amount.toFixed(8)} BTC
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">No transaction history yet.</div>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full">
                          View All Transactions
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={() => router.push("/wallet/deposit")}
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                      Deposit Bitcoin
                    </Button>
                    <Button
                      onClick={() => router.push("/wallet/withdraw")}
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <ArrowUpFromLine className="h-4 w-4" />
                      Withdraw Bitcoin
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Clock className="h-4 w-4" />
                      Transaction History
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Wallet className="h-4 w-4" />
                      Wallet Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      If you have any issues with deposits or withdrawals, please contact our support team.
                    </p>
                    <Button variant="outline" className="w-full">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

