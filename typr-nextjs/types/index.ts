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

export type ThemeId = "ocean" | "lavender" | "forest"

export type FontId = "geist-mono" | "geist-sans" | "monaco"

export type Theme = {
  id: ThemeId
  name: string
  colors: {
    primary: string
    secondary: string
    text: string
  }
}

export type Font = {
  id: FontId
  name: string
  family: string
}