/*

World Picker

Allow participants to see a globe and then pick an area on that globe to go to.

The idea here is to act as a primary navigation mechanic.

*/

function lltoxyz(lon=0,lat=0,R=0.5) {
	//lon = lon*3.1459/180 + 1
	//lat = lat*3.1459/90
	let xyz = [ R * Math.cos(lat) * Math.cos(lon), R * Math.cos(lat) * Math.sin(lon), R * Math.sin(lat) ]
	console.log(xyz)
	return xyz
}

let mylayout = [

	{ kind:"scene", uuid:"scene1", },

	{
		      uuid: "mycamera",
		      kind: "camera",
		       xyz: [0,0,2],
		    lookat: [0,0,0],
		networking: false,
		arcrotatecamera: true,
		rot:0
	},

	{
		     uuid: "mylight1",
		     kind: "light",
		  network: "static",
		      xyz: [4,4,4],
		      dir: [0,-1,1],
		intensity: 1.0,
		  shadows: true,
	},

	{
		    uuid: "myplanet",
		    kind: "gltf",
		     xyz: [0,0,0],
		     ypr: [0,0,0],
		     art: "/sys/assets/hexagon_planet/scene.gltf",
		pickable: true,
		children: [

			{
				    id: "newyork",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(0,0,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
				pickable: true,
			},

			{
				    id: "venice",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(0,3.1459/2,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
				pickable: true,
			},

			{
				    id: "malta",
				    kind: "sphere",
				    material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(0,3.1459,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
				pickable: true,
			},


			{
				    id: "arctic",
				    kind: "sphere",
				    material: { rgba:0xffffff88,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(3.1459/2,0,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
				pickable: true,
			},

			{
				    id: "antarctic",
				    kind: "sphere",
				    material: { rgba:0xff88ffff,alpha: 0.5, emissive:0xffffffff },
				     xyz: lltoxyz(-3.1459/2,0,0.5),
				     ypr: [0,0,0],
				     whd: [0.1,0.1,0.1],
				pickable: true,
			},

		]
	},


]

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

		// rotate camera
		setInterval(this.rotator.bind(this),100)
	}

	resolve(e) {
		if(e.event == "pick") {
			console.log("picking " + e.fragment.uuid)
		}
	}


	rotator() {

		let planet = mylayout[3]
		planet.ypr[1] += 0.003
		planet.updated = Date.now()
		this.db.merge(planet,true,this.domain)
		return

		/*
		let camera = mylayout[1]

		camera.rot = camera.rot + 0.1
		let rot = BABYLON.Quaternion.FromEulerAngles(0,0,camera.rot)
		let vec = new BABYLON.Vector3(3,0,3).rotateByQuaternionToRef(rot,BABYLON.Vector3.Zero())
		camera.xyz = [vec.x,vec.y,vec.z]
		camera.updated = Date.now()
		this.db.merge(camera,true,this.domain)
		*/
	}


}
