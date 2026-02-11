"use client"

import { motion } from "framer-motion"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { WordRow } from "@/components/typing-screen/word-row"
import { useCallback, useEffect, useRef, useState } from "react"
import { SmoothCursor } from "@/components/typing-screen/smooth-cursor"
import { generateWords } from "@/lib/words"
import {
  modeAtom,
  timerAtom,
  wordsAtom,
  endTimeAtom,
  startTimeAtom,
  testStatusAtom,
  correctCharsAtom,
  incorrectCharsAtom,
  totalTypedCharsAtom,
  currentWordIndexAtom,
  currentCharIndexAtom,
  selectedTimeOptionAtom,
} from "@/store"

export function TypingArea() {
  const [testStatus, setTestStatus] = useAtom(testStatusAtom)
  const [currentWordIndex, setCurrentWordIndex] = useAtom(currentWordIndexAtom)
  const [currentCharIndex, setCurrentCharIndex] = useAtom(currentCharIndexAtom)
  const [words, setWords] = useAtom(wordsAtom)

  const mode = useAtomValue(modeAtom)
  const timeOption = useAtomValue(selectedTimeOptionAtom)

  const setTimer = useSetAtom(timerAtom)
  const setEndTime = useSetAtom(endTimeAtom)
  const setStartTime = useSetAtom(startTimeAtom)
  const setCorrectChars = useSetAtom(correctCharsAtom)
  const setIncorrectChars = useSetAtom(incorrectCharsAtom)
  const setTotalTypedChars = useSetAtom(totalTypedCharsAtom)

  const [typedWords, setTypedWords] = useState<string[]>([])
  const [scrollOffset, setScrollOffset] = useState<number>(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const wordsContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const lineHeight = 58

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

      // Allow Ctrl+Backspace for deleting entire word
      if ((e.ctrlKey || e.altKey || e.metaKey) && e.key !== "Backspace") return

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

        // In time mode, generate more words if approaching the end
        if (mode === "time" && nextIndex >= words.length - 10) {
          const newWords = generateWords(50)
          setWords((prev) => [...prev, ...newWords])
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
        // Ctrl+Backspace: Delete entire word
        if (e.ctrlKey || e.metaKey) {
          const typedLength = currentCharIndex
          if (typedLength > 0) {
            setCurrentCharIndex(0)
            setTypedWords((prev) => {
              const updated = [...prev]
              updated[currentWordIndex] = ""
              return updated
            })
            setTotalTypedChars((prev) => Math.max(0, prev - typedLength))
          }
        } else {
          // Regular backspace: Delete one character
          if (currentCharIndex > 0) {
            setCurrentCharIndex((prev) => prev - 1)
            setTypedWords((prev) => {
              const updated = [...prev]
              updated[currentWordIndex] = updated[currentWordIndex].slice(0, -1)
              return updated
            })
            setTotalTypedChars((prev) => Math.max(0, prev - 1))
          }
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
      setWords,
      setTypedWords,
      calculateLineForWord,
      lineHeight,
    ]
  )

  function handleContainerClick() {
    inputRef.current?.focus()
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
  }

  useEffect(() => {
    // Only reset typed words if the array got smaller (test restart)
    // Don't reset when words are appended (dynamic generation in time mode)
    setTypedWords((prev) => {
      if (prev.length > words.length) {
        // Test was restarted
        return new Array(words.length).fill("")
      } else if (prev.length < words.length) {
        // Words were appended, extend the typed words array
        const newSlots = words.length - prev.length
        return [...prev, ...new Array(newSlots).fill("")]
      }
      return prev
    })

    // Reset scroll only on test restart
    if (words.length <= 100) {
      setScrollOffset(0)
    }
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

  return (
    <div
      className="w-full max-w-4xl mx-auto px-4 relative select-none"
      onClick={handleContainerClick}
    >
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
