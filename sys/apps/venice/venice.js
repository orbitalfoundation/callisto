


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// application service 
///
/// this class will be instanced by the app loader
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

	resolve(e) {

		if(e.event == "pick") {
			console.log("picking " + e.fragment.uuid)
		}

		if(e.event == "keydown") {
			this.avatar_movement_handler(e)
		}

		// keyboard

		if(e.event == "console") {
			let json = eval('(' + e.text + ')')
			if(json) {
				console.log(json)
				this.view.resolve({command:"load",load:json})
			} else {
				console.log("bad eval")
			}
		}

		// - tick events
		// - collision events

	}

	avatar_movement_handler(args={},publish=true) {

		let uuid = myavatar.uuid
		let xyz = myavatar.xyz
		let ypr = myavatar.ypr

		// get user events and homogenously update orientation and translation

		let m = 0
		switch(args.key) {
			case 'a': ypr[1] -=0.1; break;
			case 'd': ypr[1] +=0.1; break;
			case 's': m = 0.1; break;
			case 'w': m = -0.1; break;
		}

		// get current orientation as euler and use to estimate translation target
		let rot = BABYLON.Quaternion.FromEulerAngles(...ypr)
		let vec = new BABYLON.Vector3(0,0,m).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())

		// translate as a function of direction
		if(m) {
			xyz[0] += vec.x
			xyz[1] += vec.y
			xyz[2] += vec.z
		}

		// put camera behind translation target
		vec = new BABYLON.Vector3(0,0,5).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())
		vec.x += xyz[0]
		vec.y += xyz[1] + 2
		vec.z += xyz[2]

		// todo examine:
		// in some senses the raw data was simply to populate the database ... arguably we should fetch state from there?
		// it is convenient however in the pre-amble to write to local transient state...

		myavatar.xyz = xyz
		myavatar.ypr = ypr
		myavatar.updated = Date.now()

		mycamera.xyz = [vec.x,vec.y,vec.z]
		mycamera.lookat = xyz
		mycamera.updated = Date.now()


		if(!this.db) {
			console.error("multiverse: db is not up yet... that is unusual")
		} else {

this.db.merge(myavatar,true,this.domain)
this.db.merge(mycamera,true,this.domain)

//  here i am trying to do some updates ...
// but this should not occur before those items exist
//			this.db.merge({uuid,xyz,ypr,updated:Date.now()})
//			this.db.merge({uuid:mycamera.uuid,xyz:[vec.x,vec.y,vec.z],lookat:xyz,updated:Date.now()})
		}
	}

}
