"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowLeft, ArrowUpFromLine, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthCheck } from "@/components/auth-check"
// Add the import for the TransactionProcessing component
import { TransactionProcessing } from "@/components/transaction-processing"

export default function WithdrawPage() {
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [amount, setAmount] = useState(0.001)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const auth = useAuth()
  // Add a new state variable to track the processing state
  const [isProcessing, setIsProcessing] = useState(false)

  // Update the handleWithdraw function
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate withdrawal
    if (!withdrawAddress) {
      setError("Please enter a valid Bitcoin address")
      return
    }

    // Check if user has enough balance
    if (!auth.hasEnoughBalance(amount)) {
      setError("Insufficient balance for withdrawal")
      return
    }

    setIsSubmitting(true)

    // Show processing screen after a short delay
    setTimeout(() => {
      setIsSubmitting(false)
      setIsProcessing(true)

      // In a real app, this would happen after confirmation
      setTimeout(() => {
        try {
          // Subtract amount from balance
          // const result = auth.subtractFromBalance(amount)
          // if (!result) {
          //   throw new Error("Failed to process withdrawal")
          // }
        } catch (err) {
          setError("Failed to process withdrawal. Please try again.")
          setIsProcessing(false)
        }
      }, 5000)
    }, 1500)
  }

  // Update the return statement to conditionally render the processing component
  return (
    <AuthCheck requireAuth>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 md:h-16 items-center justify-between py-2 md:py-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="font-bold text-xl">
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
          <div className="max-w-2xl mx-auto">
            {isProcessing ? (
              <TransactionProcessing
                type="withdrawal"
                amount={amount}
                address={withdrawAddress}
                onComplete={() => router.push("/wallet")}
              />
            ) : (
              <>
                <div className="flex items-center gap-2 mb-6">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => router.push("/wallet")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold">Withdraw Bitcoin</h1>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ArrowUpFromLine className="h-5 w-5 text-primary" />
                      <CardTitle>Withdraw Funds</CardTitle>
                    </div>
                    <CardDescription>Withdraw your Bitcoin to an external wallet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {error && (
                      <div className="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleWithdraw}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdraw-address">Bitcoin Address</Label>
                          <Input
                            id="withdraw-address"
                            placeholder="Enter BTC address"
                            value={withdrawAddress}
                            onChange={(e) => setWithdrawAddress(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="withdraw-amount">Amount (BTC)</Label>
                          <Input
                            id="withdraw-amount"
                            type="number"
                            step="0.00000001"
                            min="0.0001"
                            value={amount}
                            onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
                            required
                          />
                          <div className="flex justify-between text-sm">
                            <span>Available: {auth.balance.toFixed(8)} BTC</span>
                            <button type="button" className="text-primary" onClick={() => setAmount(auth.balance)}>
                              Max
                            </button>
                          </div>
                        </div>

                        <div className="rounded-lg border p-4">
                          <h3 className="font-medium mb-2">Withdrawal Information</h3>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Minimum withdrawal: 0.0001 BTC</li>
                            <li>• Network fee: 0.0001 BTC</li>
                            <li>• Processing time: 10-30 minutes</li>
                          </ul>
                        </div>

                        <div className="rounded-lg bg-muted p-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Amount</span>
                            <span>{amount.toFixed(8)} BTC</span>
                          </div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Network Fee</span>
                            <span>0.0001 BTC</span>
                          </div>
                          <div className="flex justify-between text-sm font-medium">
                            <span>You will receive</span>
                            <span>{Math.max(0, amount - 0.0001).toFixed(8)} BTC</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-6">
                        <Button variant="outline" type="button" onClick={() => router.push("/wallet")}>
                          Back to Wallet
                        </Button>
                        <Button type="submit" disabled={isSubmitting || amount <= 0 || !withdrawAddress}>
                          {isSubmitting ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                              Processing...
                            </span>
                          ) : (
                            "Withdraw"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

