
let mycamera = {
	      uuid: "/myusername/apps/basic001/camera1",
	      kind: "camera",
	       xyz: [0,0,30],
	    lookat: [0,0,0],
	networking: false,
//	 universal: true,
		arcrotatecamera: true,
}

let mylight1 = {
	uuid: "/myusername/apps/basic001/light1",
	kind: "directionallight",
	xyz: [0,0,0],
	dir: [0,-1,-1],
	intensity: 0.5,
}

let mylight2 = {
	uuid: "/myusername/apps/basic001/light2",
	kind: "hemisphericlight",
	intensity: 2.0,
}


let mylights = {
	uuid: "/myusername/apps/basic001/lights",
	kind: "group",
	children: [ mylight1, mylight2 ],
}

let myground = {
	uuid: "/myusername/apps/basic001/myground",
	kind:"gltf",
	network:"static",
	physics:{shape:"box",mass:0},
	xyz:[0,0,0],
	whd:[0.01,0.01,0.01],
//	whd:[400,400,400],
//	recenter: true,
//	rescale: true,
    art: "/sys/assets/reef.glb",
}

let myavatar = {
	uuid: "/myusername/apps/basic001/myavatar_network",
	avatar: true,
	camera: "/myusername/apps/basic001/camera1",
	kind: "gltf",
	art: "/sys/assets/diver/scene.gltf",
	adjust: {xyz:[0,0,0],ypr:[0,3.1459,0]},
	whd: [1,1,1],
	xyz: [-4,0.5,-4],
	ypr: [0,3.7,0],
	pickable: true,
}

let myscene = {
	uuid: "/myusername/apps/basic001/scene",
	kind: "scene",
	children: [ mycamera, mylights, myground ],
}

export { myscene, myavatar }