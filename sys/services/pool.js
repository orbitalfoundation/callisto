
///
/// Pool Manager
///
/// This is an inter-service message router and also can load, instance and manage other services.
///
/// Message payload
///
///		uuid: -> reserved field -> a specific service instance (must provide this OR a service)
///		target: -> reserved field -> a unique identifier path for the service to talk to
///		...		 -> other arguments for the service (passed through but otherwise ignored)
///
/// Service identifier is a urn like identifier:
///
///		[domain segment]:[service name]:[optional checksum]:[optional signature]
///
///		domain segment: -> a specific domain such as 'orbital.github.io' or '*' or nothing -> meaning nearest upstream provider
///
///		service name: -> a locally unique name for a service, this translates to an actual file path in current architecture
///
/// Notes / TODO:
///
///		We need package signing: https://blog.tidelift.com/the-state-of-package-signing-across-package-managers
///

export default class Pool {

	uuid = 0;

	constructor(args=0) {

		// is server side?
		if(typeof process !== 'undefined') {
			this.server = true
			console.log("POOL: starting server side - PATH: "+process.cwd()+" - TIME: "+(new Date()))
		} else {
			this.server = false
			console.log("POOL: starting client side - TIME: "+(new Date()))			
		}

		// setup pool registry for later service tracking - pool service itself reserves name 'pool'
		this.counter = 0
		this._service_canonical = {}
		this._service_instances = { "pool": this }

		// async
		this.init(args)
	}

	async init(args) {

		// configure if any - async
		await this._configure()

		// pass args through on through if any
		if(args)this.resolve(args)

	}

	///
	/// resolve() - messaging gateway for services in general; this is a non-mandatory convention
	///

	async resolve(args) {

		if(!args || typeof args !== 'object' || !args.command) {
			throw "POOL: bad command"
		}

		switch(args.command) {
			case "load":
				return await this.load(args)
			default:
				break
		}

		throw "POOL: unknown command"
	}

