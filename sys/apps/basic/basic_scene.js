
let mycamera = {
	uuid: "/myusername/apps/basic001/camera1",
	kind: "camera",
	latitude: 0,
	longitude: -Math.PI/2,
	radius: 5,
	xyz: [0,2,-15],
	lookat: [0,0,0],
	radiusmin: 2,
	radiusmax: 500,
	//arcrotatecamera: true,
	universal: true, // type of mouse control
	DONOTNETWORK: true,
}

let mylight1 = {
	uuid: "/myusername/apps/basic001/light1",
	kind: "directionallight",
	xyz: [0,0,0],
	dir: [0,-1,-1],
	intensity: 0.5,
	DONOTNETWORK: true,
}

let mylight2 = {
	uuid: "/myusername/apps/basic001/light2",
	kind: "hemisphericlight",
	intensity: 5.0,
	DONOTNETWORK: true,
}


let mylights = {
	uuid: "/myusername/apps/basic001/lights",
	kind: "group",
	children: [ mylight1, mylight2 ],
	DONOTNETWORK: true,
}

let mything1 = {
	uuid:"/myusername/apps/basic001/thing1",
	kind:"box",
	xyz:[0,0,0],
	whd:[1,0.01,1],
	ypr:[0,0,0],
	material: { rgba:0xff0000ff, emissive:0xffff0000, alpha:1.0 },
}

let mything2 = {
	uuid:"/myusername/apps/basic001/thing2",
	kind:"sphere",
	xyz:[1,0,1],
	whd:[1,0.01,1],
	ypr:[0,0,0],
}

let mything3 = {
	uuid:"/myusername/apps/basic001/thing3",
	kind:"box",
	xyz:[3,0,3],
	ypr:[0,0,0],
}

let myux = {
	uuid: "/myusername/apps/basic001/myux",
	kind: "textarea",
	DONOTNETWORK: true,
}

let myavatar = {
	uuid: "/myusername/apps/basic001/myavatar",
	avatar: true,
	camera: "/myusername/apps/basic001/camera1",
	kind: "gltf",
	art: "/sys/assets/female.glb",
	adjust: {xyz:[0,0,0],ypr:[0,3.1459,0]},
	whd: [1,1,1],
	xyz: [0,0,0],
	ypr: [0,0,0],
	pickable: true,
}


let myscene = {
	uuid: "/myusername/apps/basic001",
	kind: "scene",
	children: [ mycamera, mylights, mything1, myux, myavatar ],
	DONOTNETWORK: true,
}

export { myscene, myavatar }
