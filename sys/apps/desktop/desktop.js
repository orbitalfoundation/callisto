
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*

** Metaverse Demo OVERVIEW **

This is an example of an application written in Orbital. It demonstrates a multiplayer VR world.

This is an example of an app written in Orbital. The key things I'm showing off here are:

1) This document effectively is a manifest, it defines other services we want to load and run.

2) It is 'script friendly' in that it uses ordinary javascript to handle event callbacks from other services.

3) I am exercising a declarative notation for describing 3d layout.

4) I showcase networking and persistence

** DETAILS **

In this demo I manufacture a 3d view of a virtual desktop that is multi-participant.
Viewers can spawn sample applications from a menu.

The lower level view engine is setup so that Y+ is up, and X+ is to the right and Z+ is forward.
There two separate scenes with two cameras; one scene is for the 3d avatars and the other is for 2d buttons.

Database assets all have a world global GUID.
The underyling database model is setup so that the server grants itself an explicit GUID.
The clients grant themselves a localstorage GUID that is not highly persistent.

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///
/// SCENE 1
///
/// This app has two scenes. This scene is for the 3d avatars and default assets.
/// This scene is declared in my own platform neutral "scenario definition language".
/// The goal of this grammar is to have a portable, reasonably expressive way to describe 3d layouts.
/// These assets are poured into a shared database that the view observes and that the server interacts with.
/// Because the server is persistent, it may ignore these (older) assets when the assets arrive at the server.
/// The server distinguishes between older and newer assets by looking the "created" and "updated" timecode if set.
///
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// camera - avatar will take over camera
// - todo we do not want to network the cam at all really
//

let mycamera = {
	      uuid: "/mycamera",
	      kind: "camera",
	       xyz: [2,2,5],
	    lookat: [0,0,0],
	networking: false,
	 universal: true
}

//
// lights
//

let mylight_positional = {
	     uuid: "/mylight1",
	     kind: "light",
	  network: "static",
	      xyz: [4,4,4],
	      dir: [0,-1,1],
	intensity: 1.0,
	  shadows: true,
}

let myux = {
	    uuid: "/myux/",
	    kind: "textarea",
	 network: "dynamic",
}

////////////////////////////////////////////////////////////////////////////////////////////////
///
/// SCENE 2
///
/// This scene is using a 3d layout to produce a 2d view using an orthogonal camera.
/// It has buttons and other interactions that users can click on.
///
///
///
////////////////////////////////////////////////////////////////////////////////////////////////

let scene2_camera = {
	      uuid: "/scene2_camera",
	      kind: "camera",
	       xyz: [0,0,5],
	    lookat: [0,0,0],
	     scene: "scene2",
	     ortho: true,
}

let scene2_fish = {
	    uuid: "/scene2_fish0",
	    kind: "group",
	   scene: "scene2",
	     xyz: [-4.2,3.8,0],
	children: [
    	{
			      id: "model",
			    kind: "gltf",
			     ypr: [0,1.6,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/pomacanthus/scene.gltf",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,-0.1],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,-0.1],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}

let scene2_car = {
	    uuid: "/scene2_car",
	    kind: "group",
	   scene: "scene2",	// TODO can we inherit this or not specify?
	     xyz: [-4.2,2.5,0],
	children: [
		{
			      id: "model",
			    kind: "glb",
			     ypr: [0,0,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/lowpolytruck/model.glb",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}

let scene2_globe = {
	    uuid: "/scene2_globe",
	    kind: "group",
	   scene: "scene2",	// TODO can we inherit this or not specify?
	     xyz: [-4.2,1.2,0],
	children: [
		{
			      id: "model",
			    kind: "glb",
			     ypr: [0,0,0],
			     xyz: [0,0,0],
			     art: "/sys/assets/hexagon_planet/scene.gltf",
			pickable: true,
			   scene: "scene2",
		},
		{
			      id: "backdrop",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.1,1.1,0.02],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffffffff },
		},
		{
			      id: "border",
			    kind: "box",
			 network: "static",
		         xyz: [0,0,0],
			     whd: [1.2,1.2,0.01],
			pickable: true,
			   scene: "scene2",
			material: { rgba:0xffff00ff },
		}
   ]
}


let scene2_light = {
	     uuid: "/scene2_light",
	     kind: "light",
	  network: "static",
	      xyz: [0,0,0],
	      dir: [0,0,-1],
	intensity: 1.0,
	    scene: "scene2",
}

///////////////////////////////////////////////////////////////////////////////////////

let mylayout = [

	{ kind:"scene", uuid:"scene1", },

	mycamera,
	mylight_positional,
	myux,

	{ kind:"scene", uuid:"scene2", },

	scene2_camera,
    scene2_light,
    scene2_fish,
    scene2_car,
    scene2_globe,

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

	}

	resolve(e) {

		if(e.event == "pick") {
			console.log("picking " + e.fragment.uuid)
			if(e.fragment.uuid.includes("fish")) {
				alert("cloud reef app picked")
			}
			if(e.fragment.uuid.includes("car")) {
				location.href = "/"
			}
			if(e.fragment.uuid.includes("globe")) {
				location.href = "/sys/apps/zonepicker"
			}
		}

		// keyboard

		if(e.event == "console") {
			let fragment = eval('(' + e.text + ')')
			if(fragment) {
				console.log("desktop: console event")
				console.log(fragment)
				this.db.merge(fragment,true,this.domain)
			} else {
				console.log("bad eval")
			}
		}

		// - tick events
		// - collision events

	}

}