	_uuidv4() {
		if(typeof crypto !== 'undefined') {
			return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) )
		}
		return 0
	}

	async _configure() {

		// fetch user config - mostly to done to set a domain which is used as a uuid for the pool instance
		//import config from '../config/pool-config.js' assert {type: 'json'}

		let path = '../config/pool-config.js' 
		let blob = await import(path)
		let args = blob.default

		if(args && args.domain && this.server) {
			this.uuid = args.domain
			if(typeof localStorage !== 'undefined') {
				localStorage.uuid = this.uuid
			}
		} else {
			if(typeof localStorage !== 'undefined') {
				if(localStorage.uuid) {
					this.uuid = localStorage.uuid
				} else {
					this.uuid = localStorage.uuid = this._uuidv4();
				}
			} else {
				this.uuid = this._uuidv4();
			}
		}
		console.log("POOL: local uuid = " + this.uuid)
	}

	///
	/// load(urn, dynamic, donotcache, suuid)
	///
	/// Create or find a service and return a channel to it.
	///
	/// urn = disk or net location of service code blob (javascript or wasm atm)
	///	dynamic = do not use the urn as the service uuid (suuid)
	/// donotcache = do not add to a table of service instances that have been created
	/// donotcreate = ...
	/// uuid = use this name for finding and storing service instance for later lookup
	/// args = any args for found service (optional)
	///
	/// notes:
	///
	/// + services right now are a single vanilla javascript file on disk or net that is exporting a single class decl
	///   later singletons will be supported
	///   later wasm will be supported
	///
	/// + Must pass the token 'dynamic' if you do not want to use the service name as the instance name
	///   Dynamic means a service is going to be built from scratch even if another copy exists
	///
	/// + A service instance often acts as a facade to shared state (aka a singleton)
	///
	/// + A service gets args passed to its constructor AND its resolve() method
	///   Args can be handled anywhere but the convention is to handle them in resolve()
	///
	/// + Conceptually a service constructor result should really be considered a 'channel' or proxy
	///
	///

	async load(args) {

		if(!args || typeof args !== 'object' || !args.urn) {
			throw "POOL::load() bad command"
		}

		// by default services are singletons - mark them dynamic if you want to force another copy
		if(args.dynamic) {
		} else {
			args.uuid = args.urn
		}

		// look up service?
		let service = args.uuid ? this._service_instances[args.uuid] : 0

		// make service?
		if(!args.donotcreate) {
			service = await this._manufacture(args)
			if(!args.donotcache) {
				this._service_instances[service.uuid] = service
			}
		}

		// pass service args onwards to service if any (this is just a convenience)
		if(service && args.args) {
			await this._destructure(service,args.args)
		}

		// return service - conceptually this should be thought of as returning a channel
		return service
	}

	///
	/// Release a service handle - not really used yet TBD
	///

	release(service) {
		console.error("POOL: release service TBD")
		throw "POOL: release is not written yet"
	}

	///
	/// _destructure()
	///
	/// Try to find the command/method and call it
	/// + By convention services should have a resolve() interface - effectively a channel or proxy
	/// + But it seems nice to allow real methods ...
	/// + I could further unroll the arguments as well but for now a hash blob will do... TODO
	///

	async _destructure(service,args) {

		// pass args to service that we built if there are any args and if there is a resolver
		if(service && service.resolve && service.resolve instanceof Function && args) {
			service.resolve(args)
			return null
		}

		// or try brute force it
		if(service && args.command && service[args.command] instanceof Function) {
			return await service[args.command](args)
		}

		return null
	}

	///
	/// Force load a service off disk or net
	///
	/// Todo later support multiple services per file (right now I always return one service).
	/// Todo later support singletons? (static class instances that get only ever instanced once).
	/// Todo it is debatable if I *ever* want to support re-using an existing service.
	///
	/// Expectations around services:
	///		+ the assumption is that there is a loadable service at a path specified by the load url path
	///		+ the new service is effectively a separate thread now managed locally
	///		- later verify checksums todo
	///		- later handle remote paths todo
	///		- deal with versioning todo
	///
	/// Args may include
	///		uid -> user id which later will be used for perms
	///		urn -> path to service
	///		other -> other arguments to pass through
	///
	/// Callers typically call this in two scenarios:
	///		1) when they want to specifically message an instance of a service
	///		2) when they want to cause to exist a service and then also message it
	///
	/// What does it mean to open a connection to a service?
	///		1) Find or make the service
	///		2) Remember the service if new
	//		3) Run the service if new
	///		4) Return the service channel handle (my convention is to have the service and the channel be the same class instance)
	///
	/// What is a service?
	///		1) Ultimately a blob of code that does work
	///		2) Typically loaded dynamically once at least
	///		3) Must have an ability to receive messages (subclasses the channel concept)
	///		4) May be capable of publishing messages to observers and possibly with a filter as well (subclasses listener concept)
	///

	async _manufacture(args,storage=true) {

		// sanity check
		if(!args || typeof args !== 'object' || !args.urn) {
			let err = "POOL:_manufacture() bad request"
			console.error(err)
			console.error(args)
			throw err
		}

		// split the resource locator
		// the notation is domain:path where domain can be * for localhost
		// for now just handle localhost - todo improve

		let urn = args.urn
		let parts = urn.split(':')
		let domain = 0
		let path = parts[parts.length-1]

		// fetch class if already loaded

		let construct = this._service_canonical[path]

		// otherwise fetch class

		if(!construct) {

			let blob = await import("../.."+path+".js")
			if(!blob) {
				let err = "POOL: newly loaded service is missing the resolve() channel method " + path
				console.error(err)
				throw err
			}

			// TODO may later handle multiple blobs per file - for now MUST be a new class decl
			construct = blob.default
			if(!(construct instanceof Function)) {
				let err = "POOL: illegal - not a class at path= " + path
				console.error(err)
				throw err
			}

			this._service_canonical[path] = construct
		}

		// grant each service instance a unique uuid
		// TODO it would be nice to have this be globally unique - combining a local kernel instance uuid + service id
		// TODO revise idea of user ids for security later - may want to fiddle with this naming

		let uid = args.uid || "nobody"
		let service_uuid = this.uuid + ":" + path + "/?instance=" + ++this.counter

		console.log("POOL: instancing service urn="+urn+ " uuid="+service_uuid)

		// instance service now
		// expand supplied args if any or use default - including a back channel to this pool manager
		// todo - maybe a special method should get the args? debate
		// it is super helpful to get the args in the constructor... the receiver can ignore the command

		let sargs = args.args || {}

		sargs.uid = uid
		sargs.uuid = this.uuid
		sargs.service_uuid = service_uuid
		sargs.urn = urn
		sargs._pool = this
		let service = new construct(sargs)

		// todo i removed the resolve() constraint for now
		// services need a resolve method to be compliant with the concept of a channel; this is a poor mans class inheritance hack
		if(!service) { //} || !service.resolve || !(service.resolve instanceof Function)) {
			let err = "POOL: newly loaded service failed to load at path = " + path
			console.error(err)
			throw err
		}

		// return service handle 
		return service
	}
}
