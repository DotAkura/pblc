"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MineIcon, DiceIcon } from "@/components/game-icons"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/balance-display"

export default function GamesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Redirect to login if user is not authenticated
    if (!auth.isAuthenticated()) {
      router.push("/auth/login?redirect=/games")
      return
    }
  }, [router])

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
              <Link href="/wallet" className="hidden sm:block">
                <Button variant="outline" size="sm" className="h-8 md:h-10">
                  Wallet: <BalanceDisplay />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="h-8 md:h-10">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Games</h1>
              <p className="text-muted-foreground">Choose a game to play and win crypto</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/games/mines" className="block h-full">
                <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <MineIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle>Mines</CardTitle>
                        <CardDescription>Navigate through a minefield to collect gems</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 15 }).map((_, index) => (
                          <div key={index} className="aspect-square w-6 h-6 rounded-md bg-muted border" />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>House Edge</span>
                        <span>1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Win</span>
                        <span>100x</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Play Now</Button>
                  </CardFooter>
                </Card>
              </Link>

              <Link href="/games/dice" className="block h-full">
                <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <DiceIcon className="h-8 w-8" />
                      </div>
                      <div>
                        <CardTitle>Dice</CardTitle>
                        <CardDescription>Roll the dice and predict the outcome</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-md border-2 border-primary/50 bg-background font-bold text-2xl">
                        49
                      </div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>House Edge</span>
                        <span>1%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Win</span>
                        <span>99x</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Play Now</Button>
                  </CardFooter>
                </Card>
              </Link>

              <Link href="#" className="block h-full">
                <Card className="h-full opacity-60 hover:opacity-80 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">
                        <span className="block h-8 w-8 flex items-center justify-center font-bold">?</span>
                      </div>
                      <div>
                        <CardTitle>Coming Soon</CardTitle>
                        <CardDescription>New games are on the way</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 flex items-center justify-center bg-muted/50 rounded-md">
                      <p className="text-muted-foreground">New Game Preview</p>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>House Edge</span>
                        <span>TBA</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Max Win</span>
                        <span>TBA</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

