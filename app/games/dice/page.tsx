"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Dice5, Sparkles, ArrowDown, ArrowUp } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/balance-display"
import { gameSettingsService } from "@/lib/game-settings-service"

export default function DiceGame() {
  const router = useRouter()
  const [betAmount, setBetAmount] = useState(0.001)
  const [targetValue, setTargetValue] = useState(50)
  const [betType, setBetType] = useState<"over" | "under">("over")
  const [rolling, setRolling] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [won, setWon] = useState<boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [diceRotation, setDiceRotation] = useState({ x: 0, y: 0, z: 0 })
  const [rollAnimation, setRollAnimation] = useState(false)
  const diceRef = useRef<HTMLDivElement>(null)
  const user = auth.getCurrentUser()

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!auth.isAuthenticated()) {
      router.push("/auth/login?redirect=/games/dice")
    }
  }, [router])

  const winChance = betType === "over" ? 100 - targetValue : targetValue
  const houseEdge = 0.01 // 1% house edge
  const fairMultiplier = 100 / winChance
  const multiplier = (fairMultiplier * (1 - houseEdge)).toFixed(2)

  // Generate random dice rotations
  const getRandomRotation = () => {
    return {
      x: Math.floor(Math.random() * 360),
      y: Math.floor(Math.random() * 360),
      z: Math.floor(Math.random() * 360),
    }
  }

  const rollDice = () => {
    // Check if user has enough balance
    if (!auth.hasEnoughBalance(betAmount)) {
      alert("Insufficient balance. Please deposit more funds.")
      return
    }

    // Deduct bet amount from balance
    auth.subtractFromBalance(betAmount)

    setRolling(true)
    setShowResult(false)
    setRollAnimation(true)

    // Start dice rolling animation
    const rollInterval = setInterval(() => {
      setDiceRotation(getRandomRotation())
    }, 100)

    // Simulate dice roll
    setTimeout(() => {
      clearInterval(rollInterval)
      setRollAnimation(false)

      const roll = Math.floor(Math.random() * 100) + 1
      setResult(roll)

      // Determine if won
      let playerWon = false
      if (betType === "over") {
        playerWon = roll > targetValue
      } else {
        playerWon = roll < targetValue
      }

      // Apply game settings (forced loss chance)
      playerWon = gameSettingsService.applyDiceSettings(playerWon)

      setWon(playerWon)
      setShowResult(true)

      // Add winnings if player won
      if (playerWon) {
        const winnings = betAmount * Number.parseFloat(multiplier)
        auth.addToBalance(winnings)
      }

      setRolling(false)
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
        <main className="flex-1 container py-6">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold">Dice</h1>
              <p className="text-muted-foreground">Roll the dice and predict the outcome.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Dice Game</CardTitle>
                    <CardDescription>Bet on the outcome of a 1-100 dice roll.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Bet Amount</p>
                        <p className="font-bold text-sm sm:text-base">{betAmount.toFixed(6)} BTC</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Potential Win</p>
                        <p className="font-bold text-sm sm:text-base">
                          {(betAmount * Number.parseFloat(multiplier)).toFixed(6)} BTC
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Multiplier</p>
                        <p className="font-bold text-sm sm:text-base">{multiplier}x</p>
                        <p className="text-xs text-muted-foreground">
                          {Number(multiplier) > 10 ? "High Risk" : Number(multiplier) > 3 ? "Medium Risk" : "Low Risk"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:items-center">
                        <Label className="text-center sm:text-left">Target Value: {targetValue}</Label>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          <Button
                            size="sm"
                            variant={betType === "under" ? "default" : "outline"}
                            onClick={() => {
                              setBetType("under")
                              // Force multiplier recalculation
                              const newWinChance = targetValue
                              const fairMultiplier = 100 / newWinChance
                              const newMultiplier = (fairMultiplier * (1 - houseEdge)).toFixed(2)
                            }}
                            className="flex-1 sm:flex-auto gap-1"
                          >
                            <ArrowDown className="h-4 w-4" />
                            Roll Under
                          </Button>
                          <Button
                            size="sm"
                            variant={betType === "over" ? "default" : "outline"}
                            onClick={() => {
                              setBetType("over")
                              // Force multiplier recalculation
                              const newWinChance = 100 - targetValue
                              const fairMultiplier = 100 / newWinChance
                              const newMultiplier = (fairMultiplier * (1 - houseEdge)).toFixed(2)
                            }}
                            className="flex-1 sm:flex-auto gap-1"
                          >
                            <ArrowUp className="h-4 w-4" />
                            Roll Over
                          </Button>
                        </div>
                      </div>
                      <div className="relative pt-5 pb-1">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 ease-out"
                            style={{
                              width: `${betType === "under" ? targetValue : 100 - targetValue}%`,
                              marginLeft: betType === "under" ? "0" : `${targetValue}%`,
                            }}
                          ></div>
                        </div>
                        <Slider
                          min={1}
                          max={98}
                          step={1}
                          value={[targetValue]}
                          onValueChange={(value) => {
                            setTargetValue(value[0])
                            // Recalculate multiplier based on new target value
                            const newWinChance = betType === "over" ? 100 - value[0] : value[0]
                            const fairMultiplier = 100 / newWinChance
                            const newMultiplier = (fairMultiplier * (1 - houseEdge)).toFixed(2)
                          }}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1</span>
                          <span>98</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-8">
                      {result !== null && showResult ? (
                        <div className="text-center">
                          <div
                            className={`inline-flex items-center justify-center h-20 w-20 md:h-24 md:w-24 rounded-full 
                              ${won ? "bg-green-100 dark:bg-green-900/30 border-green-500" : "bg-red-100 dark:bg-red-900/30 border-red-500"} 
                              text-3xl md:text-4xl font-bold border-2 shadow-inner
                              ${won ? "animate-win-pulse" : "animate-lose-pulse"}`}
                          >
                            {result}
                          </div>
                          <p className={`mt-4 font-bold ${won ? "text-green-500" : "text-red-500"}`}>
                            {won ? (
                              <span className="flex items-center justify-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                You Won!
                                <Sparkles className="h-5 w-5" />
                              </span>
                            ) : (
                              "You Lost!"
                            )}
                          </p>
                          {won && (
                            <p className="text-green-500">
                              +{(betAmount * Number.parseFloat(multiplier) - betAmount).toFixed(6)} BTC
                            </p>
                          )}

                          {/* Celebration particles for wins */}
                          {won && (
                            <div className="absolute inset-0 pointer-events-none">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="absolute inline-block w-2 h-2 rounded-full bg-primary"
                                  style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random(),
                                    animation: `dice-confetti ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <div
                            ref={diceRef}
                            className={`dice-container inline-flex items-center justify-center h-24 w-24 rounded-lg bg-muted relative perspective
                              ${rollAnimation ? "animate-roll" : ""}`}
                          >
                            <div
                              className="dice absolute w-16 h-16 transform-style-3d transition-transform duration-500"
                              style={{
                                transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg) rotateZ(${diceRotation.z}deg)`,
                              }}
                            >
                              {/* Dice faces */}
                              <div className="dice-face dice-face-1">1</div>
                              <div className="dice-face dice-face-2">2</div>
                              <div className="dice-face dice-face-3">3</div>
                              <div className="dice-face dice-face-4">4</div>
                              <div className="dice-face dice-face-5">5</div>
                              <div className="dice-face dice-face-6">6</div>
                            </div>
                            {rolling && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Dice5 className="h-12 w-12 text-muted-foreground animate-spin-slow" />
                              </div>
                            )}
                          </div>
                          <p className="mt-4 text-muted-foreground">Roll the dice to play</p>
                        </div>
                      )}
                    </div>

                    <Button onClick={rollDice} disabled={rolling} className="w-full">
                      {rolling ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                          Rolling...
                        </span>
                      ) : (
                        "Roll Dice"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Game Settings</CardTitle>
                    <CardDescription>Customize your bet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bet-amount">Bet Amount (BTC)</Label>
                      <Input
                        id="bet-amount"
                        type="number"
                        step="0.000001"
                        min="0.000001"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number.parseFloat(e.target.value))}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="space-y-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span>Win Chance</span>
                        <span>{winChance}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Payout</span>
                        <span>{multiplier}x</span>
                      </div>
                      <div className="mt-4 p-3 rounded-md bg-muted/50 text-xs">
                        <p className="font-medium mb-1">How Multipliers Work:</p>
                        <p className="text-muted-foreground">
                          The multiplier is calculated based on your win chance: 100 ÷ Win Chance × (1 - House Edge).
                        </p>
                        <p className="text-muted-foreground mt-1">
                          Lower win chance = higher risk = higher potential rewards.
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Game Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Bets</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Wagered</span>
                      <span>0.00 BTC</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Profit/Loss</span>
                      <span>0.00 BTC</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes dice-confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
        }
        
        @keyframes win-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        
        @keyframes lose-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        
        .animate-roll {
          animation: roll 1.5s ease-out;
        }
        
        @keyframes roll {
          0% { transform: translateZ(-100px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          50% { transform: translateZ(-100px) rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
          100% { transform: translateZ(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        }
        
        .perspective {
          perspective: 600px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .dice-face {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          background-color: white;
          border: 2px solid #ddd;
          border-radius: 4px;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .dice-face-1 {
          transform: translateZ(16px);
        }
        
        .dice-face-2 {
          transform: rotateY(180deg) translateZ(16px);
        }
        
        .dice-face-3 {
          transform: rotateY(90deg) translateZ(16px);
        }
        
        .dice-face-4 {
          transform: rotateY(-90deg) translateZ(16px);
        }
        
        .dice-face-5 {
          transform: rotateX(90deg) translateZ(16px);
        }
        
        .dice-face-6 {
          transform: rotateX(-90deg) translateZ(16px);
        }
      `}</style>
    </AuthCheck>
  )
}

