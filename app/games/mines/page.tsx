"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Bomb, Diamond, Sparkles, AlertCircle } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/balance-display"
import { gameSettingsService } from "@/lib/game-settings-service"

export default function MinesGame() {
  const router = useRouter()
  const [betAmount, setBetAmount] = useState(0.001)
  const [mineCount, setMineCount] = useState(5)
  const [gameActive, setGameActive] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [multiplier, setMultiplier] = useState(1.0)
  const [revealedCells, setRevealedCells] = useState<number[]>([])
  const [mines, setMines] = useState<number[]>([])
  const [lastRevealedCell, setLastRevealedCell] = useState<number | null>(null)
  const [showAllMines, setShowAllMines] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const [animatingCell, setAnimatingCell] = useState<number | null>(null)
  const [shakingBoard, setShakingBoard] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const user = auth.getCurrentUser()

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!auth.isAuthenticated()) {
      router.push("/auth/login?redirect=/games/mines")
    }
  }, [router])

  const gridSize = 25 // 5x5 grid

  // Calculate the base multiplier for the current mine count
  const calculateBaseMultiplier = (mines: number, revealed = 0) => {
    // If no cells have been revealed yet, multiplier should be 1.0 (no profit)
    if (revealed === 0) return 1.0

    const safeSquares = gridSize - mines
    const houseEdge = 0.01 // 1% house edge

    // Base multiplier for revealing one square
    const winProbability = (safeSquares - revealed) / (gridSize - revealed)
    return Number.parseFloat(((1 / winProbability) * (1 - houseEdge)).toFixed(2))
  }

  const startGame = () => {
    // Clear any previous error messages
    setErrorMessage("")

    // Check if user has enough balance
    if (!auth.hasEnoughBalance(betAmount)) {
      setErrorMessage("Insufficient balance. Please deposit more funds.")
      return
    }

    // Deduct bet amount from balance
    auth.subtractFromBalance(betAmount)

    // Generate random mine positions
    const minePositions: number[] = []
    while (minePositions.length < mineCount) {
      const position = Math.floor(Math.random() * gridSize)
      if (!minePositions.includes(position)) {
        minePositions.push(position)
      }
    }

    setMines(minePositions)
    setGameActive(true)
    setGameOver(false)
    setRevealedCells([])
    setMultiplier(1.0) // Start with multiplier of 1.0 (no profit)
    setShowAllMines(false)
    setIsWin(false)
    setLastRevealedCell(null)
  }

  const cashOut = () => {
    if (!gameActive || gameOver) return

    // Prevent cashing out without revealing any cells
    if (revealedCells.length === 0) {
      setErrorMessage("You must reveal at least one cell before cashing out.")
      return
    }

    setGameOver(true)
    setGameActive(false)
    setIsWin(true)

    // Calculate winnings and add to balance
    const winnings = betAmount * multiplier
    auth.addToBalance(winnings)

    // Show celebration effect
    setTimeout(() => {
      setShowAllMines(true)
    }, 500)
  }

  const handleCellClick = (index: number) => {
    if (!gameActive || gameOver || revealedCells.includes(index)) return

    // Clear any previous error messages
    setErrorMessage("")

    setAnimatingCell(index)
    setLastRevealedCell(index)

    setTimeout(() => {
      setAnimatingCell(null)

      if (mines.includes(index)) {
        // Hit a mine, game over
        setGameOver(true)
        setGameActive(false)
        setIsWin(false)
        setShakingBoard(true)

        // Show all mines after a short delay
        setTimeout(() => {
          setShowAllMines(true)
          setShakingBoard(false)
        }, 500)

        // No winnings added since player lost
      } else {
        // Safe cell
        const newRevealed = [...revealedCells, index]
        setRevealedCells(newRevealed)

        // Calculate multiplier based on probability and house edge
        // Formula: 1 / (probability of winning) * (1 - houseEdge)
        const safeSquares = gridSize - mineCount
        const revealedCount = newRevealed.length
        const remainingSafeSquares = safeSquares - revealedCount
        const remainingSquares = gridSize - revealedCount
        const houseEdge = 0.01 // 1% house edge

        // Probability of winning on next click = remaining safe squares / remaining total squares
        const winProbability = remainingSafeSquares / remainingSquares
        const newMultiplier = (1 / winProbability) * (1 - houseEdge)
        setMultiplier(Number.parseFloat(newMultiplier.toFixed(2)))

        // Apply game settings (forced loss chance)
        const shouldContinue = gameSettingsService.applyMinesSettings(true)

        if (!shouldContinue) {
          // Force a loss on the next click
          setTimeout(() => {
            setGameOver(true)
            setGameActive(false)
            setIsWin(false)
            setShakingBoard(true)

            // Show all mines after a short delay
            setTimeout(() => {
              setShowAllMines(true)
              setShakingBoard(false)
            }, 500)
          }, 300)
          return
        }

        // Check if all safe cells are revealed
        if (newRevealed.length === gridSize - mines.length) {
          setGameOver(true)
          setGameActive(false)
          setIsWin(true)

          // Player won by revealing all safe cells
          const winnings = betAmount * newMultiplier
          auth.addToBalance(winnings)

          // Show celebration effect
          setTimeout(() => {
            setShowAllMines(true)
          }, 500)
        }
      }
    }, 300) // Animation duration
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
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">Mines</h1>
              <p className="text-muted-foreground">Navigate through a minefield to collect gems.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Game Board</CardTitle>
                    <CardDescription>Click on tiles to reveal gems. Avoid mines!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {errorMessage && (
                      <div className="mb-4 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-200 text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Bet Amount</p>
                        <p className="font-bold text-sm sm:text-base">{betAmount.toFixed(6)} BTC</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Potential Win</p>
                        <p className="font-bold text-sm sm:text-base">{(betAmount * multiplier).toFixed(6)} BTC</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs sm:text-sm text-muted-foreground">Multiplier</p>
                        <p className="font-bold text-sm sm:text-base">{multiplier.toFixed(2)}x</p>
                      </div>
                    </div>

                    <div className={`max-w-[300px] mx-auto mb-6 ${shakingBoard ? "animate-shake" : ""}`}>
                      <div className="grid grid-cols-5 gap-1 sm:gap-2">
                        {Array.from({ length: gridSize }).map((_, index) => {
                          const isMine = mines.includes(index)
                          const isRevealed = revealedCells.includes(index)
                          const shouldShowMine =
                            (showAllMines && isMine) || (gameOver && isMine && index === lastRevealedCell)
                          const isAnimating = animatingCell === index

                          return (
                            <button
                              key={index}
                              onClick={() => handleCellClick(index)}
                              disabled={!gameActive || gameOver || isRevealed}
                              className={`
                                aspect-square flex items-center justify-center rounded-md border
                                ${!isRevealed && !shouldShowMine ? "bg-muted hover:bg-muted/80" : ""}
                                ${shouldShowMine ? "bg-red-100 dark:bg-red-900/30" : ""}
                                ${isRevealed ? "bg-green-100 dark:bg-green-900/30" : ""}
                                ${isAnimating ? "animate-pulse" : ""}
                                transition-all duration-200 transform
                                ${isRevealed || shouldShowMine ? "scale-100" : "hover:scale-105"}
                                ${index === lastRevealedCell && !isMine ? "animate-reveal" : ""}
                                ${index === lastRevealedCell && isMine ? "animate-explode" : ""}
                                relative overflow-hidden
                              `}
                            >
                              {shouldShowMine ? (
                                <Bomb className="h-4 w-4 text-red-500 animate-bounce" />
                              ) : isRevealed ? (
                                <Diamond className="h-4 w-4 text-green-500 animate-shine" />
                              ) : null}

                              {/* Ripple effect for clicked cells */}
                              {isAnimating && (
                                <span className="absolute inset-0 animate-ripple rounded-md bg-primary/20"></span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!gameActive ? (
                        <Button onClick={startGame} className="w-full">
                          Start Game
                        </Button>
                      ) : (
                        <Button
                          onClick={cashOut}
                          className="w-full"
                          variant="outline"
                          disabled={revealedCells.length === 0}
                        >
                          Cash Out ({(betAmount * multiplier).toFixed(6)} BTC)
                        </Button>
                      )}
                    </div>

                    {gameOver && (
                      <div
                        className={`mt-4 p-4 rounded-md ${isWin ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"} text-center relative overflow-hidden`}
                      >
                        {isWin ? (
                          <>
                            <p className="font-bold text-green-500 flex items-center justify-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              You won {(betAmount * multiplier).toFixed(6)} BTC!
                              <Sparkles className="h-5 w-5" />
                            </p>
                            {/* Celebration particles */}
                            <div className="absolute inset-0 pointer-events-none">
                              {Array.from({ length: 20 }).map((_, i) => (
                                <span
                                  key={i}
                                  className="absolute inline-block w-2 h-2 rounded-full bg-primary"
                                  style={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: Math.random(),
                                    animation: `confetti ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                                  }}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="font-bold text-red-500">Game Over! You hit a mine.</p>
                        )}
                        <Button onClick={startGame} className="mt-2">
                          Play Again
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Game Settings</CardTitle>
                    <CardDescription>Customize your game</CardDescription>
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

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="mine-count">Number of Mines</Label>
                        <span className="text-sm text-muted-foreground">{mineCount}</span>
                      </div>
                      <Slider
                        id="mine-count"
                        min={1}
                        max={24}
                        step={1}
                        value={[mineCount]}
                        onValueChange={(value) => {
                          setMineCount(value[0])
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>24</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="space-y-2 w-full">
                      <div className="flex justify-between text-sm">
                        <span>Mines</span>
                        <span>{mineCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Win Chance</span>
                        <span>{(((gridSize - mineCount) / gridSize) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="mt-4 p-3 rounded-md bg-muted/50 text-xs">
                        <p className="font-medium mb-1">How Multipliers Work:</p>
                        <p className="text-muted-foreground">
                          The multiplier increases as you reveal more safe tiles. You must reveal at least one tile
                          before cashing out.
                        </p>
                        <p className="text-muted-foreground mt-1">
                          Higher mine count = higher risk = higher potential rewards.
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
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes reveal {
          0% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        @keyframes explode {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes shine {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.5); }
          100% { filter: brightness(1); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100px) rotate(720deg); opacity: 0; }
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out;
        }
        
        .animate-reveal {
          animation: reveal 0.3s ease-out;
        }
        
        .animate-explode {
          animation: explode 0.5s ease-out;
        }
        
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </AuthCheck>
  )
}

