
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
	      dir: [0,-1,-1],
	intensity: 35.0,
}

let mylight_ambient = {
	     uuid: "/mylight1",
	     kind: "light",
	  network: "static",
	      dir: [0,-1,-1],
	intensity: 35.0,
}

//
// ground
//

let myground = {
	uuid: "/myground",
	kind:"gltf",
	network:"static",
	physics:{shape:"box",mass:0},
	xyz:[0,2,0],
	whd:[400,400,400],
    art: "/sys/assets/city.glb",
}


//
// avatar - since each player brings this - it should be locally unique
// TODO - is it a bad hack to peek at the pool for this?
//

let myavatar = {
	    uuid: "/myavatar",
	    kind: "gltf",
	 network: "dynamic",
	     art: "/sys/assets/female.glb",
	  adjust: {xyz:[0,0,0],ypr:[0,1.9,0]},
	     whd: [1,1,1],
	     xyz: [0,1,0],
	    xyzd: [0,1,0],
	     ypr: [0,0,0],
	    yprd: [0,0,0],
	pickable: true,
	//physics:{shape:"box",mass:0.1},
	//debugbox: "/sys/assets/textures/ground.jpg",
	//speculative_networking:true
}

///////////////////////////////////////////////////////////////////////////////////////

let mylayout = [

	{ kind:"scene", uuid:"scene1", },

	mycamera,
	mylight_positional,
	mylight_ambient,
	myground,
]

export default { mylayout, myavatar }