
// get pool manager by hand
import Pool from '#orbital/sys/services/pool.js'
let pool = new Pool()

// get http
let http = await pool.load({urn:"*:/sys/services/http",args:{port:8080,resources:import.meta.url}})

// get network
let net = await pool.load({urn:"*:/sys/services/net",args:{server:http}})

// get db 
let db = await pool.load({urn:"*:/sys/services/db",args:{server:net}})

// let http run forever - todo improve
http.runforever()
