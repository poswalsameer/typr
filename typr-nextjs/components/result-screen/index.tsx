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
} from "@/store"

export function ResultScreen() {
  const wpm = useAtomValue(wpmAtom)
  const rawWpm = useAtomValue(rawWpmAtom)
  const accuracy = useAtomValue(accuracyAtom)
  const timeTaken = useAtomValue(timeTakenAtom)
  const correctChars = useAtomValue(correctCharsAtom)
  const incorrectChars = useAtomValue(incorrectCharsAtom)
  const totalTypedChars = useAtomValue(totalTypedCharsAtom)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  }

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto flex flex-col gap-y-6 px-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Hero Metrics - WPM and Accuracy */}
      <div className="flex items-center justify-center gap-16 mb-12">
        <motion.div variants={item} className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-2">
            WPM
          </span>
          <span className="text-8xl font-bold text-primary tabular-nums leading-none">
            {wpm}
          </span>
        </motion.div>

        <motion.div
          variants={item}
          className="w-px h-24 bg-border"
        />

        <motion.div variants={item} className="flex flex-col items-center">
          <span className="text-sm text-muted-foreground font-medium uppercase tracking-widest mb-2">
            Accuracy
          </span>
          <span className="text-8xl font-bold text-primary tabular-nums leading-none">
            {accuracy}%
          </span>
        </motion.div>
      </div>

      {/* Other Stats - Horizontal Layout */}
      <motion.div
        variants={item}
        className="flex items-center justify-center gap-8 flex-wrap mb-8"
      >
        {/* Raw WPM */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Raw WPM
          </span>
          <span className="text-3xl font-semibold text-foreground tabular-nums">
            {rawWpm}
          </span>
        </div>

        <div className="w-px h-12 bg-border/50" />

        {/* Time */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Time
          </span>
          <span className="text-3xl font-semibold text-foreground tabular-nums">
            {timeTaken}s
          </span>
        </div>

        <div className="w-px h-12 bg-border/50" />

        {/* Correct */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Correct
          </span>
          <span className="text-3xl font-semibold text-green-400 tabular-nums">
            {correctChars}
          </span>
        </div>

        <div className="w-px h-12 bg-border/50" />

        {/* Incorrect */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Incorrect
          </span>
          <span className="text-3xl font-semibold text-destructive tabular-nums">
            {incorrectChars}
          </span>
        </div>

        <div className="w-px h-12 bg-border/50" />

        {/* Total Characters */}
        <div className="flex flex-col items-center min-w-[100px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Total
          </span>
          <span className="text-3xl font-semibold text-foreground tabular-nums">
            {totalTypedChars}
          </span>
        </div>
      </motion.div>

      {/* Restart Hint */}
      <motion.div variants={item} className="flex justify-center">
        <p className="text-xs text-muted-foreground/60">
          press <kbd className="px-1.5 py-0.5 rounded bg-card-elevated text-muted-foreground text-xs">Tab</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-card-elevated text-muted-foreground text-xs">Enter</kbd> to restart
        </p>
      </motion.div>
    </motion.div>
  )
}
