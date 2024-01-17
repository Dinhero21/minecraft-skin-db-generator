import { UUID_LIST_FILE } from '../settings.js'
import { open } from 'fs/promises'

const file = await open(UUID_LIST_FILE)
const lines = file.readLines()
const linesIterator = lines[Symbol.asyncIterator]()

export const RETRY = new Set<string>()

export async function getUUID (): Promise<string | undefined> {
  // Retry
  {
    const iterator = RETRY.values()
    const result = iterator.next()
    const value = result.value as string

    if (value !== undefined) {
      RETRY.delete(value)

      return value
    }
  }

  // Readline
  {
    const result = await linesIterator.next()

    const value = result.value

    return value
  }
}
