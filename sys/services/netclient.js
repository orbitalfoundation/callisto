
export default class NetClient {

	constructor(blob) {
		if(blob) {
			this.uid = blob.uid
			this.uuid = blob.uuid
			this.urn = blob.urn
		}
		this.routes = []
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
			for(let handler of this.routes) handler(data)
		})
	}

	///
	/// route()
	///
	/// register a channel that will catch traffic
	///

	route(route) {
		if(typeof route === 'object' && route.resolve) {
			this.routes.push(route.resolve.bind(route))
		} else if(typeof route === 'function') {
			this.routes.push(route)
		} else {
			let err = "netclient: bad route"
			console.error(err)
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
		// todo - decide if this is the right place and time to care about objects or if it should be up to the user
		if(blob.data) {
			let changelist = []
			for(let item of blob.data) if(!item.DONOTNETWORK) changelist.push(item)
			blob.data = changelist
		}
		this.socket.emit("data",blob)
	}

}

