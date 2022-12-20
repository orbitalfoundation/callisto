
//import crypto from 'crypto'

// https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
function uuidv4() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

//function uuidv4() {
//	if(typeof crypto !== 'undefined') {
//		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) )
//	}
//	return 0
//}


///
/// Factory
///
/// A helper class to force load a service off disk or net
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

export default class Factory {

	server = false;
	domain = null;
	uuid = 0;
	counter = 0;
	_services_uuids = {};
	_services_urns = {};
	_services_canonical = {};

	constructor(blob = null) {

		// register a special resolver method for traffic intended for the pool itself - not needed yet
		//this._service_instances = { uuid:"*:/sys/services/pool",resolve:this.inner_resolve.bind(this)})

		// any initial configuration?

		if(blob & typeof blob === 'object') {
			this.server = blob.server || false
			delete blob['server']

			this.domain = blob.domain || null
			delete blob['domain']

			this.uuid = blob.uuid || null
			delete blob['uuid']
		}

		// clients need some kind of uuid to disambiguate themselves - it is also preferable if they are stable between sessions
		if(!this.uuid) {
			if(typeof localStorage !== 'undefined') {
				if(localStorage.uuid && typeof localStorage.uuid === 'string' && localStorage.uuid.length > 0) {
					this.uuid = localStorage.uuid
				} else {
					this.uuid = localStorage.uuid = uuidv4()
				}
			} else {
				this.uuid = uuidv4()
			}
		}

		if(!this.uuid) {
			let err = "POOL: has no uuid"
			console.error(err)
			throw err
		}

	}

	///
	/// fetch(urn, dynamic, donotcache, suuid)
	///
	///	Get a handle on a running service given a @uuid to that existing service and or a @urn for a fresh instance
	///
	/// Typically if a new service is created then it will be available at the @uuid you supplied if any
	///
	/// Todo:
	///
	///		- support wasm
	///		- support b64 blobs
	///		- support singletons and multiple instancing more distinctly; sometimes we *do* want a clone
	///		- support do not cache?
	///		- support any kind of restricted namespace and security policy for service manufacturing
	///			- especially when we support making clones of canonical services with unique uuids
	///

	async _fetch(blob) {

		// sanity check
		if(!blob || typeof blob !== 'object') {
			let err = "POOL::FACTORY::load() bad command"
			console.error(err)
			throw err
		}

		// try return by uuid first if any
		// todo - will need security restrictions since it could belong to somebody else
		let service = blob.uuid ? this._services_uuids[blob.uuid] : null
		if(service) {
			return service
		}

		// try return by urn
		if(!blob.urn) {
			return null
		}
		service = this._services_urns[blob.urn]
		if(service && !service.MULTIPLYINSTANCED) {
			return service
		}

		// specifically do not create (sometimes a caller wants to find only)
		if(blob.DONOTCREATE) {
			return null
		}

		// or try make
		service = await this._manufacture(blob)
		return service
	}

	/// make a service on demand

	async _manufacture(blob,storage=true) {

		// sanity check
		if(!blob || typeof blob !== 'object' || !blob.urn) {
			let err = "POOL::FACTORY::_manufacture() bad request"
			console.error(err)
			console.error(blob)
			throw err
		}

		// split the resource locator
		// the notation is domain:path where domain can be * for localhost
		// for now just handle localhost - todo improve

		let urn = blob.urn
		let parts = urn.split(':')
		let domain = 0
		let path = parts[parts.length-1]

		// fetch class if already loaded

		let construct = this._services_canonical[path]

		// otherwise manufacture

		if(!construct) {

			let module = null
			if(blob.raw) {
				let b64module = "data:text/javascript;base64,"+btoa(args.raw)
				module = await import(b64module)
			} else {
				module = await import("../.."+path+".js")
			}

			if(!module) {
				let err = "POOL::FACTORY newly loaded service is missing the resolve() channel method " + path
				console.error(err)
				throw err
			}

			// TODO may later handle multiple blobs per file - for now MUST be a new class decl
			construct = module.default
			if(!(construct instanceof Function)) {
				let err = "POOL::FACTORY illegal - not a class at path= " + path
				console.error(err)
				throw err
			}

			this._services_canonical[path] = construct
		}

		// grant a uuid or use a supplied one
		// - todo - must avoid uuid conflicts and also some uuid areas are locked down by owners

		let uid = blob.uid || "nobody"
		let uuid = blob.uuid ? blob.uuid : `${this.uuid}${path}/?counter=${++this.counter}`
		let pool = this

		console.log("POOL::FACTORY instancing service urn="+urn+ " uuid="+uuid)

		// instance service now
		// expand supplied blob if any or use default - including a back channel to this pool manager
		// todo - maybe a special method should get the blob? debate
		// it is super helpful to get the blob in the constructor... the receiver can ignore the command

		let config = {
			uid,
			uuid,
			urn,
			pool,
			blob,
		}
		let service = new construct(config)

		// todo i removed the resolve() constraint for now
		// services need a resolve method to be compliant with the concept of a channel; this is a poor mans class inheritance hack
		if(!service) { //} || !service.resolve || !(service.resolve instanceof Function)) {
			let err = "POOL::FACTORY newly loaded service failed to load at path = " + path
			console.error(err)
			throw err
		}

		// save
		this._services_urns[service.urn] = service
		this._services_uuids[service.uuid] = service

		// return service handle 
		return service
	}

	/// let go and exit

	release(service) {
		let err = "POOL::FACTORY release() is tbd"
		console.error(err)
		// throw err
	}


/*
	///
	/// _destructure()
	///
	/// given a command as json args peel it apart and try call raw native methods if any
	///

	async _destructure(service,args) {

		// preferentially try call the raw destructured interface
		if(service && args.command && service[args.command] instanceof Function) {
			return await service[args.command](args)
		}

		// or pass args to service that we built if there are any args and if there is a resolver
		if(service && service.resolve && service.resolve instanceof Function && args) {
			return service.resolve(args)
			return null
		}

		return null
	}
*/

/*
	/// handle load request as a resolve message ...

	async resolve(command=0) {
		switch(command ? command.command : "error") {
			case "load":
				return this.load(command)
			case "error":
			default:
				break
		}
		let err = "POOL: inner resolve invalid command"
		console.error(err)
		console.error(command)
		throw err
	}
*/

}

