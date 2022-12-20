
class DBSingleton {

	storage = {}

	constructor() {
		this.merge = this.merge.bind(this)
	}

	/// a helper to process scene graphs

	unroll(fragment,changelist=[]) {

		// a convenience feature for arrays
		if(Array.isArray(fragment)) {
			for(const frag of fragment) {
				this.unroll(frag,changelist)
			}
			return
		}

		// fragment must always have a uuid
		if(!fragment || !fragment.uuid) {
			let err = "db: bad fragment?"
			console.error(err)
			console.error(fragment)
			return
//			throw err
		}

		// children is a convenience concept not actually stored in db - remove from the data itself
		let children = fragment.children || null
		delete fragment.children

		// push fragment
		changelist.push(fragment)

		// as a convenience concept flatten children with citation of parent AND optionally rename children
		if(children) {
			let counter = 1;
			for(const child of children) {
				child.parent_uuid = fragment.uuid
				if(!child.uuid) {
					child.uuid = `${fragment.uuid}/${child.id||counter}`
				}
				counter++
				this.unroll(child,changelist)
			}
		}

		return changelist
	}

	merge(fragment) {

		// what time is this insertion desired at?
		let updated = fragment.updated ? parseInt(fragment.updated) : 0

		// find previous if any
		let node = this.storage[fragment.uuid] || {}

		// typically old data is totally ignored unless there is a rule to not ignore it
		if(node.updated && node.updated > updated && !fragment.UPDATEALWAYS) {
			return node
		}

		// merge fields - for now does not support deletions - todo improve
		for (const [key, value] of Object.entries(fragment)) {
			node[key] = value
		}

		// set updated at
		node.updated = Date.now()

		// set created if not set
		if(!node.created) {
			node.created = node.updated
		}

		// store
		this.storage[node.uuid]=node

		// console.log("db: saved node",node.kind,node.uuid)

		// return item
		return node
	}

	queryFastByUuid(uuid) {
		// this is intended to be an in ram query with no await
		let item = this.storage[uuid]
		return item ? [item] : []
	}

	queryFastByHash(fragment) {
		// this is intended to be an in ram query with no await
		let matches = []
		for(let item of Object.values(this.storage)) {
			let match = true
			for(let [key,value] of Object.entries(fragment)) {
				if(fragment[key] != item[key]) match = false
			}
			if(match) matches.push(item)
		}
		return matches
	}

	destroy(fragment) {
		let nodes = []
		if(fragment.uuid) {
			nodes = this.queryFastByUuid(fragment.uuid)
		} else {
			nodes = this.queryFastByHash(fragment)
		}
		for(const node of nodes) {
			delete this.storage[node.uuid]
		}
		return {status:"success"}
	}

}

let DB = new DBSingleton();

///
/// A caller created instance; which has its own caller related routes
///

export default class DBInstance {

	// if this is not set then typically this service is a singleton - only one would ever be built by pool
	MULTIPLYINSTANCED = true;

	constructor(blob) {
		if(blob) {
			this.uid = blob.uid
			this.uuid = blob.uuid
			this.urn = blob.urn
			this.pool = blob.pool
		}
		this.routes = []

		// sanity check
		if(!this.pool || !this.pool.uuid || !this.urn) {
			let err = "db: must have some kind of local pool uuid and service urn to help disambiguate where data originates from"
			console.error(err)
			throw err
		}

	}

	///////////////////////////////////////////////////////////////////////////////////////
	///
	/// route()
	///
	/// accumulate a list of handlers - return our interpretation of the naked function
	///
	///////////////////////////////////////////////////////////////////////////////////////

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
		return 0
	}

	//////////////////////////////////////////////////////////////////////////////////////
	///
	/// Handle a variety of commands from outside world - results will eventually echo out through routes
	///
	/// Expected format is a single command (does not handle arrays of commands):
	///
	///		{
	///			command: "query" or "destroy" or "write"
	///			data: {object} or [ {object},{object},{object} ]
	///		}
	///
	//////////////////////////////////////////////////////////////////////////////////////

	async resolve(blob) {
		if(!blob) {
			let err = "db: no args"
			console.error(err)
			throw err
		}
		switch(blob.command || "default") {
			case 'route':
				{

					let service = await this.pool.fetch({uuid:blob.dest})
					if(service) {
						let route = this.route(service)
						this._echo_one(route,Object.values(DB.storage))
					} else {
						let err = "db: cannot route"
						console.error(blob)
						throw err
					}
					return null
				}
			case 'sync':
				// force write a copy of all state to all parties; this could be more elegant todo
				for(const route of this.routes) {
					this._echo_one(route,Object.values(DB.storage))
				}
				break
			case 'query':
				if(blob.data.uuid) {
					return DB.queryFastByUuid(blob.data.uuid)
				} else {
					return DB.queryFastByHash(blob.data)
				}
			case 'destroy':
				return DB.destroy(blob.data)
			case 'default':
				// convenience; allow unspecified state to be write ops
				if(!blob.data) break
			case 'write':
			default:
				return this.write(blob.data,blob.socketid)
		}
	}

	queryFastByUuid(query) { return DB.queryFastByUuid(query) }
	queryFastByHash(query) { return DB.queryFastByHash(query) }

	///
	/// destroy()
	///
	/// TODO TBD - publish events to local listeners
	///

	destroy(query) { return DB.destroy(query) }

	///
	/// write()
	///
	/// write data to db but also echo local events to local listeners
	/// todo -> at the moment i explicitly pass socket info from the parent blob down here and pass it thru to help network
	///

	write(data,socketid=0) {

		// unroll data
		let changelist = []
		DB.unroll(data,changelist)

		// write items to db
		changelist.forEach(DB.merge)

		// echo to each
		for(const route of this.routes) {
			this._echo_one(route,changelist,socketid)
		}
	}

	_echo_one(route,data,socketid=0) {
		route({
			socketid:socketid || 0,
			urn:this.urn,
			command:"write",
			data
		})
	}

}


