
// Scene setup:
//
// X goes from smaller on the left to larger on the right
// Y is larger going up
// Z is positive into the screen
// -x <----> +x
// Camera is placed at a negative position
// I have some ambient lighting, and a directional light that is shining down and to the right
//

let mycamera = {
	uuid: "camera1",
	//viewable: {  // -> may be more clear to break out components into separate blocks and associate with ecs
		kind: "camera",
		arcrotatecamera: true,
		latitude: 0,
		longitude: -Math.PI/2,
		radius: 20,
		//xyz: [0,15,-15],
		xyz: [0,300,20],
		lookat: [0,0,0],
		radiusmin: 2,
		radiusmax: 500,
		//universal: true, // type of mouse control
	//},
	//ecs: [ "/sys/services/view/view.js" ]
}

let mylight = {
	uuid: "lights",
	kind: "group",
	children: [
		{
			id: "light1",
			kind: "directionallight", // "light", "pointlight", "spotlight", "hemisphericlight",
			xyz: [0,0,0],  // set if this is a point light
			dir: [0,-1,-1], // set if this is directional
			//angle: 1, // field of illumination angle for spotlight
			//exponent: 2, // decay for spotlight 
			intensity: 7.0,
		},
		{
			id: "light2",
			kind: "hemisphericlight", // "light", "pointlight", "spotlight", "hemisphericlight",
			//xyz: [0,0,0],  // set if this is a point light
			//dir: [0,-1,-1], // set if this is directional
			//angle: 1, // field of illumination angle for spotlight
			//exponent: 2, // decay for spotlight 
			intensity: 10.0,
		},
	]
}

let myavatar = {
	uuid: "avatar1",
	camera: "camera1",
	//viewable: { // -> then view can be sent each of these rather than the whole obj
		kind: "gltf",
		art: "/sys/assets/female.glb",
		adjust: {xyz:[0,0,0],ypr:[0,3.1459,0]},
		whd: [1,1,1],
		xyz: [-7.5,0,2.5],
		ypr: [0,0,0],
		pickable: true,
	//},
	ecs: [ "/sys/apps/base/avatar.js" ]
}

let myperson ={

	//viewable: {
		uuid:"person1",
		kind:"gltf",
		art: "/sys/assets/female.glb",
		adjust: {xyz:[0,0,0],ypr:[0,1.14159,0]},
		whd: [1,1,1],
		xyz: [7.5,0,2.5],
		ypr: [0,0,0],
	//}

	//people: {
		elapsed:0,
		tick:0.1,
		modulo: 168,
		schedule: {
			 11: "bldg:park",
			 13: "bldg:store",
			 15: "bldg:home",
			 33: "bldg:office",
			 41: "bldg:home",
			 57: "bldg:office",
			 65: "bldg:home",
			 81: "bldg:office",
			 89: "bldg:home",
			105: "bldg:office",
			113: "bldg:home",
			129: "bldg:office",
			137: "bldg:home",
			154: "bldg:park",
			156: "bldg:store",
			162: "bldg:home",
		},
	//},
	ecs: [ "/sys/apps/carworld/people.js" ]
}

let mycity = {
	uuid:"city",
	kind:"gltf",
	art: "/sys/assets/blendercity2.glb",
}

let mysound = {
	id:"horn",
	uuid:"horn",
	kind:"sound",
	art: '/sys/assets/horn.wav'
}

let vehicle1 = {
	uuid:"vehicle1",
	kind:"gltf",
	art: "/sys/assets/sedan.glb",
	xyz: [0,0,0],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
	children: [ mysound ]
}

