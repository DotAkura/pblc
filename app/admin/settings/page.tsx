"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Settings, Wallet, Shield, Globe, Mail } from "lucide-react"
import { AuthCheck } from "@/components/auth-check"
import { auth } from "@/lib/auth"

export default function AdminSettingsPage() {
  const router = useRouter()

  // Site settings
  const [siteName, setSiteName] = useState("Sync Network")
  const [siteDescription, setSiteDescription] = useState("The premier crypto gaming platform")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)

  // Email settings
  const [emailFrom, setEmailFrom] = useState("noreply@syncnetwork.com")
  const [emailSmtp, setEmailSmtp] = useState("smtp.example.com")
  const [emailPort, setEmailPort] = useState("587")
  const [emailUsername, setEmailUsername] = useState("apikey")
  const [emailPassword, setEmailPassword] = useState("••••••••••••••••")

  // Security settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5")
  const [sessionTimeout, setSessionTimeout] = useState("60")

  useEffect(() => {
    // Check if user is authenticated and is an admin
    const isAuthenticated = auth.isAuthenticated()
    const isAdmin = auth.isAdmin()

    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/admin/settings")
      return
    }

    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [router])

  return (
    <AuthCheck requireAuth requireAdmin>
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-muted/40 z-30">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Settings className="h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Users className="h-5 w-5" />
                <span>Users</span>
              </Link>
              <Link
                href="/admin/transactions"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Wallet className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex-1 md:ml-64">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <Settings className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Settings</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  Exit Admin
                </Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-40 md:hidden">
              <div className="grid grid-cols-4 gap-1 p-1">
                <Link href="/admin" className="flex flex-col items-center justify-center py-2 text-muted-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs mt-1">Dashboard</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground"
                >
                  <Users className="h-5 w-5" />
                  <span className="text-xs mt-1">Users</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex flex-col items-center justify-center py-2 text-muted-foreground"
                >
                  <Wallet className="h-5 w-5" />
                  <span className="text-xs mt-1">Transactions</span>
                </Link>
                <Link href="/admin/settings" className="flex flex-col items-center justify-center py-2 text-primary">
                  <Settings className="h-5 w-5" />
                  <span className="text-xs mt-1">Settings</span>
                </Link>
              </div>
            </div>
          </header>
          <main className="grid gap-6 p-6 md:gap-8 md:p-8">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Platform Settings</h1>
            </div>

            <Tabs defaultValue="general">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">
                  <Globe className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure the basic settings for your platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Site Name</Label>
                      <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea
                        id="site-description"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between space-y-0 pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                        <p className="text-sm text-muted-foreground">When enabled, only admins can access the site.</p>
                      </div>
                      <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                    </div>
                    <div className="flex items-center justify-between space-y-0 pt-2">
                      <div className="space-y-0.5">
                        <Label htmlFor="registration-enabled">User Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow new users to register on the platform.</p>
                      </div>
                      <Switch
                        id="registration-enabled"
                        checked={registrationEnabled}
                        onCheckedChange={setRegistrationEnabled}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>
                      Configure email settings for notifications and user communications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-from">From Email Address</Label>
                      <Input
                        id="email-from"
                        type="email"
                        value={emailFrom}
                        onChange={(e) => setEmailFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-smtp">SMTP Server</Label>
                      <Input id="email-smtp" value={emailSmtp} onChange={(e) => setEmailSmtp(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-port">SMTP Port</Label>
                      <Input id="email-port" value={emailPort} onChange={(e) => setEmailPort(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-username">SMTP Username</Label>
                      <Input
                        id="email-username"
                        value={emailUsername}
                        onChange={(e) => setEmailUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-password">SMTP Password</Label>
                      <Input
                        id="email-password"
                        type="password"
                        value={emailPassword}
                        onChange={(e) => setEmailPassword(e.target.value)}
                      />
                    </div>
                    <div className="pt-2">
                      <Button variant="outline">Test Email Connection</Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Configure security settings for your platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-y-0">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Force all users to set up 2FA for their accounts.
                        </p>
                      </div>
                      <Switch id="two-factor" checked={twoFactorRequired} onCheckedChange={setTwoFactorRequired} />
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                      <Input
                        id="max-login-attempts"
                        type="number"
                        min="1"
                        max="10"
                        value={maxLoginAttempts}
                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Number of failed login attempts before account is temporarily locked.
                      </p>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        min="15"
                        max="1440"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        Time in minutes before an inactive session is automatically logged out.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}

