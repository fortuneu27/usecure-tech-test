import { fileURLToPath } from 'node:url'
import { join, dirname } from 'node:path'
import { Low } from 'lowdb'
import lodash from 'lodash'
import {JSONFile} from "lowdb/node"

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, '../../db.json')

// This allows for Lodash to be used for fetching data in a nicer way
// Like: db.chain.get('posts').find({ id: 1 }).value()
// Note you have to use .chain - You also aren't required to use this at all.
class LowWithLodash extends Low {
	chain = lodash.chain(this).get("data")
}

const adapter = new JSONFile(file)
const db = new LowWithLodash(adapter, { users: [], courseResults: [] })
await db.read()

export default db
