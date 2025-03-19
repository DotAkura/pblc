import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface GameCardProps {
  title: string
  description: string
  icon: ReactNode
  href: string
}

export default function GameCard({ title, description, icon, href }: GameCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 h-full p-2">
      <CardHeader className="pb-0 space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-primary/10 text-primary">{icon}</div>
        </div>
        <CardTitle className="text-xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-28 flex items-center justify-center bg-muted/50 rounded-md">
          <p className="text-sm text-muted-foreground">Game Preview</p>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Link href={href} className="w-full">
          <Button className="w-full transition-all hover:bg-primary/90">Play Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

