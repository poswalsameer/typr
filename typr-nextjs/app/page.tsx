"use client"

import { useAtomValue } from "jotai"
import { useEffect, useCallback } from "react"
import { testStatusAtom } from "@/store/atoms"
import { useRestart } from "@/hooks/use-restart"
import { AnimatePresence, motion } from "framer-motion"
import { ResultScreen } from "@/components/result-screen"
import { Header } from "@/components/typing-screen/header"
import { TypingArea } from "@/components/typing-screen/typing-area"
import { ModeSelector } from "@/components/typing-screen/mode-selector"

export default function Home() {
  const testStatus = useAtomValue(testStatusAtom)
  const restart = useRestart()

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault()
        if (testStatus === "idle" || testStatus === "running") {
          restart()
        }
      }
      if (e.key === "Enter" && testStatus === "finished") {
        e.preventDefault()
        restart()
      }
    },
    [testStatus, restart]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  return (
    <main className="min-h-screen flex flex-col items-center">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center w-full mb-16">
        <AnimatePresence mode="wait">
          {testStatus === "finished" ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              <ResultScreen />
            </motion.div>
          ) : (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <ModeSelector />
              <TypingArea />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="py-4 text-center">
        <p className="text-sm text-primary">
          Made by Sameer Poswal
        </p>
      </footer>
    </main>
  )
}
