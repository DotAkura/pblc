import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import GameCard from "@/components/game-card"
import { MineIcon, DiceIcon } from "@/components/game-icons"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  return (
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
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="h-8 md:h-10">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="h-8 md:h-10">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-20 lg:py-32 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-6 md:px-8">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <div className="space-y-3 max-w-[800px]">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Play, Win, and Withdraw Instantly
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-xl">
                  Experience the thrill of crypto gaming with our secure and fair platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/games">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Start Playing
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Games</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Try your luck with our most popular crypto games.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mt-10">
                <GameCard
                  title="Mines"
                  description="Navigate through a minefield to collect gems."
                  icon={<MineIcon className="h-12 w-12" />}
                  href="/games/mines"
                />
                <GameCard
                  title="Dice"
                  description="Roll the dice and predict the outcome."
                  icon={<DiceIcon className="h-12 w-12" />}
                  href="/games/dice"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-28 lg:py-36 bg-muted/50">
          <div className="container px-6 md:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Security</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Your Security is Our Priority</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We use industry-leading encryption and security practices to ensure your funds and personal
                  information are always protected.
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>What makes our platform stand out</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Instant deposits and withdrawals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Provably fair gaming algorithms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Multiple cryptocurrency support</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/features">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Sync Network. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

