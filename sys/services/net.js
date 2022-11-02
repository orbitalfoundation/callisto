
export default class Net {

	constructor(args) {
		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.urn = args.urn
			this._pool = args._pool
		}
		this.routes = []
		if(args.server) {
			this.loading = this._init_server(args.server.http)
		} else {
			this.loading = this._init_client()
		}
	}

	///
	/// send data to remote sockets
	///

	async resolve(args) {

		// ignore config traffic
		if(args.server) {
			return
		}

		// wait for network to come up
		if(this.loading) {
			await this.loading
			this.loading = 0
		}

		// if is a server then multicast
		if(this.server) {
			this.server.emit("data",args.data)
			return
		}

		// otherwise must be a client - publish to server
		if(!this.socket) {
			console.error("net - no socket to send to!!!")
			console.log(args.socket)
			return
		} else {
			this.socket.emit("data",args.data)
		}

		//} else {
			//console.log("net: unknown event")
			// these arrive on init because sometimes no args are passed ... todo reconsider if this is an error at all
			//let err = "NET: got unknown request"
			//console.error(err)
			//console.error(args)
			// throw err
		//}
	}

	route(route) {
		this.routes.push(route)
	}

	async _init_server(http) {
		if(this.server) throw "net: server already started"
		console.log("NET: started as server")
		let modules = await import("socket.io")
		this.server = new modules.Server(http)
		this.server.on('connection', (socket) => {
			console.log("server: got connection")
			socket.on('data', async data => {
				for(let route of this.routes) {
					await route.resolve({data,socket})
				}
			})
		})
	}

	async _init_client() {
		console.log("NET: started as client")
		//let modules = await import('https://cdn.socket.io/4.5.3/socket.io.esm.min.js')
		let modules = await import('/sys/libs/socket.io.esm.min.js')
		this.socket = modules.io()
		this.socket.on('data', async data => {
			for(let route of this.routes) {
				await route.resolve({data})
			}
		})
	}

}


/*



/////////////////////////////////////////////////////////////////
// web sockets for observables
/////////////////////////////////////////////////////////////////

import { Server } from "socket.io"
const io = new Server(httpserver)

io.on('connection', (socket) => {
	// - send graph on new connections - todo

	socket.on('data', (args) => {

		// request to start observing based on some query? later filter better TODO
		if(args.observe) {
			console.log("net: request to observe")
			socket.emit("data",{load:Object.values(db_indexed)})
		}

		// request to push some state to all sockets except the emitter
		if(args.load) {
			console.log("net: request to load")
			if(!Array.isArray(args.load)) {
				console.error("server: only accepts arrays of objects")
				console.error(args)
				return
			}
			let changes = []
			args.load.forEach((item)=>{
				if(db_merge(item)) {
					console.log("net: merged " + item.uuid)
					changes.push(item)
				}
			})
			if(changes.length) {
				socket.broadcast.emit("data",{load:changes})
			}
		}
	})

	// do something with disconnects i guess
	socket.on('disconnect', () => {
		console.log('Server: user disconnected')
	})
})

*/