"use client"

import { useAtomValue } from "jotai"
import { motion } from "framer-motion"
import {
  wpmAtom,
  rawWpmAtom,
  accuracyAtom,
  correctCharsAtom,
  incorrectCharsAtom,
  totalTypedCharsAtom,
  timeTakenAtom,
} from "@/store/atoms"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRestart } from "@/hooks/use-restart"
import { RotateCcw } from "lucide-react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
}

export function ResultScreen() {
  const wpm = useAtomValue(wpmAtom)
  const rawWpm = useAtomValue(rawWpmAtom)
  const accuracy = useAtomValue(accuracyAtom)
  const correctChars = useAtomValue(correctCharsAtom)
  const incorrectChars = useAtomValue(incorrectCharsAtom)
  const totalTypedChars = useAtomValue(totalTypedCharsAtom)
  const timeTaken = useAtomValue(timeTakenAtom)
  const restart = useRestart()

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto px-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-end gap-8 mb-10">
        <motion.div variants={item} className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-1">
            wpm
          </span>
          <span className="text-7xl font-bold text-accent-active tabular-nums leading-none">
            {wpm}
          </span>
        </motion.div>

        <motion.div variants={item} className="flex flex-col">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-1">
            acc
          </span>
          <span className="text-7xl font-bold text-accent-active tabular-nums leading-none">
            {accuracy}%
          </span>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <motion.div variants={item}>
          <Card className="bg-card-elevated border-border/50">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Raw WPM
              </p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {rawWpm}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card-elevated border-border/50">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Time
              </p>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {timeTaken}s
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card-elevated border-border/50">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Correct
              </p>
              <p className="text-2xl font-semibold text-green-400 tabular-nums">
                {correctChars}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="bg-card-elevated border-border/50">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Incorrect
              </p>
              <p className="text-2xl font-semibold text-destructive tabular-nums">
                {incorrectChars}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card className="bg-card-elevated border-border/50">
          <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                Characters
              </p>
              <p className="text-lg font-medium text-foreground tabular-nums">
                <span className="text-green-400">{correctChars}</span>
                {" / "}
                <span className="text-destructive">{incorrectChars}</span>
                {" / "}
                <span className="text-muted-foreground">{totalTypedChars}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => restart()}
              className="text-muted-foreground hover:text-accent-active transition-colors h-12 w-12 cursor-pointer"
              aria-label="Restart test"
            >
              <RotateCcw className="size-5" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="flex justify-center mt-6">
        <p className="text-xs text-muted-foreground/60">
          press <kbd className="px-1.5 py-0.5 rounded bg-card-elevated text-muted-foreground text-xs">Tab</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-card-elevated text-muted-foreground text-xs">Enter</kbd> to restart
        </p>
      </motion.div>
    </motion.div>
  )
}
