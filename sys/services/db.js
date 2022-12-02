
export default class DB {

	constructor(args) {
		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.urn = args.urn
			this._pool = args._pool
		}
		this.routes = []
		this.storage = {}

		if(args && args.server) {
			this.server = args.server
			this.server.route(this) // send inbound traffic to db
			console.log("db is a server")
			return
		}

		if(args && args.client) {
			this.client = args.client
			this.client.route(this) // send inbound traffic to db
			console.log("db is a client")
			return
		}

		// have database run behaviors on a timer for now
		setInterval(this.update.bind(this),10)

	}

	route(args) {
		this.routes.push(args)
	}

	async resolve(args) {

		if(!args) throw "db: no args"

		if(args.server || args.client) {
			// ignore these config props for now- todo improve
			return
		}

		if(!args.data) {
			// all remaining packets should be mundane commands
			console.error("db: bad data")
			console.log(args)
			return
		}

		if(args.data.synchronize) {
			// got a request to sync - this is a server side only command
			if(this.server) {
				let values = Object.values(this.storage)
				console.log("db resolve: server is sending all data - obj count is " + values.length)
				this.server.resolve({data:values,socket:args.socket})
			}
			return
		}

		// otherwise assume it is data - merge it
		this.merge(args.data,false)
	}

	synchronize() {
		// start syncing
		// - if is a client then tell server to specially send everything
		if(this.client) {
			this.client.resolve({data:{synchronize:true}})
		}
	}

	///
	/// Can ingest individual items, arrays or trees
	/// Also stuffs a domain in front - TODO this needs more study
	/// Flattens trees and turns their enumeration of child objects into an enumeration of keys
	///

	async merge(data,local=true,domain="") {
		await this._fragment_recurse(data,local,domain)
	}

	async _fragment_recurse(fragment,local=true,domain="") {

		// a convenience feature for arrays
		if(Array.isArray(fragment)) {
			for(const frag of fragment) {
				await this._fragment_recurse(frag,local)
			}
			return
		}

		// bad fragment?
		if(!fragment || !fragment.uuid) {
			console.error("db: bad fragment?")
			console.log(fragment)
			return
		}

		// children is a convenience concept not actually stored in db - pull it out
		let children = fragment.children
		delete fragment.children

		// save fragment itself
		await this._fragment_merge(fragment,local)

		// as a convenience concept flatten children with citation of parent AND rename children
		// TODO this entire concept could be perhaps moved up to user land as a cleanup function?
		if(children) {
			for(const child of children) {
				child.parent_uuid = fragment.uuid
				child.uuid = `${fragment.uuid}/${child.id}`
				await this._fragment_recurse(child,local)
			}
		}

	}

	async _fragment_merge(fragment,local=true) {

		let current = {}

		// merge with previous?
		let prev = this.storage[fragment.uuid]
		if(prev) {
			let updated = fragment.updated || 0
			// discard if specifically marked as older
			if(parseInt(prev.updated) > updated ) {
				console.log("db: ignoring old frag " + fragment.uuid + " because " + prev.updated + " > " + updated )
				return
			}
			// update fields - note this does not handle field deletions altogether
			for (const [key, value] of Object.entries(fragment)) {
				prev[key] = value
			}
			current = prev
			current.updated = Date.now()
		}

		// else save fresh
		else {

			// set fields
			for (const [key, value] of Object.entries(fragment)) {
				current[key] = value
			}

			// set created/updated
			current.updated = Date.now()
			current.created = current.created ? current.created : current.updated

			// store each item
			this.storage[current.uuid]=current
			//console.log("db: remembering " + current.uuid)
		}

		// deal with associated behaviors
		await this.load_ecs(current)

		// playing with various ways to network dirty state
		// in this approach networking is a special route and i can do fine-grained decisions therefore

		// echo traffic to other observers (aside from network)
		// note - trying an idea of only writing vetted traffic to observers such as the view
//		if(current.authoritative || current.speculative_networking) {
//			if(current.speculative_networking && this.routes.length) {
//				console.log("db: allowing speculative echo of " + current.uuid)
//			}
			for(const route of this.routes) {
				//console.log("db: sending to routes " + current.uuid)
				await route.resolve({data:current})
			}
//		}

		// if this db is a client and the data was not from a server then send it to the server
		if(this.client && !current.authoritative) {
//			this.client.resolve({data:current})
		}

		// mark as authoritative or not
		current.authoritative = this.server ? true : false

		// if this is a server then send changes to the client
		// technically i could track what each client already has and not send existing state - TODO
		if(this.server) {
			console.log("sending to client " + current.uuid)
//			this.server.resolve({data:current})
		}

	}

	// although i have a generic pool manager outside the db - i want a performant ecs system inside the db
	handlers = {
	}

	async load_ecs(node) {

		// any behaviors?
		if(!node.ecs) return

		// associate each
		for(let path of node.ecs) {
			let handler = this.handlers[path]
			if(!handler) {
				let blob = await import(path)
				if(!blob) {
					console.error("db: cannot load ecs " + path)
					return
				}
				// make it
				let construct = blob.default
				if(!(construct instanceof Function)) {
					console.error("db: bad agent" + path)
					return
				}
				handler = new construct(this)
				handler.nodes = []
				this.handlers[path] = handler
			}
			handler.nodes.push(node) // todo - must pop on delete
		}

	}

	async update() {


		// visit all handlers and pass each one all nodes

		for(let handler of Object.values(this.handlers)) {
			if(handler.update) {
				handler.update(this,handler.nodes)
			}
		}

		// for now mark and sweep dirty nodes to publish
		// TODO rather than doing a merge on data that is already 'in' the db just write to the listeners
		// TODO later i think the data itself could mark which routes to publish to? revisit nov 15 2022

		for(let node of Object.values(this.storage)) {
			if(node.dirty) {
				node.updated = Date.now()
				delete node.dirty
				for(const route of this.routes) {
					//console.log("db: sending to routes " + current.uuid)
					await route.resolve({data:node})
				}

			}
		}

	}

	queryFastByUuid(uuid) {
		// this is intended to be an in ram query with no await
		let item = this.storage[uuid]
		return item ? [item] : []
	}

	queryFastByHash(args) {
		// this is intended to be an in ram query with no await
		let matches = []
		for(let item of Object.values(this.storage)) {
			let match = true
			for(let [key,value] of Object.entries(args)) {
				if(args[key] != item[key]) match = false
			}
			if(match) matches.push(item)
		}
		return matches
	}
}

