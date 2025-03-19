"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MineIcon, DiceIcon } from "@/components/game-icons"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { LogOut } from "lucide-react"

// Import the BalanceDisplay component
import { BalanceDisplay } from "@/components/balance-display"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Redirect to login if user is not authenticated
    if (!auth.isAuthenticated()) {
      router.push("/auth/login")
      return
    }

    // Get current user
    const currentUser = auth.getCurrentUser()
    setUser(currentUser)
  }, [router])

  const handleLogout = () => {
    auth.logout()
    router.push("/")
  }

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
              {/* Replace the static balance display with the dynamic component */}
              <Link href="/wallet" className="hidden sm:block">
                <Button variant="outline" size="sm" className="h-8 md:h-10">
                  Wallet: <BalanceDisplay />
                </Button>
              </Link>
              <div className="flex items-center gap-1">
                <Link href="/profile">
                  <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <span className="sr-only">Profile</span>
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      {mounted && user ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 md:h-10 md:w-10">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-6">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {mounted && user ? user.username : "User"}!</p>
              </div>
              <div className="flex gap-2">
                <Link href="/wallet/deposit" className="flex-1 sm:flex-auto">
                  <Button className="w-full sm:w-auto">Deposit</Button>
                </Link>
                <Link href="/wallet/withdraw" className="flex-1 sm:flex-auto">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Withdraw
                  </Button>
                </Link>
                {mounted && user?.isAdmin && (
                  <Link href="/admin" className="flex-1 sm:flex-auto">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              {/* Update the balance card to use the dynamic component */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <BalanceDisplay />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ≈ ${mounted && user ? (user.balance * 60000).toFixed(2) : "0.00"} USD
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Wagered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.00 BTC</div>
                  <p className="text-xs text-muted-foreground">≈ $0.00 USD</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.00 BTC</div>
                  <p className="text-xs text-muted-foreground">≈ $0.00 USD</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="games">
              <TabsList>
                <TabsTrigger value="games">Games</TabsTrigger>
                <TabsTrigger value="history">Bet History</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              <TabsContent value="games" className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Link href="/games/mines">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <MineIcon className="h-5 w-5" />
                          <CardTitle>Mines</CardTitle>
                        </div>
                        <CardDescription>Navigate through a minefield to collect gems.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-md">
                          <p className="text-sm text-muted-foreground">Game Preview</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/games/dice">
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <DiceIcon className="h-5 w-5" />
                          <CardTitle>Dice</CardTitle>
                        </div>
                        <CardDescription>Roll the dice and predict the outcome.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-24 flex items-center justify-center bg-muted/50 rounded-md">
                          <p className="text-sm text-muted-foreground">Game Preview</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bets</CardTitle>
                    <CardDescription>Your recent betting activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      No betting history yet. Start playing to see your bets here.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transactions" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent deposits and withdrawals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      No transaction history yet. Make a deposit to get started.
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

