"use client"

import { useAtom, useSetAtom } from "jotai"
import {
  modeAtom,
  selectedWordOptionAtom,
  selectedTimeOptionAtom,
  testStatusAtom,
  type Mode,
  type WordOption,
  type TimeOption,
} from "@/store/atoms"
import { useRestart } from "@/hooks/use-restart"

const wordOptions: WordOption[] = [25, 50, 100]
const timeOptions: TimeOption[] = [15, 30, 60]

export function ModeSelector() {
  const [mode, setMode] = useAtom(modeAtom)
  const [selectedWordOption, setSelectedWordOption] = useAtom(selectedWordOptionAtom)
  const [selectedTimeOption, setSelectedTimeOption] = useAtom(selectedTimeOptionAtom)
  const [testStatus] = useAtom(testStatusAtom)
  const restart = useRestart()

  const handleModeChange = (newMode: Mode) => {
    if (newMode === mode) return
    setMode(newMode)
    restart(newMode)
  }

  const handleWordOptionChange = (option: WordOption) => {
    setSelectedWordOption(option)
    restart("words", option)
  }

  const handleTimeOptionChange = (option: TimeOption) => {
    setSelectedTimeOption(option)
    restart("time", undefined, option)
  }

  const isDisabled = testStatus === "running"

  return (
    <div
      className={`flex items-center justify-center gap-0.5 rounded-xl bg-[hsl(var(--card-elevated))] px-4 py-2.5 select-none transition-opacity ${isDisabled ? "opacity-40 pointer-events-none" : ""
        }`}
      role="toolbar"
      aria-label="Test mode selector"
    >
      <button
        onClick={() => handleModeChange("words")}
        className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${mode === "words"
            ? "text-accent-active"
            : "text-muted-foreground hover:text-foreground"
          }`}
        aria-pressed={mode === "words"}
      >
        words
      </button>
      <button
        onClick={() => handleModeChange("time")}
        className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${mode === "time"
            ? "text-accent-active"
            : "text-muted-foreground hover:text-foreground"
          }`}
        aria-pressed={mode === "time"}
      >
        time
      </button>

      <div className="w-px h-4 bg-border mx-2" />

      {mode === "words"
        ? wordOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleWordOptionChange(option)}
            className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${selectedWordOption === option
                ? "text-accent-active"
                : "text-muted-foreground hover:text-foreground"
              }`}
            aria-pressed={selectedWordOption === option}
          >
            {option}
          </button>
        ))
        : timeOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleTimeOptionChange(option)}
            className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${selectedTimeOption === option
                ? "text-accent-active"
                : "text-muted-foreground hover:text-foreground"
              }`}
            aria-pressed={selectedTimeOption === option}
          >
            {option}
          </button>
        ))}
    </div>
  )
}
