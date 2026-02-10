"use client"

import { atom } from "jotai"
import { generateWords } from "@/lib/words"
import { calculateWPM, calculateRawWPM, calculateAccuracy } from "@/lib/analytics"
import type { Mode, SelectedOption, TestStatus, TimeOption, WordOption, WordState } from "@/types"

export const modeAtom = atom<Mode>("words")
export const selectedWordOptionAtom = atom<WordOption>(25)
export const selectedTimeOptionAtom = atom<TimeOption>(15)

export const selectedOptionAtom = atom<SelectedOption>(
  (get) => {
    const mode = get(modeAtom)
    return mode === "words" ? get(selectedWordOptionAtom) : get(selectedTimeOptionAtom)
  }
)

export const wordsAtom = atom<string[]>(generateWords(25))
export const wordStatesAtom = atom<WordState[]>((get) => {
  const words = get(wordsAtom)
  return words.map((word) => ({
    word,
    chars: word.split("").map((char) => ({ char, state: "pending" as const })),
    typed: "",
  }))
})

export const currentWordIndexAtom = atom<number>(0)
export const currentCharIndexAtom = atom<number>(0)

export const typedHistoryAtom = atom<
  Array<{ word: string; typed: string; correct: boolean }>
>([])

export const testStatusAtom = atom<TestStatus>("idle")
export const timerAtom = atom<number>(0)
export const startTimeAtom = atom<number | null>(null)
export const endTimeAtom = atom<number | null>(null)

export const correctCharsAtom = atom<number>(0)
export const incorrectCharsAtom = atom<number>(0)
export const totalTypedCharsAtom = atom<number>(0)

export const wpmAtom = atom<number>((get) => {
  const correctChars = get(correctCharsAtom)
  const startTime = get(startTimeAtom)
  const endTime = get(endTimeAtom)
  const status = get(testStatusAtom)

  if (status === "idle" || !startTime) return 0

  const end = endTime || Date.now()
  const timeInSeconds = (end - startTime) / 1000
  return calculateWPM(correctChars, timeInSeconds)
})

export const rawWpmAtom = atom<number>((get) => {
  const totalChars = get(totalTypedCharsAtom)
  const startTime = get(startTimeAtom)
  const endTime = get(endTimeAtom)
  const status = get(testStatusAtom)

  if (status === "idle" || !startTime) return 0

  const end = endTime || Date.now()
  const timeInSeconds = (end - startTime) / 1000
  return calculateRawWPM(totalChars, timeInSeconds)
})

export const accuracyAtom = atom<number>((get) => {
  const correctChars = get(correctCharsAtom)
  const totalChars = get(totalTypedCharsAtom)
  return calculateAccuracy(correctChars, totalChars)
})

export const timeTakenAtom = atom<number>((get) => {
  const startTime = get(startTimeAtom)
  const endTime = get(endTimeAtom)
  if (!startTime || !endTime) return 0
  return Math.round((endTime - startTime) / 1000 * 10) / 10
})
