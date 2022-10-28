
// load pool service by hand

import Pool from './sys/services/pool.js'

let pool = new Pool()

// run default app

pool.load({urn: "*:/sys/apps/multiverse/multiverse"})
