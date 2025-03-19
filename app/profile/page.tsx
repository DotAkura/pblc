"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { auth } from "@/lib/auth"
import { BalanceDisplay } from "@/components/balance-display"
import { AuthCheck } from "@/components/auth-check"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Mark component as mounted
    setMounted(true)

    // Get current user
    const currentUser = auth.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setFormData({
        ...formData,
        username: currentUser.username,
        email: currentUser.email,
      })
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would update the user's profile
    setIsEditing(false)
  }

  return (
    <AuthCheck requireAuth>
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
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Account Information</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>
                    <CardDescription>Update your account details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src="" alt="User" />
                            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                              {mounted && user ? user.username.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <Button variant="outline" type="button" className="w-full sm:w-auto">
                              Change Avatar
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                          />
                        </div>

                        {isEditing && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                              />
                            </div>

                            <Button type="submit" className="w-full mt-4">
                              Save Changes
                            </Button>
                          </>
                        )}
                      </div>
                    </form>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="2fa" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for account activity
                          </p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Login Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <Switch id="login-notifications" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Account Level</span>
                        <span className="font-medium">Standard</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Member Since</span>
                        <span className="font-medium">March 2025</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Login</span>
                        <span className="font-medium">Today</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Verification Status</span>
                        <span className="font-medium text-yellow-500">Pending</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Current Balance</span>
                        <span className="font-medium">
                          <BalanceDisplay />
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/wallet">Manage Wallet</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full">
                      Download Account Data
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthCheck>
  )
}

