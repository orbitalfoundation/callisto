
export default class NetServer {

	constructor(blob) {
		if(blob) {
			this.pool = blob.pool
		}
		this.routes = []
		this.loading = this._run_server()
	}

	async _run_server() {
		console.log("NET: started as server")
		let http = await this.pool.fetch({urn:"*:/sys/services/http",DONOTCREATE:true})
		if(!http) {
			let err = "net: http must exist"
			console.error(err)
			throw err
		}
		let modules = await import("socket.io")
		this.server = new modules.Server(http.getHttpServer())
		this.server.on('connection', this._inbound_traffic.bind(this) )
	}

	_inbound_traffic(socket) {
		// traffic from remote clients is echoed out to local listeners - write an originator hint into the traffic
		console.log("net: server got fresh connection from client socket id="+socket.id)
		socket.on('data', data => {
			data.socketid = socket.id
			for(let route of this.routes) {
				route(data)
			}
		})
	}

	///
	/// route()
	///
	/// register a channel that will catch traffic
	///

	route(route) {
		if(typeof route === 'object' && route.resolve) {
			route = route.resolve.bind(route)
			this.routes.push(route)
			return route
		} else if(typeof route === 'function') {
			this.routes.push(route)
			return route
		} else {
			let err = "net: bad route"
			console.error(err)
			throw err
		}
		return null
	}

	///
	/// resolve()
	///
	/// bridge local traffic over to the remote client end point - typically avoid echoing back to receive port
	///

	async resolve(blob) {
		if(this.loading) {
			//console.warn("server: waiting for network to be ready")
			await this.loading
			this.loading = 0
		}
		const sockets = await this.server.fetchSockets()
		for(let socket of sockets) {
			if(blob.socketid == socket.id) {
				//console.warn("server: avoiding reecho back to source" + socket.id)
			} else {
				socket.emit("data",blob)
			}
		}
	}
}
