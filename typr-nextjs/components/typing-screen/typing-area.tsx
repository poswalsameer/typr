"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { motion } from "framer-motion"
import {
  wordsAtom,
  currentWordIndexAtom,
  currentCharIndexAtom,
  testStatusAtom,
  timerAtom,
  startTimeAtom,
  endTimeAtom,
  modeAtom,
  selectedTimeOptionAtom,
  correctCharsAtom,
  incorrectCharsAtom,
  totalTypedCharsAtom,
} from "@/store/atoms"
import { WordRow } from "@/components/typing-screen/word-row"
import { SmoothCursor } from "@/components/typing-screen/smooth-cursor"

export function TypingArea() {
  const words = useAtomValue(wordsAtom)
  const [currentWordIndex, setCurrentWordIndex] = useAtom(currentWordIndexAtom)
  const [currentCharIndex, setCurrentCharIndex] = useAtom(currentCharIndexAtom)
  const [testStatus, setTestStatus] = useAtom(testStatusAtom)
  const [timer, setTimer] = useAtom(timerAtom)
  const setStartTime = useSetAtom(startTimeAtom)
  const setEndTime = useSetAtom(endTimeAtom)
  const mode = useAtomValue(modeAtom)
  const timeOption = useAtomValue(selectedTimeOptionAtom)
  const setCorrectChars = useSetAtom(correctCharsAtom)
  const setIncorrectChars = useSetAtom(incorrectCharsAtom)
  const setTotalTypedChars = useSetAtom(totalTypedCharsAtom)

  const [typedWords, setTypedWords] = useState<string[]>([])
  const [scrollOffset, setScrollOffset] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lineHeight = 58

  useEffect(() => {
    setTypedWords(new Array(words.length).fill(""))
    setScrollOffset(0)
  }, [words])

  useEffect(() => {
    inputRef.current?.focus()
  }, [words, testStatus])

  useEffect(() => {
    if (testStatus === "running" && mode === "time") {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            setTestStatus("finished")
            setEndTime(Date.now())
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [testStatus, mode, setTimer, setTestStatus, setEndTime])

  useEffect(() => {
    if (testStatus === "idle" && mode === "time") {
      setTimer(timeOption)
    }
  }, [testStatus, mode, timeOption, setTimer])

  const calculateLineForWord = useCallback(
    (wordIndex: number) => {
      if (!wordsContainerRef.current) return 0
      const wordElements = wordsContainerRef.current.querySelectorAll("[data-word-index]")
      if (wordIndex >= wordElements.length) return 0
      const el = wordElements[wordIndex] as HTMLElement
      return Math.floor(el.offsetTop / lineHeight)
    },
    [lineHeight]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (testStatus === "finished") return

      if (e.ctrlKey || e.altKey || e.metaKey) return

      const key = e.key

      if (key === "Tab") {
        e.preventDefault()
        return
      }

      if (key.length === 1 || key === "Backspace" || key === " ") {
        e.preventDefault()
      } else {
        return
      }

      if (testStatus === "idle" && key.length === 1 && key !== " ") {
        setTestStatus("running")
        setStartTime(Date.now())
        if (mode === "time") {
          setTimer(timeOption)
        }
      }

      const currentWord = words[currentWordIndex]

      if (key === " ") {
        if (currentCharIndex === 0) return

        const typed = typedWords[currentWordIndex] || ""
        let correct = 0
        let incorrect = 0
        for (let i = 0; i < currentWord.length; i++) {
          if (i < typed.length) {
            if (typed[i] === currentWord[i]) correct++
            else incorrect++
          } else {
            incorrect++
          }
        }
        const extraChars = Math.max(0, typed.length - currentWord.length)
        incorrect += extraChars

        setCorrectChars((prev) => prev + correct)
        setIncorrectChars((prev) => prev + incorrect)

        const nextIndex = currentWordIndex + 1

        if (mode === "words" && nextIndex >= words.length) {
          setTestStatus("finished")
          setEndTime(Date.now())
          return
        }

        setCurrentWordIndex(nextIndex)
        setCurrentCharIndex(0)

        requestAnimationFrame(() => {
          const newLine = calculateLineForWord(nextIndex)
          if (newLine >= 2) {
            setScrollOffset((newLine - 1) * lineHeight)
          }
        })

        return
      }

      if (key === "Backspace") {
        if (currentCharIndex > 0) {
          setCurrentCharIndex((prev) => prev - 1)
          setTypedWords((prev) => {
            const updated = [...prev]
            updated[currentWordIndex] = updated[currentWordIndex].slice(0, -1)
            return updated
          })
          setTotalTypedChars((prev) => Math.max(0, prev - 1))
        }
        return
      }

      if (key.length === 1) {
        const maxExtraChars = 8
        if (currentCharIndex >= currentWord.length + maxExtraChars) return

        setTypedWords((prev) => {
          const updated = [...prev]
          updated[currentWordIndex] = (updated[currentWordIndex] || "") + key
          return updated
        })
        setCurrentCharIndex((prev) => prev + 1)
        setTotalTypedChars((prev) => prev + 1)
      }
    },
    [
      testStatus,
      words,
      currentWordIndex,
      currentCharIndex,
      typedWords,
      mode,
      timeOption,
      setTestStatus,
      setStartTime,
      setTimer,
      setCurrentWordIndex,
      setCurrentCharIndex,
      setCorrectChars,
      setIncorrectChars,
      setTotalTypedChars,
      setEndTime,
      calculateLineForWord,
      lineHeight,
    ]
  )

  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
  }

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 relative select-none"
      onClick={handleContainerClick}
    >
      {mode === "time" && testStatus !== "idle" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent-active text-2xl font-mono font-bold mb-4 tabular-nums"
        >
          {timer}
        </motion.div>
      )}

      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-text"
        style={{ height: `${lineHeight * 3}px` }}
        role="textbox"
        aria-label="Typing area"
        tabIndex={-1}
      >
        <motion.div
          ref={wordsContainerRef}
          className="flex flex-wrap relative"
          animate={{ y: -scrollOffset }}
          transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        >
          {words.map((word, index) => (
            <WordRow
              key={`${word}-${index}`}
              word={word}
              wordIndex={index}
              currentWordIndex={currentWordIndex}
              currentCharIndex={currentCharIndex}
              typedChars={typedWords[index] || ""}
              isActive={index === currentWordIndex}
            />
          ))}

          <SmoothCursor
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            containerRef={wordsContainerRef}
          />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 60%, var(--background) 100%)",
          }}
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type here"
        tabIndex={0}
      />
    </div>
  )
}
