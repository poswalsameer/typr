"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRestart } from "@/hooks/use-restart"

export function Header() {
  const restart = useRestart()

  return (
    <header className="flex items-center justify-between w-full max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-primary select-none">
          typr
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => restart()}
        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        aria-label="Restart test"
      >
        <RotateCcw className="size-4" />
      </Button>
    </header>
  )
}
