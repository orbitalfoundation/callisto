

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// Resources paths
///
/// - database objects that are visible over the network need to have a guid of some kind
///   for now i figure i can invent a static but global path for what later would need to be more formal
///
/// - also, an 'app' is going to be bundled with local resources, we can find the path to this manifest to help
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// for now just have a uuid prefix using dns - this allows local searchability with global uniqueness

let domain = "sharespace001.someuniquedomain.com:"

// for now find relative path for this resource by hand -> parent scope could do this but we want it before the constructor

let path = "." + (new URL(import.meta.url)).pathname.split("/").slice(0,-1).join("/")
console.log("multiverse: file path is = " + path)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// Metaverse1
///
/// This document is intended to exercise ideas in the Orbital SDL grammar:
///
///		+ Describing typical static or startup content to pass to a view service
///		+ Describing lightweight event handlers
///		+ Describing heavier weight full blown services
///		+ Exercising a view service
///		+ Exercising a network service
///		+ Producing in total a lightweight useful application; in this case a simple multiplayer 3d shared space
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// ground
//

let myground = {
	uuid: domain+"/myground",
	kind:"box",
	network:"static",
	physics:{shape:"box",mass:0},
	shadows: true,
	xyz:[0,0,0],
	whd:[4,0.01,4],
	walkable:true,
	xmaterial: {
//		rgba:0xffffffff,
//		alpha: 0.5,
		heightmap: path+"/textures/heightMap.png",
		art: path+"/textures/ground.jpg",
	},
}

//
// a sign - a 3d primitive with 2d elements
//

let mysign = {
	uuid: domain+"/mysign",
	kind:"box",
	network:"static",
	//physics:{shape:"box",mass:0.1},
	shadow:1,
	//ypr:[-1.5707,1.5707,0],
	xyz:[1,1,0],
	whd:[1,1,1],
	pickable:true,
	material: {
		alpha:0.5,
		rgba:0x964b00,
		children:[
			{
				uuid: domain+"/mysign/material/text",
				kind:"text",
				text:"hello",
				font:"bold 44px monospace",
				rgba:0xffff00ff
			}
		]
	},
}

//
// tree - a 3d primitive
// TODO would be fun to have many copies of this tree
//

let mytree = {
	uuid: domain+"/mytree",
	kind:"group",
	network:"static",
	xyz:[3,0,0],
	pickable:true,
	children:[
		{
			uuid: domain+"/mytree/trunk",
			kind:"box",
			network:"static",
			shadow:true,
			whd:[0.1,1,0.1],
			xyz:[0,0,0],
			material: { rgba:0xff20f020, },
		},
		{
			uuid: domain+"/mytree/crown",
			kind:"sphere",
			network:"static",
			shadow:true,
			whd:[1,0.5,1],
			xyz:[0,0.7,0],
			material: { rgba:0xff20f020, },
		}
	],
}

//
// camera - avatar will take over camera
// - todo we do not want to network the cam at all really
//

let mycamera = {
	uuid: domain+"/mycamera",
	kind:"camera",
	xyz:[0,2,-5],
	lookat:[0,0,0],
	networking:false
}

//
// lights
//

let mylight_positional = {
	uuid: domain+"/mylight1",
	kind:"light",
	network:"static",
	xyz:[2,2,0],
	intensity:5.0,
}

let mylight_general = {
	uuid: domain+"/mylight2",
	kind:"light",
	network:"static",
}

//
// avatar - since each player brings this - it should be locally unique
// TODO - is it a bad hack to peek at the pool for this?
//

let myavatar = {
	uuid: domain+"/myavatar",
	kind:"gltf",
	network:"dynamic",
	art: path+"/llama/",
	adjust:{xyz:[0,-0.5,0],ypr:[0,1.9,0]},
	whd:[1,1,1],
	xyz:[0,1,0],
	xyzd:[0,1,0],
	ypr:[0,0,0],
	yprd:[0,0,0],
	//	physics:{shape:"box",mass:0.1},
	//debugbox: path+"/textures/ground.jpg",
	pickable:true,
	//speculative_networking:true
}

//let myparticle_fx = {
//}

let myux = {
	uuid: domain+"/myux/",
	kind:"textarea",
	network:"dynamic",
}

let mycar = {
	uuid: domain+"/mycar",
	kind:"gltf",
//	xyz:[1,1,8],
	ypr:[0,1.6,0],
	xyz:[0,5.5,0],
	art: path+"/pomacanthus/",
	scene: 2,
	pickable:true,
//	parent_uuid: domain+"/mycamera"
}

let myfish = {
	uuid: domain+"/myfish",
	kind:"glb",
//	xyz:[1,1,8],
	ypr:[0,1.6,0],
	xyz:[0,5.5,0],
	art: "sys/models/low-poly_truck_car_drifter.glb",
	scene: 2,
	pickable:true,
//	parent_uuid: domain+"/mycamera"
}


let myplanet = {
	uuid: domain+"/myplanet",
	kind:"gltf",
	xyz:[0,2,0],
	art:path+"/hexagon_planet/",
	pickable:true,
}

let myscene = [ mycamera, mylight_general, mylight_positional, myground, mytree, myfish, myplanet, myux, myavatar ]

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

		console.log("multiverse: local instance avatar uuid is "+ myavatar.uuid)

		// get net
		let net = this.net = await pool.load({urn:'*:/sys/services/net'})

		// get db
		let db = this.db = await pool.load({urn:'*:/sys/services/db',args:{client:net}})

		// get view
		let view = this.view = await pool.load({urn:"*:/sys/services/view"})

		// echo db traffic to view; a key design feature of orbital is to dynamically bind services together
		db.route(view)

		// synchronize to server state; basically get a fresh copy of all state
		db.synchronize()

		// publish any local initial state (these objects may be superceded) - todo arguably push only to server?
		db.merge(myscene)

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

		if(this.db) {
			this.db.merge({uuid,xyz,ypr,updated:Date.now()})
			this.db.merge({uuid:mycamera.uuid,xyz:[vec.x,vec.y,vec.z],lookat:xyz,updated:Date.now()})
		}
	}

}
