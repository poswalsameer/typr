import { generate } from "random-words"

export function generateWords(count: number): string[] {
  return generate(count) as string[]
}
