import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { Shield, Zap, Lock, Award, Users } from "lucide-react"

export default function AboutPage() {
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
                  About Sync Network
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-base md:text-xl">
                  The next generation of crypto gaming, built for players who demand fairness, security, and excitement.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Our Mission</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  At Sync Network, we're on a mission to revolutionize the online gaming industry by combining the
                  excitement of casino games with the transparency and security of blockchain technology.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  We believe that gaming should be fair, transparent, and accessible to everyone. That's why we've built
                  a platform that puts players first, with provably fair games, instant transactions, and a seamless
                  user experience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Secure</h3>
                  <p className="text-muted-foreground">
                    Industry-leading security measures to protect your funds and personal information.
                  </p>
                </Card>
                <Card className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Fast</h3>
                  <p className="text-muted-foreground">
                    Instant deposits and withdrawals with minimal fees and no waiting periods.
                  </p>
                </Card>
                <Card className="p-6">
                  <Lock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Fair</h3>
                  <p className="text-muted-foreground">
                    Provably fair gaming algorithms that ensure every outcome is random and verifiable.
                  </p>
                </Card>
                <Card className="p-6">
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Rewarding</h3>
                  <p className="text-muted-foreground">
                    Generous rewards, bonuses, and a loyalty program that values our players.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Team</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Meet the passionate individuals behind Sync Network who are dedicated to creating the best crypto gaming
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle>Salt</CardTitle>
                  <CardDescription>CEO & Developer</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    SaltSql. Not Another Dev.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle>Sarah Chen</CardTitle>
                  <CardDescription>CTO & Co-Founder</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Blockchain developer and security expert with a passion for creating fair gaming systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  <CardTitle>Michael Rodriguez</CardTitle>
                  <CardDescription>Head of Operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Operations expert with experience scaling fintech and gaming platforms globally.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Us Today</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Experience the future of crypto gaming with Sync Network.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto px-8">
                    Sign Up Now
                  </Button>
                </Link>
                <Link href="/features">
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

