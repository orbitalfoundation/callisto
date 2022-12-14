
export default class NetClient {

	constructor(blob) {
		if(blob) {
			this.uid = blob.uid
			this.uuid = blob.uuid
			this.urn = blob.urn
			this.pool = blob.pool
		}
		this.routes = []
		this.filters = ["network"] // hack - later allow people to supply their own 
		this.loading = this._run_client()
	}

	async _run_client() {

		//let modules = await import('https://cdn.socket.io/4.5.3/socket.io.esm.min.js')
		let modules = await import('/sys/libs/socket.io.esm.min.js')
		let socket = this.socket = modules.io()

		socket.on('connect', data => {
			console.log("netclient: connected! localid is="+socket.id)
		})

		// inbound data is echoed to all local listeners
		socket.on('data', data => {
			data.socketid = socket.id
			for(let route of this.routes) route.resolve(data)
		})
	}

	///
	/// route()
	///
	/// register a channel that will catch traffic
	///

	route(route) {
		if(typeof route === 'object' && route.resolve) {
			this.routes.push(route)
		} else {
			let err = "db: bad route"
			console.error(error)
			console.error(route)
			throw err
		}
	}


	///
	/// resolve()
	///
	/// traffic arriving here is bridged to server
	///

	async resolve(blob) {
		if(blob.socketid) {
			//console.warn("netclient: avoiding sending data back to server")
			return
		}
		if(this.loading) {
			//console.warn("netclient: waiting for network to be ready")
			await this.loading
			this.loading = 0
		}
		if(!this.socket) {
			let err = "netclient: no socket to send to!!!"
			console.error(err)
			throw err
		}
		switch(blob.command || "default") {
			case 'route':
				{
					let service = await this.pool.resolve({uuid:blob.dest})
					if(service) {
						let route = this.route(service)
						console.log("net todo should echo cached objs!") // if net comes up before this route then must do this
					} else {
						let err = "db: cannot route"
						console.error(blob)
						throw err
					}
					return null
				}
			case "filter":
				// a hack to add crude filtering to traffic - this should be an embedded function todo
				this.filters = blob.data.filter
				break
			case "default":
			case "write":
			default:
				// todo - decide if this is the right place and time to care about objects or if it should be up to the user
				if(blob.data) {
					let changelist = []
					for(let item of blob.data) {
						if(!this.filters || !this.filters.length) {
							changelist.push(item)
						} else {
							for(let f of this.filters) {
								if(item.uuid.includes(f)) {
									changelist.push(item)
									break
								}
							}
						}
					}
					blob.data = changelist
					if(!changelist.length) return // do not send if no data
				}
				this.socket.emit("data",blob)
				break
		}
	}

}

