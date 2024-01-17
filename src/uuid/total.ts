import { UUID_LIST_FILE } from '../settings.js'
import { createReadStream } from 'fs'

const NEW_LINE_CHARACTER = '\n'
const NEW_LINE_NUMBER = NEW_LINE_CHARACTER.charCodeAt(0)

const stream = createReadStream(UUID_LIST_FILE)

let lines = 0

stream.on('data', chunk => {
  for (const character of chunk) {
    if (character !== NEW_LINE_CHARACTER && character !== NEW_LINE_NUMBER) continue

    lines++
  }
})

await new Promise(resolve => stream.once('end', resolve))

export default lines
