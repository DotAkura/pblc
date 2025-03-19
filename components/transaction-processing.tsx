"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, ArrowLeft, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { notificationService } from "@/lib/notification-service"
import type { TransactionStatus } from "@/lib/models"

export interface TransactionProcessingProps {
  type: "deposit" | "withdrawal"
  amount: number
  address?: string
  transactionId?: string
  onComplete?: () => void
}

export function TransactionProcessing({
  type,
  amount,
  address,
  transactionId,
  onComplete,
}: TransactionProcessingProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<TransactionStatus>("pending")
  const [isComplete, setIsComplete] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)

  // Simulate transaction processing
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    const timer = setTimeout(() => {
      setIsComplete(true)
      setStatus("pending") // Set to pending for admin approval

      // Notify admin of new transaction
      if (type === "deposit") {
        notificationService.notifyNewDeposit({
          id: `tx-${Date.now()}`,
          userId: "current-user",
          username: "current-user",
          amount,
          timestamp: new Date(),
          transactionId: transactionId || `tx-${Math.random().toString(36).substring(2, 15)}`,
          status: "pending",
        })
      } else {
        notificationService.notifyNewWithdrawal({
          id: `tx-${Date.now()}`,
          userId: "current-user",
          username: "current-user",
          amount,
          address: address || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
          timestamp: new Date(),
          transactionId: transactionId || `tx-${Math.random().toString(36).substring(2, 15)}`,
          status: "pending",
        })
      }

      if (onComplete) {
        onComplete()
      }
    }, 5000)

    // Track processing time
    const processingTimer = setInterval(() => {
      setProcessingTime((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
      clearInterval(processingTimer)
    }
  }, [type, amount, address, transactionId, onComplete])

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The information has been copied to your clipboard.",
    })
  }

  const getStatusDisplay = () => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Approved</span>
          </div>
        )
      case "rejected":
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <Clock className="h-5 w-5" />
            <span>Pending Admin Approval</span>
          </div>
        )
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{type === "deposit" ? "Deposit" : "Withdrawal"} Processing</CardTitle>
        <CardDescription>
          {isComplete
            ? `Your ${type} has been submitted and is awaiting admin approval.`
            : `Your ${type} is being processed. Please do not close this page.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isComplete ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="text-center text-sm text-muted-foreground">Time elapsed: {processingTime} seconds</div>
          </>
        ) : (
          <>
            <div className="rounded-lg border p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusDisplay()}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="font-mono">{amount.toFixed(8)} BTC</span>
                </div>
                {type === "withdrawal" && address && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Address:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs truncate max-w-[150px]">{address}</span>
                      <button
                        onClick={() => handleCopyClick(address)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
                {transactionId && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Transaction ID:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs truncate max-w-[150px]">{transactionId}</span>
                      <button
                        onClick={() => handleCopyClick(transactionId)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <a
                        href={`https://www.blockchain.com/explorer/transactions/btc/${transactionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {type === "deposit"
                  ? "Your deposit has been submitted and is awaiting admin approval. Once approved, the funds will be added to your account."
                  : "Your withdrawal has been submitted and is awaiting admin approval. Once approved, the funds will be sent to your wallet."}
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {isComplete ? (
          <Button onClick={() => router.push("/wallet")} className="w-full" variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Wallet
          </Button>
        ) : (
          <Button disabled className="w-full">
            Processing...
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

