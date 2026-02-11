"use client"

import { useAtomValue } from "jotai"
import { motion } from "framer-motion"
import { ModeSelector } from "@/components/typing-screen/mode-selector"
import { testStatusAtom, timerAtom, modeAtom } from "@/store"

export function TestControls() {
  const testStatus = useAtomValue(testStatusAtom)
  const timer = useAtomValue(timerAtom)
  const mode = useAtomValue(modeAtom)

  const showTimer = mode === "time" && testStatus !== "idle"

  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between min-h-[48px]">
      {/* Timer - Left Side */}
      <div className="flex-1">
        {showTimer && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-primary text-3xl font-bold tabular-nums"
          >
            {timer}
          </motion.div>
        )}
      </div>

      {/* Mode Selector - Right Side */}
      <div className="flex-1 flex justify-end">
        <ModeSelector />
      </div>
    </div>
  )
}
