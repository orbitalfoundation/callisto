
///
/// Flo SDL Instance - TODO i decided not to use this entire service at all and just boot off of pool directly - remove?
///
/// Flo is an 'app runner' that loads and runs apps defined in a manifest - that enumerates services wired together and behaviors.
///
/// Flo provides a 'right sized' simple, high level grammar for describing applications made out of services.
/// At the moment I've decided that the right language is simply javascript.
///
/// An 'app' or 'application' in my mind is a fairly loose bucket, but has some key jobs:
///
///		+ define a collection of services (blobs of code that are loaded off disk - can be WASM or javascript right now)
///		+ define a bunch of relationships between those services (wires or routes that are explicitly built the manifest)
///		+ define any initial data passed to services
///		+ define security perms granted to services
///		+ perform actual high level procedural logic; basically the glue logic, lightweight event driven behaviors and scripting.
///


export default class Flo {

	///
	/// args can include a command but they will also be passed to a handler, so ignore commands here
	/// just peel out useful fields
	///

	constructor(args) {
		if(args) {
			this.uid = args.uid
			this.uuid = args.uuid
			this.service_uuid = args.service_uuid
			this.urn = args.urn
			this._pool = args._pool
			console.log("FLO: instance uuid is = " + this.service_uuid)
			console.log("FLO: orbital uuid is = " + this.uuid)
		}
	}

	///
	/// flo channel handler - handles incoming requests
	/// currently only handles one command called 'load' that should be a property on the passed args
	///

	async resolve(args) {

		if(args && args.command == "load" && args.urn) {

			let construct = await this._load(args.urn)

			// make the instance - passing the args
			// TODO it is debatable if args should be passed here - think about this more
			// in effect this mirrors the parent pool() but it is at a child scope...
			// flo as a whole could just be removed and replaced with the pool manager as well
			// since these things are all now service interfaces...

			args.uuid = this.uuid
			args.service_uuid = this.service_uuid
			args._pool = this._pool

			let instance = new construct(args)

			// TODO -> I'm thinking of having flo "become" the loaded app?
			// this gives the app an official message port?

			this.resolve = instance.resolve.bind(instance) // an idea ... todo debate
		} else {
			let err = "FLO: bad args"
			console.error(err)
			console.error(args)
			throw err
		}
	}

	///
	/// Load a manifest, which is a collection of one or more apps, and each app is a collection of services
	/// TODO at the moment only load file systems are supported
	/// TODO Information about this parent context must be passed to the loaded manifest
	///

	async _load(urn) {
		if(!urn) {
			let err = "Flo: no load url specified"
			console.error(err)
			throw err
		} else {
			let parts = urn.split(':')
			let domain = 0
			let path = parts[parts.length-1]
			let modules = await import("../.."+path+".js")
			if(!modules) {
				let err = "Flo: bad file " + path
				console.error(err)
				throw err
			}
			let construct = modules.default
			if(!(construct instanceof Function)) {
				let err = "Flo: bad constructor " + path
				console.error(err)
				throw err
			}
			return construct
		}
	}
}