/*


let db_indexed = {}
let db_created = {}
let db_updated = {}

const onewayCompare = (obj1, obj2) => Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj1[key] === obj2[key] )

///
/// more sophisticated merge tests
///

function db_merge(changes) {
	// must be valid change list
	let uuid = changes ? changes.uuid : 0
	if(!uuid) return 0
	// must have contributed some change to the global state
	let prev = db_indexed[uuid]
	if(prev && onewayCompare(changes,prev)) return 0
	// set created and updated
	db_updated[uuid]=Date.now()
	if(!db_created[uuid]) db_created[uuid]=db_updated[uuid]
	// do a merge
	let merged = db_indexed[uuid] = { ...(prev?prev:{}),...changes}
	// return whole set
	return merged
}

///
/// A query may be one hash to match or an array of hashes to match
/// If an uuid is passed then always ONLY matches on that UUID
/// Results are always returned as an array
///

function db_query(queries) {
	let results = []
	if(queries) {
		if(!Array.isArray(queries)) queries = [queries]
		queries.forEach(match=>{
			delete match.offset
			delete match.limit
			delete match.event
			delete match.orderby
			console.log(match)
			data.forEach(item=>{
				let success = true
				for (const [k,v] of Object.entries(match)) {
					if(item[k] != v) {
						success = false;
						break;
					}
				}
				if(success) {
					results.push(item)
				}
			})
		})
	}
	return results
}



*/



