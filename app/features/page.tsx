import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { MineIcon, DiceIcon } from "@/components/game-icons"
import { Shield, Zap, Lock, Award, Wallet, Clock, Globe, HeartHandshake } from "lucide-react"

export default function FeaturesPage() {
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Platform Features
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-xl">
                  Discover what makes Sync Network the leading crypto gaming platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Core Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our platform is built with the latest technology to provide a seamless gaming experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Shield className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Industry-leading security measures to protect your funds and personal information.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Lock className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>Provably Fair</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Verify the fairness of every game outcome with our transparent algorithms.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Zap className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>Instant Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Deposit and withdraw your funds instantly with minimal fees.</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Earn rewards and bonuses as you play and level up your account.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Our Games</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Exciting games with fair odds and transparent mechanics designed for crypto enthusiasts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MineIcon className="h-6 w-6 text-primary" />
                    <CardTitle>Mines</CardTitle>
                  </div>
                  <CardDescription>Navigate through a minefield to collect gems.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Test your luck and strategy as you reveal tiles, avoiding hidden mines while collecting valuable
                    gems. The more tiles you safely reveal, the higher your multiplier grows.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>House Edge</span>
                    <span>1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Win</span>
                    <span>100x</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/games/mines" className="w-full">
                    <Button className="w-full">Play Now</Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DiceIcon className="h-6 w-6 text-primary" />
                    <CardTitle>Dice</CardTitle>
                  </div>
                  <CardDescription>Roll the dice and predict the outcome.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    A classic crypto casino game where you predict if the roll will be over or under your chosen target.
                    Adjust your risk level for higher potential rewards.
                  </p>
                  <div className="flex justify-between text-sm">
                    <span>House Edge</span>
                    <span>1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Max Win</span>
                    <span>99x</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/games/dice" className="w-full">
                    <Button className="w-full">Play Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Wallet Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Manage your crypto assets with ease using our secure wallet system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <CardTitle>Instant Deposits</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Deposit your crypto instantly with minimal confirmation times. We support Bitcoin and plan to add
                    more cryptocurrencies soon.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle>Fast Withdrawals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Withdraw your winnings quickly with our streamlined process. No long waiting periods or hidden fees.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-primary" />
                    <CardTitle>Global Access</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access your account and play from anywhere in the world. Our platform is designed to be accessible
                    globally.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    <CardTitle>24/7 Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our dedicated support team is available 24/7 to assist you with any questions or issues you may
                    have.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Get Started?</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Join thousands of players already enjoying Sync Network.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Sign Up Now
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

