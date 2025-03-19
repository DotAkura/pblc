import type React from "react"
import { Bomb, Dice5, TrendingUp } from "lucide-react"

export function MineIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Bomb {...props} />
}

export function DiceIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Dice5 {...props} />
}

export function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return <TrendingUp {...props} />
}

