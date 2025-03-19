"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { QrCode, Copy, ArrowLeft, ArrowDownToLine, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthCheck } from "@/components/auth-check"
import { TransactionProcessing } from "@/components/transaction-processing"

export default function DepositPage() {
  const [depositAddress] = useState("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh")
  const [amount, setAmount] = useState(0.001)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const auth = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Add a function to handle deposits
  const handleDeposit = () => {
    setIsSubmitting(true)

    // Show processing screen after a short delay
    setTimeout(() => {
      setIsSubmitting(false)
      setIsProcessing(true)

      // No automatic balance addition - waiting for admin approval
    }, 1500)
  }

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
              <TransactionProcessing type="deposit" amount={amount} onComplete={() => router.push("/wallet")} />
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
                  <h1 className="text-2xl font-bold">Deposit Bitcoin</h1>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ArrowDownToLine className="h-5 w-5 text-primary" />
                      <CardTitle>Deposit Funds</CardTitle>
                    </div>
                    <CardDescription>Send Bitcoin to the address below to fund your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (BTC)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.00000001"
                        min="0.0001"
                        value={amount}
                        onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">Minimum deposit: 0.0001 BTC</p>
                    </div>

                    <div className="text-center">
                      <div className="inline-block p-3 bg-white rounded-lg mb-4 shadow-sm border">
                        <QrCode className="h-48 w-48" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Send only BTC to this address</p>
                        <div className="flex items-center justify-center gap-2 max-w-full">
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs md:text-sm truncate max-w-[300px]">
                            {depositAddress}
                          </code>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => copyToClipboard(depositAddress)}
                            className="h-8 w-8 rounded-full"
                          >
                            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copy address</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Important Information</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Send only Bitcoin (BTC) to this address</li>
                        <li>• Minimum deposit: 0.0001 BTC</li>
                        <li>• Deposits require 1 network confirmation</li>
                        <li>• Deposit will be credited automatically</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/wallet")}>
                      Back to Wallet
                    </Button>
                    <Button onClick={handleDeposit} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          Processing...
                        </span>
                      ) : (
                        "I've Sent My Deposit"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

