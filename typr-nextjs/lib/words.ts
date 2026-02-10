import wordList from "@/data/words.json"

export function generateWords(count: number): string[] {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
