import { CONNECTIONS_PER_PROXY, OUTPUT_DIRECTORY, PROXY_COUNT, USER_PREFIX } from './settings.js'
import { RETRY, getUUID } from './uuid/list.js'
import total from './uuid/total.js'
import { exists } from './util/file.js'
import { resolve } from 'path'
import { createWriteStream } from 'fs'
import axios, { type AxiosError } from 'axios'
import { SocksProxyAgent } from 'socks-proxy-agent'
import chalk from 'chalk'

const PREFIX_DIGITS = Math.ceil(Math.log10(PROXY_COUNT))

const SYMBOL_ID = Symbol('id')

const agents: SocksProxyAgent[] = []

const singleAgents: SocksProxyAgent[] = []

for (let i = 0; i < PROXY_COUNT; i++) {
  const agent = new SocksProxyAgent(`socks5://${USER_PREFIX}${i}@127.0.0.1:9050`)

  agent[SYMBOL_ID] = i

  singleAgents.push(agent)
}

for (let i = 0; i < CONNECTIONS_PER_PROXY; i++) {
  agents.push(...singleAgents)
}

let skins = 0

let lastPercentage: number = 0

function logPercentage (): void {
  const percentage = Math.floor(skins / total * 100 * 100) / 100

  if (percentage === lastPercentage) return

  console.info(`${percentage}% (${skins} / ${total})`)

  lastPercentage = percentage
}

async function iterate (agent: SocksProxyAgent): Promise<boolean> {
  const id = agent[SYMBOL_ID] as number

  const idString = String(id).padStart(PREFIX_DIGITS, '0')

  const prefix = `[${idString}]`

  const uuid = await getUUID()

  if (uuid === undefined) {
    console.info(chalk.green(`${prefix} Done!`))

    return true
  }

  const path = resolve(OUTPUT_DIRECTORY, `${uuid}.png`)

  if (await exists(path)) {
    skins++

    console.info(chalk.blue(`${prefix} Skipping ${JSON.stringify(uuid)} as it already exists`))

    return false
  }

  const response = await axios.get(
    `https://minotar.net/skin/${uuid}`,
    {
      httpAgent: agent,
      httpsAgent: agent,
      responseType: 'stream'
    }
  )
    .catch((error => {
      const response = error.response

      if (response === undefined) {
        console.warn(chalk.red(`${prefix} Could not find skin of ${JSON.stringify(uuid)} (non-HTTP error), retrying...`))

        return
      }

      const status = response.status

      if (status === 404) return

      console.warn(chalk.yellow(`${prefix} Could not find skin of ${JSON.stringify(uuid)} (status code ${status}), retrying...`))

      RETRY.add(uuid)
    }) as ((error: AxiosError) => void))

  // error (catch) -> response = undefined
  if (response === undefined) return false

  skins++

  logPercentage()

  const stream = createWriteStream(path)

  response.data.pipe(stream)

  return false
}

async function loop (agent: SocksProxyAgent): Promise<void> {
  while (true) {
    const end = await iterate(agent)

    if (end) break
  }
}

for (const agent of agents) {
  void loop(agent)
}
