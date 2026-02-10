export type Mode = "words" | "time"

export type WordOption = 25 | 50 | 100

export type TimeOption = 15 | 30 | 60

export type SelectedOption = WordOption | TimeOption

export type TestStatus = "idle" | "running" | "finished"

export type CharState = {
  char: string
  state: "correct" | "incorrect" | "extra" | "pending"
}

export type WordState = {
  word: string
  chars: CharState[]
  typed: string
}