let vehicle2 = {
	uuid:"vehicle2",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle3 = {
	uuid:"vehicle3",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle4 = {
	uuid:"vehicle4",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle5 = {
	uuid:"vehicle5",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle6 = {
	uuid:"vehicle6",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle7 = {
	uuid:"vehicle7",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle8 = {
	uuid:"vehicle8",
	kind:"gltf",
	art: "/sys/assets/van.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}

let vehicle9 = {
	uuid:"vehicle9",
	kind:"gltf",
	art: "/sys/assets/sedan.glb",
	xyz: [ 0,0,-10 ],
	ypr: [0,0,0],
	ecs: [ "/sys/apps/carworld/vehicle.js" ],
	collide: 1000,
}


let mydata = [

	// mandatory atm - todo remove as mandatory element
	{ uuid:"scene1", kind:"scene", },

	// mandatory atm
	mycamera,

	// required for shadows
	mylight,

	// entire city in one go
	mycity,

	// avatar itself
	myavatar,

	// a person, and their representation
	myperson,

	vehicle1,
	vehicle2,
	vehicle4,
	vehicle5,
	vehicle6,
	vehicle7,
	vehicle8,
	vehicle9,
]

/*
	// some poi
	{ uuid:"bldg1", kind:"box", subkind:"bldg:office",xyz:[-2,0,-2] },
	{ uuid:"bldg2", kind:"box", subkind:"bldg:home",xyz:[ 2,0,-2] },
	{ uuid:"bldg3", kind:"box", subkind:"bldg:park",xyz:[ 2,0,2] },
	{ uuid:"bldg4", kind:"box", subkind:"bldg:store",xyz:[-2,0,2] },
*/

//	{ uuid:"bldg5", kind:"sphere", xyz:[  0,10,65], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
//	{ uuid:"bldg6", kind:"sphere", xyz:[  0,10,-65], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
//	{ uuid:"bldg7", kind:"sphere", xyz:[-20,10,-2], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
//	{ uuid:"bldg8", kind:"sphere", xyz:[-20,10,-2], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

/*
	{ uuid:"poi10", routes:["poi20","poi70"],         kind:"sphere", subkind:"intersection", xyz:[   0, 0,  -5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi20", routes:["poi10","poi30","poi80"], kind:"sphere", subkind:"intersection", xyz:[   0, 0, -75], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi30", routes:["poi20","poi90"],         kind:"sphere", subkind:"intersection", xyz:[   0, 0,-115], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

	{ uuid:"poi70", routes:["poi10","poi80"],         kind:"sphere", subkind:"intersection", xyz:[ -70, 0,  -5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi80", routes:["poi20","poi70","poi90"], kind:"sphere", subkind:"intersection", xyz:[ -70, 0, -75], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi90", routes:["poi30","poi80"],         kind:"sphere", subkind:"intersection", xyz:[ -70, 0,-115], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
*/

/*

	{ uuid:"poi010", kind:"sphere", xyz:[   2.5, 0,  -2.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi011", kind:"sphere", xyz:[   2.5, 0,  -7.5], material: { rgba:0xffffffff,alpha: 1.0, emissive:0xffffffff }, },
	{ uuid:"poi020", kind:"sphere", xyz:[   2.5, 0, -72.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi021", kind:"sphere", xyz:[   2.5, 0, -77.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi030", kind:"sphere", xyz:[   2.5, 0,-112.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi031", kind:"sphere", xyz:[   2.5, 0,-117.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

	{ uuid:"poi110", kind:"sphere", xyz:[  -2.5, 0,  -2.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi111", kind:"sphere", xyz:[  -2.5, 0,  -7.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi120", kind:"sphere", xyz:[  -2.5, 0, -72.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi121", kind:"sphere", xyz:[  -2.5, 0, -77.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi130", kind:"sphere", xyz:[  -2.5, 0,-112.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi131", kind:"sphere", xyz:[  -2.5, 0,-117.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

	{ uuid:"poi810", kind:"sphere", xyz:[ -67.5, 0,  -2.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi811", kind:"sphere", xyz:[ -67.5, 0,  -7.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi820", kind:"sphere", xyz:[ -67.5, 0, -72.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi821", kind:"sphere", xyz:[ -67.5, 0, -77.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi830", kind:"sphere", xyz:[ -67.5, 0,-112.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi831", kind:"sphere", xyz:[ -67.5, 0,-117.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

	{ uuid:"poi910", kind:"sphere", xyz:[ -72.5, 0,  -2.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi911", kind:"sphere", xyz:[ -72.5, 0,  -7.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi920", kind:"sphere", xyz:[ -72.5, 0, -72.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi921", kind:"sphere", xyz:[ -72.5, 0, -77.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi930", kind:"sphere", xyz:[ -72.5, 0,-112.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi931", kind:"sphere", xyz:[ -72.5, 0,-117.5], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },

	{ uuid:"poi4", kind:"sphere", xyz:[ -20, 10,  -2], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi5", kind:"sphere", xyz:[   0, 10,  65], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi6", kind:"sphere", xyz:[   0, 10, -65], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi7", kind:"sphere", xyz:[ -20, 10,  -2], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
	{ uuid:"poi8", kind:"sphere", xyz:[ -20, 10,  -2], material: { rgba:0xffff88ff,alpha: 0.5, emissive:0xffffffff }, },
*/


export default mydata

