import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function TermsPage() {
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
      <main className="flex-1 container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to Sync Network. These Terms of Service govern your use of our website and services. By accessing
              or using Sync Network, you agree to be bound by these Terms. If you disagree with any part of the terms,
              you may not access our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use Sync Network. By using our services, you represent and warrant
              that you are at least 18 years of age and have the legal capacity to enter into these Terms.
            </p>
            <p>
              You are responsible for ensuring that your use of Sync Network complies with all laws, rules, and
              regulations applicable to you and in your jurisdiction. If your use of Sync Network would be prohibited by
              applicable law, you are not permitted to use our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To use certain features of Sync Network, you may need to register for an account. You agree to provide
              accurate, current, and complete information during the registration process and to update such information
              to keep it accurate, current, and complete.
            </p>
            <p>
              You are responsible for safeguarding your account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized use of your account or any other breach of
              security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Cryptocurrency Transactions</h2>
            <p>
              Sync Network allows you to deposit, wager, and withdraw cryptocurrencies. You acknowledge that
              cryptocurrency transactions are irreversible and you are responsible for ensuring the accuracy of all
              transaction details.
            </p>
            <p>
              We are not responsible for any loss or damage arising from your failure to maintain the security of your
              account or wallet information.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Responsible Gaming</h2>
            <p>
              Sync Network promotes responsible gaming. We provide tools to help you manage your gaming activity,
              including deposit limits, loss limits, and self-exclusion options. We encourage you to use these tools to
              ensure that gaming remains an enjoyable activity.
            </p>
            <p>
              If you believe you may have a gambling problem, we encourage you to seek help from a professional
              organization.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Prohibited Activities</h2>
            <p>You agree not to engage in any of the following prohibited activities:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                Using our services for any illegal purpose or in violation of any local, state, national, or
                international law
              </li>
              <li>
                Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions
                to or from the servers running Sync Network
              </li>
              <li>Using any robot, spider, crawler, scraper, or other automated means to access our services</li>
              <li>
                Circumventing or attempting to circumvent any measures we may use to prevent or restrict access to our
                services
              </li>
              <li>
                Engaging in any form of cheating, collusion, fraud, or any other activity that we deem to be in
                violation of the spirit of our games
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account and access to our services immediately, without prior notice or
              liability, for any reason, including if you breach these Terms.
            </p>
            <p>
              Upon termination, your right to use our services will immediately cease. If you wish to terminate your
              account, you may simply discontinue using our services or contact us to request account deletion.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
              posting the new Terms on our website and updating the "Last updated" date at the top of this page.
            </p>
            <p>
              Your continued use of Sync Network after any such changes constitutes your acceptance of the new Terms. If
              you do not agree to the new terms, you must stop using our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at groupsql@proton.me</p>
          </div>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Sync Network. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-primary underline-offset-4 hover:underline transition-colors">
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

