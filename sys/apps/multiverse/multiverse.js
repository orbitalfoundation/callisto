
import { mylayout, myavatar } from './multiverse_sdl.js'

import "/sys/libs/babylon.js"

export default class MyApp {

	constructor(args) {
		this.init(args)
	}

	async init(args) {

		// remember pool
		let pool = this.pool = args._pool

		// a hack to force a stable persistent uid for participants
		myavatar.uuid += "-"+this.pool.uuid
		console.log("multiverse: local instance avatar uuid is "+ myavatar.uuid)

		// also separate out the camera so it is unique per platform - todo look at networking all participant cams 
		//mycamera.uuid += "-"+this.pool.uuid

		// This is a pretend location for the namespace of the particular "room" a set of participants are in.
		this.domain = "sharespace001.someuniquedomain.com:"

		// get net
		let net = this.net = await pool.load({urn:'*:/sys/services/net'})

		// get db
		let db = this.db = await pool.load({urn:'*:/sys/services/db',args:{client:net}})

		// get view
		let view = this.view = await pool.load({urn:"*:/sys/services/view/view"})

		// echo db traffic to view; a key design feature of orbital is to dynamically bind services together
		db.route(view)

		// synchronize to server state; basically get a fresh copy of all state
		db.synchronize()

		// publish any local initial state (these objects may be superceded) - todo arguably push only to server?
		db.merge(mylayout,true,this.domain)

		// get view events
		this.view.route(this)

		// adjust cam before starting - todo improve this flow
		this.avatar_movement_handler({},false)

	}

}
