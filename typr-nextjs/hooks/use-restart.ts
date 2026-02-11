"use client"

import { useCallback } from "react"
import { generateWords } from "@/lib/words"
import { useSetAtom, useAtomValue } from "jotai"
import type { Mode, TimeOption, WordOption } from "@/types"
import {
  modeAtom,
  wordsAtom,
  timerAtom,
  endTimeAtom,
  startTimeAtom,
  testStatusAtom,
  typedHistoryAtom,
  correctCharsAtom,
  incorrectCharsAtom,
  totalTypedCharsAtom,
  currentWordIndexAtom,
  currentCharIndexAtom,
  selectedWordOptionAtom,
  selectedTimeOptionAtom,
} from "@/store"

export function useRestart() {
  const setMode = useSetAtom(modeAtom)
  const setWords = useSetAtom(wordsAtom)
  const setCurrentWordIndex = useSetAtom(currentWordIndexAtom)
  const setCurrentCharIndex = useSetAtom(currentCharIndexAtom)
  const setTypedHistory = useSetAtom(typedHistoryAtom)
  const setTestStatus = useSetAtom(testStatusAtom)
  const setTimer = useSetAtom(timerAtom)
  const setStartTime = useSetAtom(startTimeAtom)
  const setEndTime = useSetAtom(endTimeAtom)
  const setCorrectChars = useSetAtom(correctCharsAtom)
  const setIncorrectChars = useSetAtom(incorrectCharsAtom)
  const setTotalTypedChars = useSetAtom(totalTypedCharsAtom)
  const currentMode = useAtomValue(modeAtom)
  const currentWordOption = useAtomValue(selectedWordOptionAtom)
  const currentTimeOption = useAtomValue(selectedTimeOptionAtom)

  return useCallback(
    (
      overrideMode?: Mode,
      overrideWordOption?: WordOption,
      overrideTimeOption?: TimeOption
    ) => {
      const mode = overrideMode ?? currentMode
      const wordOption = overrideWordOption ?? currentWordOption
      const timeOption = overrideTimeOption ?? currentTimeOption

      if (overrideMode) setMode(overrideMode)

      const wordCount = mode === "words" ? wordOption : 200
      setWords(generateWords(wordCount))
      setCurrentWordIndex(0)
      setCurrentCharIndex(0)
      setTypedHistory([])
      setTestStatus("idle")
      setTimer(mode === "time" ? timeOption : 0)
      setStartTime(null)
      setEndTime(null)
      setCorrectChars(0)
      setIncorrectChars(0)
      setTotalTypedChars(0)
    },
    [
      currentMode,
      currentWordOption,
      currentTimeOption,
      setMode,
      setWords,
      setCurrentWordIndex,
      setCurrentCharIndex,
      setTypedHistory,
      setTestStatus,
      setTimer,
      setStartTime,
      setEndTime,
      setCorrectChars,
      setIncorrectChars,
      setTotalTypedChars,
    ]
  )
}
