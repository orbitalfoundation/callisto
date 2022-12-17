
//
// An Orbital Server Side - Nov 2022 @anselm
//
// Run by hand say with 'node server.js'
//

// pick a unique name to run your instance to avoid conflicts with other instances
let uuid = "orbital.foundation"

// figure out port
let port = process.env.PORT || 8080

// find current base of files
let path = process.cwd() || "./"

// set paths to serve
let resources = [path,"./sys/apps/website"]

// get a pool manager
import Pool from '#orbital/sys/services/pool.js'
let pool = new Pool({server:true,uuid})

// get http service and build a post api route to the pool channel
let http = await pool.fetch({urn:"*:/sys/services/http",port,resources})
http.route(pool,"/sys/services/pool")

// build a server side database as a convenience for the demos
if(true) {

	// get long sockets net service and route all traffic to the pool channel also
	let net = await pool.fetch({urn:"*:/sys/services/netserver"})

	// get server db as a convenience utility for remote clients
	let db = await pool.fetch({urn:'*:/sys/services/db'})

	// route all traffic from net to the pool or to db... either way is the same
	net.route(db)

	// echo db traffic to net... note there is loopback prevention... todo later clients should specify a filter
	db.route(net)
}

// runs forever...
console.log("webserver: running forever")
