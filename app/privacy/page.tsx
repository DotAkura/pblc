import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: March 2024</p>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              At Sync Network, we respect your privacy and are committed to protecting your personal data. This Privacy
              Policy explains how we collect, use, and safeguard your information when you use our website and services.
            </p>
            <p>
              By using Sync Network, you consent to the collection and use of information in accordance with this
              policy.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <p>We collect several types of information for various purposes to provide and improve our services:</p>
            <h3 className="text-lg font-medium mt-4 mb-2">2.1 Personal Data</h3>
            <p>
              While using our services, we may ask you to provide certain personally identifiable information that can
              be used to contact or identify you, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Email address</li>
              <li>Username</li>
              <li>Cryptocurrency wallet addresses</li>
              <li>IP address and device information</li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">2.2 Usage Data</h3>
            <p>
              We may also collect information on how our services are accessed and used. This Usage Data may include
              information such as your computer's Internet Protocol address, browser type, browser version, the pages of
              our service that you visit, the time and date of your visit, the time spent on those pages, and other
              diagnostic data.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent, and address technical issues</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the
              Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable
              means to protect your personal data, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Your Data Protection Rights</h2>
            <p>
              We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal
              Data. You have the following data protection rights:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>The right to access, update, or delete the information we have on you</li>
              <li>
                The right of rectification - the right to have your information corrected if it is inaccurate or
                incomplete
              </li>
              <li>The right to object to our processing of your Personal Data</li>
              <li>
                The right of restriction - the right to request that we restrict the processing of your personal
                information
              </li>
              <li>
                The right to data portability - the right to be provided with a copy of your Personal Data in a
                structured, machine-readable format
              </li>
              <li>
                The right to withdraw consent at any time where we relied on your consent to process your personal
                information
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our services and hold certain
              information. Cookies are files with a small amount of data which may include an anonymous unique
              identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our services.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date at the top of this page.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy
              are effective when they are posted on this page.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at groupsql@proton.me.
            </p>
          </div>
        </div>
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
            <Link href="/privacy" className="text-sm text-primary underline-offset-4 hover:underline transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

